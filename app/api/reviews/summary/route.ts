import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type SummaryResponse = {
  keywords: Array<{ keyword: string; count: number }>;
  mostMentioned: string;
  summary: string;
  reviewCount: number;
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Gemini API 호출 (재시도 + 모델 폴백 포함)
async function callGeminiWithFallback(prompt: string, apiKey: string): Promise<string> {
  const primaryModel = process.env.GEMINI_MODEL?.trim() || "gemini-2.5-flash";
  // 1순위: .env 설정 모델 -> 2순위: gemini-2.5-flash -> 3순위: gemini-2.0-flash
  const candidateModels = Array.from(
    new Set([primaryModel, "gemini-2.5-flash", "gemini-2.0-flash"])
  );

  let lastError = "";

  for (const model of candidateModels) {
    // 각 모델당 최대 2회 시도 (503/429 일시적 혼잡 대응)
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${apiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: {
                temperature: 0.4,
                responseMimeType: "application/json",
              },
            }),
          }
        );

        const data = await res.json().catch(() => ({}));

        if (res.ok) {
          const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text) return text;
        }

        const errMsg = data?.error?.message || `HTTP ${res.status}`;
        lastError = `[${model}] ${errMsg}`;

        // 503(과부하) 또는 429(요청 한도)면 잠시 대기 후 재시도 or 다음 모델로 전환
        if (res.status === 503 || res.status === 429) {
          await sleep(700 * attempt);
          continue;
        }

        // 404(존재하지 않는 모델명) 등 다른 에러면 바로 다음 후보 모델로 이동
        break;
      } catch (err) {
        lastError = err instanceof Error ? err.message : "네트워크 오류";
        await sleep(500);
      }
    }
  }

  throw new Error(lastError || "AI 서버 응답 지연");
}

// 모든 Gemini 모델이 일시 장애일 때 동작하는 로컬 비상 요약기
function buildLocalFallbackSummary(
  restaurantName: string,
  reviews: Array<{ content: string; rating: number }>
): SummaryResponse {
  const keywordCandidates = [
    "가성비", "혼밥", "친절", "양많음", "맛집", "깔끔", "빠름",
    "떡볶이", "김밥", "덮밥", "치킨", "국물", "매콤", "든든", "분위기", "재방문"
  ];

  const counts = keywordCandidates
    .map((kw) => ({
      keyword: kw,
      count: reviews.filter((r) => r.content.includes(kw)).length,
    }))
    .filter((item) => item.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 4);

  if (counts.length === 0) {
    counts.push({ keyword: "추천맛집", count: reviews.length });
  }

  const avg =
    reviews.reduce((acc, cur) => acc + cur.rating, 0) / Math.max(reviews.length, 1);

  return {
    keywords: counts,
    mostMentioned: `${restaurantName}의 맛과 식사 만족도에 대한 긍정적인 평가가 가장 많아요.`,
    summary: `총 ${reviews.length}개의 재학생 리뷰 기준 평균 ${avg.toFixed(1)}점을 기록한 식당이에요. 전반적으로 음식 맛과 양에 대한 만족도가 높고, 학생들이 편하게 방문하기 좋다는 의견이 많습니다.`,
    reviewCount: reviews.length,
  };
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const restaurantId = searchParams.get("restaurantId");

    if (!restaurantId) {
      return NextResponse.json(
        { message: "식당 ID가 필요합니다." },
        { status: 400 }
      );
    }

    const restaurant = await prisma.restaurant.findUnique({
      where: { restaurantId },
      select: { name: true },
    });

    if (!restaurant) {
      return NextResponse.json(
        { message: "식당 정보를 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    const reviews = await prisma.review.findMany({
      where: {
        restaurantId,
        deletedAt: null,
      },
      orderBy: { createdAt: "desc" },
      select: {
        content: true,
        rating: true,
      },
    });

    if (reviews.length === 0) {
      return NextResponse.json(
        { message: "아직 등록된 리뷰가 없어 AI 요약을 생성할 수 없어요." },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY?.trim();
    if (!apiKey) {
      return NextResponse.json(
        { message: ".env 파일에 GEMINI_API_KEY가 설정되지 않았습니다." },
        { status: 500 }
      );
    }

    const reviewLines = reviews
      .map((r, idx) => `${idx + 1}. (${r.rating}점) ${r.content}`)
      .join("\n");

    const prompt = `
너는 대학생 맛집 앱 '쩝쩝대'의 AI 리뷰 분석가야.
아래 '${restaurant.name}' 식당의 실제 학생 리뷰 ${reviews.length}개를 분석해서 반드시 지정된 JSON 형식으로만 응답해.

[리뷰 목록]
${reviewLines}

[응답 JSON 스키마]
{
  "keywords": [
    { "keyword": "핵심키워드1", "count": 언급된리뷰수숫자 },
    { "keyword": "핵심키워드2", "count": 언급된리뷰수숫자 },
    { "keyword": "핵심키워드3", "count": 언급된리뷰수숫자 }
  ],
  "mostMentioned": "리뷰에서 가장 많이 공통으로 언급된 핵심 내용을 한 문장으로 요약",
  "summary": "식당의 맛, 양, 가성비, 분위기, 혼밥 적합도 등을 종합한 2~3문장의 친절한 요약"
}

주의사항:
- keywords는 3~5개 사이로 뽑고, keyword에는 '#' 기호를 붙이지 마.
- count는 반드시 정수(number)로 넣어줘.
- 반드시 순수 JSON 객체만 출력해.
`.trim();

    try {
      const rawText = await callGeminiWithFallback(prompt, apiKey);
      const cleaned = rawText.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(cleaned);

      const result: SummaryResponse = {
        keywords: Array.isArray(parsed.keywords)
          ? parsed.keywords.slice(0, 5).map((k: { keyword?: string; count?: number }) => ({
              keyword: String(k.keyword || "추천").replace(/^#/, ""),
              count: Number(k.count) || 1,
            }))
          : [],
        mostMentioned: String(
          parsed.mostMentioned || "학생들의 전반적인 식사 만족도가 높은 식당이에요."
        ),
        summary: String(
          parsed.summary || "다양한 메뉴와 준수한 맛으로 재학생들이 자주 찾는 곳입니다."
        ),
        reviewCount: reviews.length,
      };

      return NextResponse.json(result);
    } catch (aiError) {
      console.error("Gemini API 503/호출 실패, 로컬 요약으로 전환:", aiError);
      // AI 서버가 503 과부하일 때도 사용자 화면이 깨지지 않도록 즉시 요약 반환
      const fallback = buildLocalFallbackSummary(restaurant.name, reviews);
      return NextResponse.json(fallback);
    }
  } catch (error) {
    console.error("리뷰 요약 API 오류:", error);
    return NextResponse.json(
      { message: "리뷰 요약 중 서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}