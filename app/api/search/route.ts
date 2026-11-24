import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { isInTargetRestaurantArea } from "../../../lib/appData";

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const query = (params.get("q") ?? "").trim();
  if (query.length < 1) return NextResponse.json({ suggestions: [] });
  try {
    const rows = await prisma.restaurant.findMany({
      where: { OR: [{ name: { contains: query } }, { categoryName: { contains: query } }, { addressName: { contains: query } }, { roadAddress: { contains: query } }, { menus: { some: { OR: [{ name: { contains: query } }, { keywords: { contains: query } }] } } }] },
      include: { menus: true }, orderBy: [{ avgRating: "desc" }, { name: "asc" }], take: 100,
    });
    const nearbyRows = rows.filter((row) => isInTargetRestaurantArea(row.latitude, row.longitude)).slice(0, 8);
    return NextResponse.json({ suggestions: nearbyRows.map((row) => ({ restaurantId: row.restaurantId, name: row.name, category: row.categoryName ?? row.category ?? "음식점", address: row.roadAddress ?? row.addressName ?? "부천대학교 주변", menuNames: row.menus.slice(0, 3).map((menu) => menu.name) })) });
  } catch { return NextResponse.json({ suggestions: [] }); }
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null) as { userId?: string; query?: string } | null;
  const query = body?.query?.trim();
  if (!body?.userId || !query) return NextResponse.json({ message: "검색어와 로그인 정보를 확인해주세요." }, { status: 400 });
  try { await prisma.searchHistory.create({ data: { userId: body.userId, query: query.slice(0, 100) } }); return NextResponse.json({ ok: true }, { status: 201 }); }
  catch { return NextResponse.json({ message: "검색 기록을 저장하지 못했습니다." }, { status: 500 }); }
}
