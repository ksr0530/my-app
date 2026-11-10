import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null) as { id?: string; email?: string; password?: string } | null;
  if (!body) return NextResponse.json({ message: "아이디와 비밀번호를 입력해주세요." }, { status: 400 });
  const identifier = body.id?.trim() || body.email?.trim();
  if (!identifier || !body.password) return NextResponse.json({ message: "아이디와 비밀번호를 입력해주세요." }, { status: 400 });
  try {
    if ((identifier === "admin" || identifier === "admin@jjupjjupdae.test") && body.password === "admin1234") {
      const admin = await prisma.user.upsert({ where: { id: "admin" }, update: { role: "ADMIN", ownerApprovalStatus: "NONE" }, create: { id: "admin", name: "쩝쩝대 관리자", email: "admin@jjupjjupdae.test", password: "admin1234", university: "쩝쩝대 운영팀", role: "ADMIN", ownerApprovalStatus: "NONE", isStudentVerified: true } });
      return NextResponse.json({ user: { id: admin.id, name: admin.name, email: admin.email, university: admin.university, isStudentVerified: true, role: admin.role, ownerApprovalStatus: admin.ownerApprovalStatus } });
    }
    const user = identifier.includes("@") ? await prisma.user.findUnique({ where: { email: identifier } }) : await prisma.user.findUnique({ where: { id: identifier } });
    if (!user || user.password !== body.password) return NextResponse.json({ message: "아이디 또는 비밀번호가 올바르지 않습니다." }, { status: 401 });
    return NextResponse.json({ user: { id: user.id, name: user.name, email: user.email, university: user.university, isStudentVerified: Boolean(user.isStudentVerified), role: user.role, ownerApprovalStatus: user.ownerApprovalStatus } });
  } catch { return NextResponse.json({ message: "데이터베이스 연결을 확인해주세요." }, { status: 500 }); }
}
