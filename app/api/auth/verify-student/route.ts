import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null) as { userId?: string } | null;
  if (!body?.userId) return NextResponse.json({ message: "로그인이 필요합니다." }, { status: 401 });

  try {
    const user = await prisma.user.update({ where: { id: body.userId }, data: { isStudentVerified: true } });
    return NextResponse.json({ userId: user.id, isStudentVerified: true });
  } catch {
    return NextResponse.json({ message: "재학생 인증 상태를 저장하지 못했습니다." }, { status: 500 });
  }
}
