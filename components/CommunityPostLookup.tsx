"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import CommunityDetail from "./CommunityDetail";
import type { CommunityCard } from "../lib/appData";

const STORAGE_KEY = "jjeopjjeop-community-posts";

export default function CommunityPostLookup({ serverPost }: { serverPost: CommunityCard | null }) {
  const [post, setPost] = useState<CommunityCard | null>(serverPost);
  const [loading, setLoading] = useState(serverPost == null);

  useEffect(() => {
    if (!serverPost) {
      try {
        const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]") as CommunityCard[];
        const localPost = Array.isArray(saved) ? saved.find((item) => item?.postId === window.location.pathname.split("/").pop()) : null;
        if (localPost) window.setTimeout(() => setPost(localPost), 0);
      } catch { /* use the not-found message below */ }
    }
    window.setTimeout(() => setLoading(false), 0);
  }, [serverPost]);

  if (loading) return <div className="flex min-h-screen items-center justify-center bg-[#FEEA9C] text-sm text-[#1A344F]">게시글을 불러오는 중...</div>;
  if (!post) return <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#FEEA9C] px-6 text-center text-[#1A344F]"><strong>게시글을 찾을 수 없어요.</strong><Link href="/community" className="rounded-md bg-[#1A344F] px-5 py-3 text-sm font-bold text-white">커뮤니티로 돌아가기</Link></div>;
  return <CommunityDetail post={post} />;
}
