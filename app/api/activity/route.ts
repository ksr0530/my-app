import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
export async function GET(request: Request) { const userId = new URL(request.url).searchParams.get("userId"); if (!userId) return NextResponse.json({reviews:[],posts:[]}); const [reviews,posts] = await Promise.all([prisma.review.findMany({where:{userId,deletedAt:null},include:{restaurant:true},orderBy:{createdAt:"desc"}}),prisma.community.findMany({where:{userId,deletedAt:null},orderBy:{createdAt:"desc"}})]); return NextResponse.json({reviews,posts}); }
