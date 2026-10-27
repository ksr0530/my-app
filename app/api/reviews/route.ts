import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null) as { userId?: string; restaurantId?: string; content?: string; rating?: number } | null;
  if (!body?.userId || !body.restaurantId || !body.content?.trim() || !body.rating || body.rating < 1 || body.rating > 5) return NextResponse.json({ message: "리뷰 내용과 별점을 확인해주세요." }, { status: 400 });
  try {
    const user = await prisma.user.findUnique({ where: { id: body.userId } });
    if (!user) return NextResponse.json({ message: "로그인이 필요합니다." }, { status: 401 });
    if (!user.isStudentVerified) return NextResponse.json({ message: "재학생 인증 후 리뷰를 작성할 수 있습니다." }, { status: 403 });
    const review = await prisma.review.create({ data: { reviewId: `review-${Date.now()}`, userId: body.userId, restaurantId: body.restaurantId, content: body.content.trim(), rating: body.rating } });
    const aggregate = await prisma.review.aggregate({ where: { restaurantId: body.restaurantId }, _avg: { rating: true } });
    await prisma.restaurant.update({ where: { restaurantId: body.restaurantId }, data: { avgRating: aggregate._avg.rating ?? 0 } });
    return NextResponse.json({ reviewId: review.reviewId }, { status: 201 });
  } catch {
    return NextResponse.json({ message: "리뷰 등록에 실패했습니다. DB 연결을 확인해주세요." }, { status: 500 });
  }
}
