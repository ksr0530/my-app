import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export async function GET(request: Request) {
  const id = new URL(request.url).searchParams.get("id")?.trim();
  if (!id) return NextResponse.json({ available: false, message: "아이디를 입력해주세요." }, { status: 400 });
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    return NextResponse.json({ available: !user, message: user ? "이미 사용 중인 아이디입니다." : "사용 가능한 아이디입니다." });
  } catch { return NextResponse.json({ available: false, message: "DB 연결을 확인해주세요." }, { status: 500 }); }
}
