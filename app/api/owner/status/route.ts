import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get("name")?.trim();
  const email = searchParams.get("email")?.trim();

  if (!name || !email) {
    return NextResponse.json({ message: "이름과 이메일을 입력해주세요." }, { status: 400 });
  }

  try {
    const application = await prisma.ownerApplication.findFirst({
      where: { user: { name, email } },
      include: { user: { select: { name: true, email: true } } },
      orderBy: { createdAt: "desc" },
    });

    if (!application) {
      return NextResponse.json({ message: "해당 정보의 가입 요청을 찾을 수 없습니다." }, { status: 404 });
    }

    return NextResponse.json({
      application: {
        applicationId: application.applicationId,
        name: application.user.name,
        email: application.user.email,
        restaurantName: application.restaurantName,
        businessNumber: application.businessNumber,
        status: application.status,
        rejectReason: application.rejectReason,
        createdAt: application.createdAt,
        reviewedAt: application.reviewedAt,
      },
    });
  } catch {
    return NextResponse.json({ message: "승인 결과를 불러오지 못했습니다." }, { status: 500 });
  }
}
