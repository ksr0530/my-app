import { NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";

async function ensureOwnerMember(postId: string, ownerId: string) {
  await prisma.communityMember.upsert({ where: { postId_userId: { postId, userId: ownerId } }, update: {}, create: { postId, userId: ownerId } });
}

export async function GET(_request: Request, { params }: { params: Promise<{ postId: string }> }) {
  const { postId } = await params;
  const post = await prisma.community.findUnique({ where: { postId } });
  if (!post) return NextResponse.json({ message: "게시글을 찾을 수 없어요." }, { status: 404 });
  const countBefore = await prisma.communityMember.count({ where: { postId } });
  if (countBefore === 0) await ensureOwnerMember(postId, post.userId);
  const members = await prisma.communityMember.findMany({ where: { postId }, include: { user: { select: { id: true, name: true } } }, orderBy: { joinedAt: "asc" } });
  return NextResponse.json({ members, currentCount: Math.max(post.currentCount, members.length) });
}

export async function POST(request: Request, { params }: { params: Promise<{ postId: string }> }) {
  const { postId } = await params;
  const body = await request.json().catch(() => null) as { userId?: string } | null;
  if (!body?.userId) return NextResponse.json({ message: "로그인이 필요합니다." }, { status: 401 });
  const post = await prisma.community.findUnique({ where: { postId } });
  if (!post || post.deletedAt) return NextResponse.json({ message: "게시글을 찾을 수 없어요." }, { status: 404 });
  let membersCount = await prisma.communityMember.count({ where: { postId } });
  if (membersCount === 0) { await ensureOwnerMember(postId, post.userId); membersCount = 1; }
  const existing = await prisma.communityMember.findUnique({ where: { postId_userId: { postId, userId: body.userId } } });
  const currentCount = Math.max(post.currentCount, membersCount);
  if (existing) return NextResponse.json({ joined: true, currentCount });
  if (currentCount >= post.targetCount) return NextResponse.json({ message: "모집 인원이 마감됐어요." }, { status: 409 });
  await prisma.communityMember.create({ data: { postId, userId: body.userId } });
  const nextCount = currentCount + 1;
  await prisma.community.update({ where: { postId }, data: { currentCount: nextCount, isClosed: nextCount >= post.targetCount } });
  return NextResponse.json({ joined: true, currentCount: nextCount });
}

export async function DELETE(request: Request, { params }: { params: Promise<{ postId: string }> }) {
  const { postId } = await params;
  const body = await request.json().catch(() => null) as { userId?: string } | null;
  if (!body?.userId) return NextResponse.json({ message: "로그인이 필요합니다." }, { status: 401 });
  const post = await prisma.community.findUnique({ where: { postId } });
  if (!post) return NextResponse.json({ message: "게시글을 찾을 수 없어요." }, { status: 404 });
  if (post.userId === body.userId) return NextResponse.json({ message: "게시글 작성자는 참여를 취소할 수 없어요." }, { status: 400 });
  await prisma.communityMember.deleteMany({ where: { postId, userId: body.userId } });
  const memberCount = await prisma.communityMember.count({ where: { postId } });
  const currentCount = Math.max(1, Math.min(post.currentCount, Math.max(memberCount, 1)));
  await prisma.community.update({ where: { postId }, data: { currentCount, isClosed: currentCount >= post.targetCount } });
  return NextResponse.json({ joined: false, currentCount });
}
