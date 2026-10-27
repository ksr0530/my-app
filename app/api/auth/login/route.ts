import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null) as { id?: string; email?: string; password?: string } | null;
  if (!body) return NextResponse.json({ message: "아이디와 비밀번호를 입력해주세요." }, { status: 400 });
  const identifier = body.id?.trim() || body.email?.trim();
  if (!identifier || !body.password) return NextResponse.json({ message: "아이디와 비밀번호를 입력해주세요." }, { status: 400 });
  try {
    const user = identifier.includes("@") ? await prisma.user.findUnique({ where: { email: identifier } }) : await prisma.user.findUnique({ where: { id: identifier } });
    if (!user || user.password !== body.password) return NextResponse.json({ message: "아이디 또는 비밀번호가 올바르지 않습니다." }, { status: 401 });
    return NextResponse.json({ user: { id: user.id, name: user.name, email: user.email, university: user.university, isStudentVerified: Boolean(user.isStudentVerified) } });
  } catch { return NextResponse.json({ message: "데이터베이스 연결을 확인해주세요." }, { status: 500 }); }
}
