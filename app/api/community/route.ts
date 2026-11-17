import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
export async function POST(request: Request) {
  const body = await request.json().catch(() => null) as { userId?: string; title?: string; content?: string; category?: string; targetCount?: number } | null;
  if (!body?.userId || !body.title?.trim() || !body.content?.trim() || !body.targetCount) return NextResponse.json({ message: "제목, 내용, 모집 인원을 확인해주세요." }, { status: 400 });
  const user = await prisma.user.findUnique({ where: { id: body.userId } });
  if (!user) return NextResponse.json({ message: "로그인이 필요합니다." }, { status: 401 });
  if (!user.isStudentVerified) return NextResponse.json({ message: "재학생 인증 후 게시글을 작성할 수 있습니다." }, { status: 403 });
  const post = await prisma.community.create({ data: { postId: `post-${Date.now()}`, userId: body.userId, title: body.title.trim(), content: body.content.trim(), category: body.category ?? "기타", targetCount: Number(body.targetCount), currentCount: 1, isClosed: false } });
  return NextResponse.json({ postId: post.postId }, { status: 201 });
}
