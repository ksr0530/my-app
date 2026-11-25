import { NextResponse } from "next/server";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const formData = await request.formData().catch(() => null);
  const file = formData?.get("file");
  if (!(file instanceof File)) return NextResponse.json({ message: "업로드할 사진을 선택해주세요." }, { status: 400 });
  if (!file.type.startsWith("image/")) return NextResponse.json({ message: "이미지 파일만 업로드할 수 있어요." }, { status: 400 });
  if (file.size > 5 * 1024 * 1024) return NextResponse.json({ message: "사진은 5MB 이하만 업로드할 수 있어요." }, { status: 400 });
  const extension = file.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
  const fileName = `review-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${extension}`;
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadDir, { recursive: true });
  await writeFile(path.join(uploadDir, fileName), Buffer.from(await file.arrayBuffer()));
  return NextResponse.json({ url: `/uploads/${fileName}` }, { status: 201 });
}
