import { NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";

export async function GET(_request: Request, { params }: { params: Promise<{ postId: string }> }) {
  const { postId } = await params;
  const comments = await prisma.communityComment.findMany({ where: { postId }, include: { user: { select: { name: true } } }, orderBy: { createdAt: "asc" } });
  return NextResponse.json(comments);
}

export async function POST(request: Request, { params }: { params: Promise<{ postId: string }> }) {
  const { postId } = await params;
  const body = await request.json().catch(() => null) as { userId?: string; content?: string } | null;
  if (!body?.userId || !body.content?.trim()) return NextResponse.json({ message: "댓글 내용을 입력해주세요." }, { status: 400 });
  const [post, user] = await Promise.all([prisma.community.findUnique({ where: { postId } }), prisma.user.findUnique({ where: { id: body.userId } })]);
  if (!post || post.deletedAt) return NextResponse.json({ message: "게시글을 찾을 수 없어요." }, { status: 404 });
  if (!user) return NextResponse.json({ message: "로그인이 필요합니다." }, { status: 401 });
  const comment = await prisma.communityComment.create({ data: { postId, userId: body.userId, content: body.content.trim() }, include: { user: { select: { name: true } } } });
  return NextResponse.json(comment, { status: 201 });
}
