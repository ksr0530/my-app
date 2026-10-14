"use client";

import { useState } from "react";
import type { CommunityCard } from "../lib/appData";

export default function CommunityBoard({ initialPosts }: { initialPosts: CommunityCard[] }) {
  const [posts, setPosts] = useState(initialPosts);
  const [joined, setJoined] = useState<string | null>(null);
  function join(postId: string) { setPosts((items) => items.map((post) => post.postId === postId && post.currentCount < post.targetCount ? { ...post, currentCount: post.currentCount + 1, isClosed: post.currentCount + 1 >= post.targetCount } : post)); setJoined(postId); }
  return <div className="mt-5 space-y-3">{posts.map((post, index) => <article key={post.postId} className="card overflow-hidden"><div className={`h-2 ${index % 2 ? "bg-[#f7a3a7]" : "bg-[#f5bd69]"}`} /><div className="p-4"><div className="flex items-start justify-between gap-3"><div><h2 className="text-sm font-black text-[#102f54]">{post.title}</h2><p className="mt-2 text-[11px] text-[#7a8490]">{post.author} · 방금 전</p></div><span className={`rounded-full px-3 py-1 text-[11px] font-black ${post.isClosed ? "bg-slate-200 text-slate-500" : "bg-[#f7a3a7] text-[#102f54]"}`}>{post.isClosed ? "모집완료" : `${post.currentCount}/${post.targetCount}`}</span></div><div className="mt-4 flex items-center justify-between rounded-lg bg-white/60 p-3"><p className="text-xs text-[#596878]">배달비를 나눠서 부담해요</p><button disabled={post.isClosed || joined === post.postId} onClick={() => join(post.postId)} className={`rounded-md px-3 py-2 text-[11px] font-black ${post.isClosed || joined === post.postId ? "bg-slate-200 text-slate-500" : "bg-[#102f54] text-white"}`}>{joined === post.postId ? "참여완료" : post.isClosed ? "마감" : "참여하기"}</button></div></div></article>)}</div>;
}
