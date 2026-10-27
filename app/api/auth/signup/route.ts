import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null) as { name?: string; email?: string; password?: string; university?: string } | null;
  if (!body?.name?.trim() || !body.email?.trim() || !body.password || !body.university?.trim()) return NextResponse.json({ message: "모든 항목을 입력해주세요." }, { status: 400 });
  if (body.password.length < 4) return NextResponse.json({ message: "비밀번호는 4자 이상 입력해주세요." }, { status: 400 });
  try {
    const user = await prisma.user.create({ data: { id: `user-${Date.now()}`, name: body.name.trim(), email: body.email.trim(), password: body.password, university: body.university.trim(), isStudentVerified: false } });
    return NextResponse.json({ user: { id: user.id, name: user.name, email: user.email, university: user.university, isStudentVerified: false } }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error && error.message.includes("Unique") ? "이미 가입된 이메일입니다." : "회원가입에 실패했습니다.";
    return NextResponse.json({ message }, { status: 409 });
  }
}
