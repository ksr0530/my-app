import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { BUCHEON_STATION, BUCHEON_UNIVERSITY, isInTargetRestaurantArea } from "../../../lib/appData";

function kakaoKey() {
  return process.env.KAKAO_REST_API_KEY ?? process.env.KAKAO_API_KEY ?? "";
}

const relatedKeywordPool = ["김치찌개", "된장찌개", "순두부찌개", "제육볶음", "부대찌개", "돈까스", "김밥", "떡볶이", "라면", "치킨", "피자", "햄버거", "쌀국수", "마라탕", "초밥", "국수", "냉면", "삼겹살"];

async function searchKakao(query: string) {
  const key = kakaoKey();
  if (!key) return [];
  const documents = new Map<string, any>();
  for (const center of [BUCHEON_UNIVERSITY, BUCHEON_STATION]) {
    const url = new URL("https://dapi.kakao.com/v2/local/search/keyword.json");
    url.searchParams.set("query", query);
    url.searchParams.set("x", String(center.longitude));
    url.searchParams.set("y", String(center.latitude));
    url.searchParams.set("radius", "1000");
    url.searchParams.set("size", "15");
    url.searchParams.set("sort", "distance");
    const response = await fetch(url, { headers: { Authorization: `KakaoAK ${key}` }, cache: "no-store" });
    if (!response.ok) continue;
    const data = await response.json();
    for (const item of data.documents ?? []) {
      if (item.category_group_code === "FD6" || item.category_group_name === "음식점") documents.set(item.id, item);
    }
  }
  const results = [];
  for (const item of documents.values()) {
    const categoryName = item.category_name ?? "음식점";
    const restaurant = await prisma.restaurant.upsert({
      where: { kakaoPlaceId: item.id },
      update: { name: item.place_name, categoryName, addressName: item.address_name, roadAddress: item.road_address_name || null, phone: item.phone || null, placeUrl: item.place_url || null, latitude: Number(item.y), longitude: Number(item.x) },
      create: { restaurantId: `kakao-${item.id}`, kakaoPlaceId: item.id, name: item.place_name, description: `${categoryName} · ${item.road_address_name || item.address_name || "부천대학교 주변"}`, category: "기타", categoryName, addressName: item.address_name, roadAddress: item.road_address_name || null, phone: item.phone || null, placeUrl: item.place_url || null, latitude: Number(item.y), longitude: Number(item.x) },
    });
    await prisma.restaurantMenu.upsert({ where: { menuId: `search-menu-${item.id}-${query}`.slice(0, 50) }, update: { name: query.slice(0, 100), keywords: query, restaurantId: restaurant.restaurantId }, create: { menuId: `search-menu-${item.id}-${query}`.slice(0, 50), name: query.slice(0, 100), keywords: query, restaurantId: restaurant.restaurantId } });
    results.push(restaurant);
  }
  return results.filter((row) => isInTargetRestaurantArea(row.latitude, row.longitude));
}

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const query = (params.get("q") ?? "").trim();
  if (query.length < 1) return NextResponse.json({ suggestions: [] });
  try {
    const rows = await prisma.restaurant.findMany({
      where: { OR: [{ name: { contains: query } }, { categoryName: { contains: query } }, { addressName: { contains: query } }, { roadAddress: { contains: query } }, { menus: { some: { OR: [{ name: { contains: query } }, { keywords: { contains: query } }] } } }] },
      include: { menus: true }, orderBy: [{ avgRating: "desc" }, { name: "asc" }], take: 100,
    });
    let nearbyRows = rows.filter((row) => isInTargetRestaurantArea(row.latitude, row.longitude)).slice(0, 8);
    if (!nearbyRows.length) nearbyRows = (await searchKakao(query)).map((row) => ({ ...row, menus: [] }));
    const menuKeywords = rows.flatMap((row) => row.menus.map((menu) => menu.name)).filter(Boolean);
    const relatedKeywords = [...new Set([...menuKeywords, ...relatedKeywordPool])]
      .filter((keyword) => keyword !== query && (keyword.includes(query) || query.includes(keyword)))
      .slice(0, 6);
    return NextResponse.json({ relatedKeywords, suggestions: nearbyRows.map((row) => ({ restaurantId: row.restaurantId, name: row.name, category: row.categoryName ?? row.category ?? "음식점", address: row.roadAddress ?? row.addressName ?? "부천대학교 주변", menuNames: row.menus.slice(0, 3).map((menu) => menu.name) })) });
  } catch { return NextResponse.json({ suggestions: [] }); }
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null) as { userId?: string; query?: string } | null;
  const query = body?.query?.trim();
  if (!body?.userId || !query) return NextResponse.json({ message: "검색어와 로그인 정보를 확인해주세요." }, { status: 400 });
  try { await prisma.searchHistory.create({ data: { userId: body.userId, query: query.slice(0, 100) } }); return NextResponse.json({ ok: true }, { status: 201 }); }
  catch { return NextResponse.json({ message: "검색 기록을 저장하지 못했습니다." }, { status: 500 }); }
}
