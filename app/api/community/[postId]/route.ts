import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export async function PATCH(request: Request, { params }: { params: Promise<{ postId: string }> }) {
  const { postId } = await params;
  const body = await request.json().catch(() => null) as { userId?: string; title?: string; content?: string; targetCount?: number } | null;
  const post = await prisma.community.findUnique({ where: { postId } });
  if (!post || post.deletedAt || post.userId !== body?.userId) return NextResponse.json({ message: "본인이 작성한 글만 수정할 수 있어요." }, { status: 403 });
  if (!body?.title?.trim() || !body.content?.trim() || !body.targetCount) return NextResponse.json({ message: "제목, 내용, 모집 인원을 확인해주세요." }, { status: 400 });
  const memberCount = await prisma.communityMember.count({ where: { postId } });
  if (Number(body.targetCount) < memberCount) return NextResponse.json({ message: `현재 참여자 ${memberCount}명보다 적게 설정할 수 없어요.` }, { status: 400 });
  const updated = await prisma.community.update({ where: { postId }, data: { title: body.title.trim(), content: body.content.trim(), targetCount: Number(body.targetCount), currentCount: memberCount, isClosed: memberCount >= Number(body.targetCount) } });
  return NextResponse.json(updated);
}

export async function DELETE(request: Request, { params }: { params: Promise<{ postId: string }> }) {
  const { postId } = await params;
  const body = await request.json().catch(() => ({})) as { userId?: string };
  const post = await prisma.community.findUnique({ where: { postId } });
  if (!post || post.deletedAt || post.userId !== body.userId) return NextResponse.json({ message: "본인이 작성한 글만 삭제할 수 있어요." }, { status: 403 });
  await prisma.community.update({ where: { postId }, data: { deletedAt: new Date() } });
  return NextResponse.json({ ok: true });
}
