import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

async function refreshRating(restaurantId: string) {
  const aggregate = await prisma.review.aggregate({ where: { restaurantId, deletedAt: null }, _avg: { rating: true } });
  await prisma.restaurant.update({ where: { restaurantId }, data: { avgRating: aggregate._avg.rating ?? 0 } });
}

export async function PATCH(request: Request, { params }: { params: Promise<{ reviewId: string }> }) {
  const { reviewId } = await params;
  const body = await request.json().catch(() => null) as { userId?: string; content?: string; rating?: number } | null;
  if (!body?.userId || !body.content?.trim() || !body.rating || body.rating < 1 || body.rating > 5) return NextResponse.json({ message: "내용과 별점을 확인해주세요." }, { status: 400 });
  const review = await prisma.review.findUnique({ where: { reviewId } });
  if (!review || review.deletedAt || review.userId !== body.userId) return NextResponse.json({ message: "본인이 작성한 리뷰만 수정할 수 있어요." }, { status: 403 });
  const updated = await prisma.review.update({ where: { reviewId }, data: { content: body.content.trim(), rating: Number(body.rating) } });
  await refreshRating(review.restaurantId);
  return NextResponse.json(updated);
}

export async function DELETE(request: Request, { params }: { params: Promise<{ reviewId: string }> }) {
  const { reviewId } = await params;
  const body = await request.json().catch(() => ({})) as { userId?: string };
  const review = await prisma.review.findUnique({ where: { reviewId } });
  if (!review || review.deletedAt || review.userId !== body.userId) return NextResponse.json({ message: "본인이 작성한 리뷰만 삭제할 수 있어요." }, { status: 403 });
  await prisma.review.update({ where: { reviewId }, data: { deletedAt: new Date() } });
  await refreshRating(review.restaurantId);
  return NextResponse.json({ ok: true });
}
