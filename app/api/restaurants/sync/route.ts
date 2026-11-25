import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

const centers = [{ x: 126.7789, y: 37.4894, label: "부천대학교" }, { x: 126.7826, y: 37.4840, label: "부천역" }];
const queries = ["맛집", "식당", "분식", "한식", "일식", "중식", "치킨", "피자", "햄버거", "패스트푸드"];
function apiKey() { return process.env.KAKAO_REST_API_KEY ?? process.env.KAKAO_API_KEY ?? process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY ?? ""; }
function foodCategory(categoryName: string) {
  if (categoryName.includes("한식")) return "한식";
  if (categoryName.includes("분식")) return "분식";
  if (categoryName.includes("일식") || categoryName.includes("일본")) return "일식";
  if (categoryName.includes("중식") || categoryName.includes("중국")) return "중식";
  if (categoryName.includes("치킨") || categoryName.includes("닭") || categoryName.includes("피자") || categoryName.includes("패스트푸드") || categoryName.includes("햄버거") || categoryName.includes("버거")) return "패스트푸드";
  return "기타";
}
export async function POST() {
  const key = apiKey();
  if (!key) return NextResponse.json({ message: "Kakao REST API 키가 없습니다. KAKAO_REST_API_KEY를 설정해주세요." }, { status: 500 });
  const documents = new Map<string, any>();
  try {
    for (const center of centers) for (const query of queries) {
      const url = new URL("https://dapi.kakao.com/v2/local/search/keyword.json"); url.searchParams.set("query", `${center.label} ${query}`); url.searchParams.set("x", String(center.x)); url.searchParams.set("y", String(center.y)); url.searchParams.set("radius", "1000"); url.searchParams.set("size", "15"); url.searchParams.set("sort", "distance");
      const response = await fetch(url, { headers: { Authorization: `KakaoAK ${key}` }, cache: "no-store" });
      if (!response.ok) continue; const data = await response.json(); for (const item of data.documents ?? []) if (item.category_group_code === "FD6" || item.category_group_name === "음식점") documents.set(item.id, item);
    }
    let count = 0;
    for (const item of documents.values()) { const categoryName = item.category_name ?? "음식점"; const category = foodCategory(categoryName); const restaurant = await prisma.restaurant.upsert({ where: { kakaoPlaceId: item.id }, update: { name: item.place_name, category, categoryName, addressName: item.address_name, roadAddress: item.road_address_name || null, phone: item.phone || null, placeUrl: item.place_url || null, latitude: Number(item.y), longitude: Number(item.x) }, create: { restaurantId: `kakao-${item.id}`, kakaoPlaceId: item.id, name: item.place_name, description: `${categoryName} · ${item.road_address_name || item.address_name || "부천대학교 주변"}`, category, categoryName, addressName: item.address_name, roadAddress: item.road_address_name || null, phone: item.phone || null, placeUrl: item.place_url || null, latitude: Number(item.y), longitude: Number(item.x) } }); await prisma.restaurantMenu.upsert({ where: { menuId: `kakao-menu-${item.id}` }, update: { name: categoryName.split(" > ").at(-1) ?? "대표 메뉴", keywords: categoryName, restaurantId: restaurant.restaurantId }, create: { menuId: `kakao-menu-${item.id}`, name: categoryName.split(" > ").at(-1) ?? "대표 메뉴", keywords: categoryName, restaurantId: restaurant.restaurantId } }); count++; }
    return NextResponse.json({ count, message: `${count}개의 식당을 동기화했습니다.` });
  } catch (error) { return NextResponse.json({ message: error instanceof Error ? error.message : "식당 동기화에 실패했습니다." }, { status: 500 }); }
}
