import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

type SummaryResult = {
  keywords: Array<{ keyword: string; count: number }>;
  mostMentioned: string;
  summary: string;
};

function parseSummary(text: string): SummaryResult | null {
  try {
    const parsed = JSON.parse(text) as Partial<SummaryResult>;
    if (!Array.isArray(parsed.keywords) || typeof parsed.mostMentioned !== "string" || typeof parsed.summary !== "string") return null;
    const keywords = parsed.keywords
      .filter((item): item is { keyword: string; count: number } => Boolean(item && typeof item.keyword === "string" && Number.isFinite(item.count)))
      .map((item) => ({ keyword: item.keyword.trim().slice(0, 30), count: Math.max(1, Math.round(item.count)) }))
      .filter((item) => item.keyword)
      .slice(0, 6);
    return keywords.length ? { keywords, mostMentioned: parsed.mostMentioned.trim(), summary: parsed.summary.trim() } : null;
  } catch {
    return null;
  }
}

export async function GET(request: Request) {
  const restaurantId = new URL(request.url).searchParams.get("restaurantId")?.trim();
  if (!restaurantId) return NextResponse.json({ message: "식당 ID가 필요합니다." }, { status: 400 });

  try {
    const restaurant = await prisma.restaurant.findUnique({ where: { restaurantId }, select: { name: true } });
    if (!restaurant) return NextResponse.json({ message: "식당 정보를 찾을 수 없습니다." }, { status: 404 });
    const reviews = await prisma.review.findMany({
      where: { restaurantId, deletedAt: null },
      select: { content: true, rating: true },
      orderBy: { createdAt: "desc" },
      take: 80,
    });
    if (!reviews.length) return NextResponse.json({ message: "요약할 리뷰가 아직 없어요." }, { status: 422 });

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return NextResponse.json({ message: "GEMINI_API_KEY가 서버 환경변수에 없습니다." }, { status: 500 });
    const model = process.env.GEMINI_MODEL ?? "gemini-2.5-flash";
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`;
    const prompt = [
      "너는 대학생 식당 앱의 리뷰 분석 도우미야.",
      "아래 리뷰만 근거로 한국어 JSON을 작성해. 리뷰에 없는 사실은 추가하지 마.",
      "keywords는 반복적으로 언급된 핵심 주제 최대 6개를 count와 함께 작성해.",
      "mostMentioned는 가장 많이 언급된 내용을 한 문장으로 작성해.",
      "summary는 전체 리뷰를 2~3문장으로 자연스럽게 요약해.",
      '반드시 {"keywords":[{"keyword":"주제","count":2}],"mostMentioned":"내용","summary":"요약"} 형식만 반환해.',
      `식당명: ${restaurant.name}`,
      `리뷰: ${JSON.stringify(reviews)}`,
    ].join("\n");
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.2, responseMimeType: "application/json", maxOutputTokens: 900 },
      }),
      cache: "no-store",
    });
    if (!response.ok) {
      const providerError = await response.text();
      console.error("Gemini review summary error:", response.status, providerError.slice(0, 500));
      let detail = "Gemini API 요청이 거부되었습니다.";
      try {
        const parsed = JSON.parse(providerError) as { error?: { message?: string } };
        if (parsed.error?.message) detail = parsed.error.message;
      } catch { /* provider response is not JSON */ }
      return NextResponse.json({ message: `AI 요약 실패 (${response.status}): ${detail}` }, { status: 502 });
    }
    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.map((part: { text?: string }) => part.text ?? "").join("") ?? "";
    const summary = parseSummary(text);
    if (!summary) {
      console.error("Gemini review summary returned no usable JSON:", JSON.stringify(data).slice(0, 500));
      return NextResponse.json({ message: "AI가 요약 결과를 만들지 못했습니다. 잠시 후 다시 시도해주세요." }, { status: 502 });
    }
    return NextResponse.json({ ...summary, reviewCount: reviews.length });
  } catch (error) {
    console.error("Review summary failed:", error);
    return NextResponse.json({ message: "리뷰 요약 중 오류가 발생했습니다." }, { status: 500 });
  }
}
