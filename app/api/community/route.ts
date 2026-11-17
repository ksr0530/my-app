import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
export async function POST(request: Request) {
  const body = await request.json().catch(() => null) as { userId?: string; title?: string; content?: string; category?: string; targetCount?: number } | null;
  if (!body?.userId || !body.title?.trim() || !body.content?.trim() || !body.targetCount || Number(body.targetCount) < 1) return NextResponse.json({ message: "제목, 내용, 모집 인원을 확인해주세요." }, { status: 400 });
  try {
    const user = await prisma.user.findUnique({ where: { id: body.userId } });
    if (!user) return NextResponse.json({ message: "로그인 사용자 정보를 찾을 수 없습니다." }, { status: 401 });
    if (!user.isStudentVerified) return NextResponse.json({ message: "재학생 인증 후 게시글을 작성할 수 있습니다." }, { status: 403 });
    const post = await prisma.community.create({ data: { postId: `post-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, userId: body.userId, title: body.title.trim(), content: body.content.trim(), category: body.category ?? "기타", targetCount: Number(body.targetCount), currentCount: 1, isClosed: false } });
    return NextResponse.json({ postId: post.postId }, { status: 201 });
  } catch (error) {
    console.error("Community post creation failed:", error);
    return NextResponse.json({ message: "게시글 저장에 실패했어요. DB 연결과 Community 테이블을 확인해주세요." }, { status: 500 });
  }
}
