import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { isInTargetRestaurantArea } from "../../../lib/appData";

type Candidate = { restaurantId: string; name: string; description: string | null; category: string | null; categoryName: string | null; avgRating: number; reviewCount: number; menuNames: string[]; score: number };
type AiPick = { restaurantId: string; reason: string };

function fallbackRecommendations(candidates: Candidate[], queries: string[]) {
  return candidates.sort((a, b) => b.score - a.score).slice(0, 4).map((item) => ({ restaurantId: item.restaurantId, name: item.name, description: item.description, avgRating: item.avgRating, reviewCount: item.reviewCount, reason: queries.length ? "최근 검색 취향과 평점·리뷰를 함께 고려했어요." : "부천대학교 주변에서 평점과 리뷰가 좋은 식당이에요." }));
}

async function askGemini(candidates: Candidate[], queries: string[]): Promise<AiPick[]> {
  const key = process.env.GEMINI_API_KEY;
  if (!key || !candidates.length) return [];
  const model = process.env.GEMINI_MODEL ?? "gemini-2.5-flash";
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(key)}`;
  const compact = candidates.slice(0, 20).map(({ restaurantId, name, description, categoryName, avgRating, reviewCount, menuNames }) => ({ restaurantId, name, description, category: categoryName, avgRating, reviewCount, menus: menuNames }));
  const prompt = `너는 부천대학교와 부천역 주변 식당 추천 도우미야. 사용자의 최근 검색어를 참고해서 후보 식당 중 최대 4개를 고르고, 각 식당을 추천하는 자연스러운 한국어 이유를 1문장으로 작성해. 검색어가 없으면 평점과 리뷰 수를 고려해 인기 식당을 추천해. 반드시 JSON 배열만 반환하고 마크다운은 쓰지 마. 각 원소 형식은 {"restaurantId":"후보 ID","reason":"추천 이유"}야. 최근 검색어: ${JSON.stringify(queries)} 후보: ${JSON.stringify(compact)}`;
  const response = await fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { temperature: 0.3, responseMimeType: "application/json", maxOutputTokens: 800 } }), cache: "no-store" });
  if (!response.ok) return [];
  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.map((part: { text?: string }) => part.text ?? "").join("") ?? "[]";
  const parsed = JSON.parse(text) as AiPick[];
  return Array.isArray(parsed) ? parsed.filter((item) => candidates.some((candidate) => candidate.restaurantId === item.restaurantId) && item.reason).slice(0, 4) : [];
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
      return { restaurantId: restaurant.restaurantId, name: restaurant.name, description: restaurant.description, category: restaurant.category, categoryName: restaurant.categoryName, avgRating: restaurant.avgRating ?? 0, reviewCount: restaurant._count.reviews, menuNames: restaurant.menus.map((menu) => menu.name), score: matches.length * 10 + (restaurant.avgRating ?? 0) * 2 + restaurant._count.reviews * 0.1 };
    });
    let recommendations = fallbackRecommendations([...candidates], queries);
    try {
      const aiPicks = await askGemini(candidates, queries);
      if (aiPicks.length) recommendations = aiPicks.map((pick) => { const candidate = candidates.find((item) => item.restaurantId === pick.restaurantId)!; return { restaurantId: candidate.restaurantId, name: candidate.name, description: candidate.description, avgRating: candidate.avgRating, reviewCount: candidate.reviewCount, reason: pick.reason }; });
    } catch { /* Gemini 장애 시 fallback 추천을 유지 */ }
    return NextResponse.json({ recommendations });
  } catch { return NextResponse.json({ recommendations: [] }); }
}
