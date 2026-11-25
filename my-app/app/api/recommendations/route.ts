import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { isInTargetRestaurantArea } from "../../../lib/appData";

type Candidate = { restaurantId: string; name: string; description: string | null; imageUrl: string | null; category: string | null; categoryName: string | null; avgRating: number; reviewCount: number; menuNames: string[]; score: number };
type AiPick = { restaurantId: string; reason: string };

function fallbackRecommendations(candidates: Candidate[], queries: string[]) {
  return candidates.sort((a, b) => b.score - a.score).slice(0, 4).map((item) => ({ restaurantId: item.restaurantId, name: item.name, description: item.description, imageUrl: item.imageUrl, avgRating: item.avgRating, reviewCount: item.reviewCount, reason: queries.length ? "최근 검색 취향과 평점·리뷰를 함께 고려했어요." : "부천대학교 주변에서 평점과 리뷰가 좋은 식당이에요." }));
}

async function askGemini(candidates: Candidate[], queries: string[]): Promise<{ picks: AiPick[]; error?: string }> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return { picks: [], error: "GEMINI_API_KEY가 서버 환경변수에 없습니다." };
  if (!candidates.length) return { picks: [], error: "추천할 식당 후보가 DB에 없습니다." };
  const configuredModel = process.env.GEMINI_MODEL?.trim();
  const model = configuredModel || "gemini-2.5-flash";
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(key)}`;
    const compact = candidates.slice(0, 20).map(({ restaurantId, name, description, categoryName, avgRating, reviewCount, menuNames }) => ({ restaurantId, name, description, category: categoryName, avgRating, reviewCount, menus: menuNames }));
  const prompt = `너는 부천대학교와 부천역 주변 식당 추천 도우미야. 사용자의 최근 검색어를 참고해서 후보 식당 중 최대 4개를 고르고, 각 식당을 추천하는 자연스러운 한국어 이유를 1문장으로 작성해. 검색어가 없으면 평점과 리뷰 수를 고려해 인기 식당을 추천해. 반드시 JSON 배열만 반환하고 마크다운은 쓰지 마. 각 원소 형식은 {"restaurantId":"후보 ID","reason":"추천 이유"}야. 최근 검색어: ${JSON.stringify(queries)} 후보: ${JSON.stringify(compact)}`;
  const requestBody = JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { temperature: 0.3, responseMimeType: "application/json", maxOutputTokens: 1200, thinkingConfig: { thinkingBudget: 0 } } });
  let response: Response | undefined;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);
    try {
      response = await fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: requestBody, cache: "no-store", signal: controller.signal });
    } catch (error) {
      clearTimeout(timeout);
      if (attempt === 2) return { picks: [], error: error instanceof Error && error.name === "AbortError" ? "Gemini 요청이 12초 안에 응답하지 않았습니다." : `Gemini 네트워크 오류: ${error instanceof Error ? error.message : "알 수 없는 오류"}` };
      await new Promise((resolve) => setTimeout(resolve, 800 * (attempt + 1)));
      continue;
    }
    clearTimeout(timeout);
    if (response.ok || ![429, 500, 502, 503, 504].includes(response.status) || attempt === 2) break;
    await new Promise((resolve) => setTimeout(resolve, 800 * (attempt + 1)));
  }
  if (!response) return { picks: [], error: "Gemini 응답이 없습니다." };
  if (!response.ok) {
    const errorBody = await response.text().catch(() => "");
    return { picks: [], error: `Gemini API ${response.status}: ${errorBody.slice(0, 180)}` };
  }
  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.map((part: { text?: string }) => part.text ?? "").join("")?.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim() ?? "[]";
  try {
    const parsed = JSON.parse(text) as AiPick[];
    return { picks: Array.isArray(parsed) ? parsed.filter((item) => candidates.some((candidate) => candidate.restaurantId === item.restaurantId) && item.reason).slice(0, 4) : [], error: Array.isArray(parsed) ? undefined : "Gemini 응답이 배열 형식이 아닙니다." };
  } catch {
    return { picks: [], error: "Gemini 응답 JSON을 해석하지 못했습니다." };
  }
}

export async function GET(request: Request) {
  const userId = new URL(request.url).searchParams.get("userId");
  try {
    const [restaurants, histories] = await Promise.all([
      prisma.restaurant.findMany({ include: { _count: { select: { reviews: true } }, menus: true }, orderBy: [{ avgRating: "desc" }, { name: "asc" }], take: 30 }),
      userId ? prisma.searchHistory.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take: 20 }) : Promise.resolve([]),
    ]);
    const queries = histories.map((item) => item.query.toLowerCase());
    const candidates: Candidate[] = restaurants.filter((restaurant) => isInTargetRestaurantArea(restaurant.latitude, restaurant.longitude)).map((restaurant) => {
      const searchable = [restaurant.name, restaurant.categoryName, restaurant.category, restaurant.addressName, restaurant.roadAddress, ...restaurant.menus.flatMap((menu) => [menu.name, menu.keywords])].filter(Boolean).join(" ").toLowerCase();
      const matches = queries.filter((query) => searchable.includes(query));
      return { restaurantId: restaurant.restaurantId, name: restaurant.name, description: restaurant.description, imageUrl: restaurant.imageUrl, category: restaurant.category, categoryName: restaurant.categoryName, avgRating: restaurant.avgRating ?? 0, reviewCount: restaurant._count.reviews, menuNames: restaurant.menus.map((menu) => menu.name), score: matches.length * 10 + (restaurant.avgRating ?? 0) * 2 + restaurant._count.reviews * 0.1 };
    });
    let recommendations = fallbackRecommendations([...candidates], queries);
    let source = "fallback";
    let geminiError: string | undefined;
    try {
      const aiResult = await askGemini(candidates, queries);
      geminiError = aiResult.error;
      if (aiResult.picks.length) { source = "gemini"; recommendations = aiResult.picks.map((pick) => { const candidate = candidates.find((item) => item.restaurantId === pick.restaurantId)!; return { restaurantId: candidate.restaurantId, name: candidate.name, description: candidate.description, imageUrl: candidate.imageUrl, avgRating: candidate.avgRating, reviewCount: candidate.reviewCount, reason: pick.reason }; }); }
    } catch (error) { geminiError = error instanceof Error ? error.message : "Gemini 호출 중 알 수 없는 오류가 발생했습니다."; }
    return NextResponse.json({ recommendations, source, debug: { candidateCount: candidates.length, searchHistoryCount: queries.length, geminiError: geminiError ?? null } });
  } catch { return NextResponse.json({ recommendations: [] }); }
}
