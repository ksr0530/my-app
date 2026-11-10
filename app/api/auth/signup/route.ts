import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null) as { id?: string; name?: string; email?: string; password?: string; university?: string; accountType?: "USER" | "OWNER"; restaurantName?: string; businessNumber?: string } | null;
  if (!body?.id?.trim() || !body.name?.trim() || !body.email?.trim() || !body.password || !body.university?.trim()) return NextResponse.json({ message: "모든 항목을 입력해주세요." }, { status: 400 });
  if (body.password.length < 4) return NextResponse.json({ message: "비밀번호는 4자 이상 입력해주세요." }, { status: 400 });
  try {
    const owner = body.accountType === "OWNER";
    const user = await prisma.user.create({ data: { id: body.id.trim(), name: body.name.trim(), email: body.email.trim(), password: body.password, university: body.university.trim(), isStudentVerified: false, role: owner ? "OWNER" : "USER", ownerApprovalStatus: owner ? "PENDING" : "NONE" } });
    if (owner) await prisma.ownerApplication.create({ data: { applicationId: `owner-${Date.now()}`, userId: user.id, restaurantName: body.restaurantName?.trim() || "미정 식당", businessNumber: body.businessNumber?.trim() || null, reason: "사장님 계정 가입 요청" } });
    return NextResponse.json({ user: { id: user.id, name: user.name, email: user.email, university: user.university, isStudentVerified: false, role: user.role } }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error && error.message.includes("Unique") ? "이미 사용 중인 아이디 또는 이메일입니다." : "회원가입에 실패했습니다.";
    return NextResponse.json({ message }, { status: 409 });
  }
}
