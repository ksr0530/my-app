"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { CommunityCard } from "../lib/appData";

type Props = { initialPosts: CommunityCard[] };
const categories = ["전체", "분식", "한식", "일식", "중식", "디저트", "기타"];

function matchesCategory(post: CommunityCard, category: string) {
  if (category === "전체") return true;
  const text = `${post.title} ${post.description ?? ""} ${post.category ?? ""}`;
  if (category === "기타") return !["분식", "한식", "일식", "중식", "디저트"].some((item) => text.includes(item));
  return text.includes(category);
}

export default function CommunityBoard({ initialPosts }: Props) {
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("전체");

  const filteredPosts = useMemo(() => {
    const normalized = keyword.trim().toLowerCase();
    return initialPosts.filter((post) => {
      const matchesKeyword = !normalized || `${post.title} ${post.author} ${post.description ?? ""}`.toLowerCase().includes(normalized);
      return matchesKeyword && matchesCategory(post, category);
    });
  }, [keyword, category, initialPosts]);

  return (
    <>
      <div className="mt-5 flex h-10 items-center gap-2 rounded-[7px] border border-[#1A344F]/20 bg-white/80 px-3">
        <span className="text-[20px] leading-none text-[#1A344F]/70">⌕</span>
        <input value={keyword} onChange={(event) => setKeyword(event.target.value)} aria-label="커뮤니티 글 검색" className="w-full border-0 bg-transparent p-0 text-[12px] outline-none placeholder:text-[#1A344F]/45" placeholder="커뮤니티 글을 검색해보세요" />
      </div>

      <div className="mt-5 flex items-center justify-between">
        <h2 className="text-[20px] font-black tracking-[-0.07em]">커뮤니티</h2>
        <span className="text-[11px] font-bold text-[#1A344F]/55">최신순 ˅</span>
      </div>

      <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
        {categories.map((item) => (
          <button key={item} type="button" onClick={() => setCategory(item)} className={`shrink-0 rounded-[5px] border px-3 py-1.5 text-[11px] font-bold ${category === item ? "border-[#1A344F] bg-[#1A344F] text-white" : "border-[#1A344F]/20 bg-white/55 text-[#1A344F]/70"}`}>
            {item}
          </button>
        ))}
      </div>

      <div className="mt-3 flex items-center justify-between border-b border-[#1A344F]/20 pb-2">
        <p className="text-[11px] font-bold text-[#1A344F]/60">총 {filteredPosts.length}개의 게시글</p>
        <span className="text-[11px] text-[#1A344F]/50">검색</span>
      </div>

      <div className="mt-2 divide-y divide-[#1A344F]/15 border-y border-[#1A344F]/15">
        {filteredPosts.map((post, index) => {
          const closed = post.isClosed || post.currentCount >= post.targetCount;
          return (
            <article key={post.postId} className="bg-white/60 px-3 py-3.5">
              <Link href={`/community/${post.postId}`} className="block rounded-[4px] text-left transition-colors hover:bg-white/50">
                <div className="flex items-start gap-3">
                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-[5px] text-[22px] ${index % 3 === 0 ? "bg-[#F4C2C1]" : index % 3 === 1 ? "bg-[#F7D878]" : "bg-[#D6DDBB]"}`}>{index % 3 === 0 ? "🍚" : index % 3 === 1 ? "🍱" : "🥗"}</div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="truncate text-[13px] font-black tracking-[-0.04em] text-[#1A344F]">{post.title}</h3>
                      <span className={`shrink-0 rounded-[4px] px-1.5 py-1 text-[10px] font-black ${closed ? "bg-[#1A344F]/10 text-[#1A344F]/50" : "bg-[#F4A9A8] text-[#1A344F]"}`}>{closed ? "모집완료" : `${post.currentCount}/${post.targetCount}`}</span>
                    </div>
                    <p className="mt-2 truncate text-[11px] leading-4 text-[#1A344F]/60">{post.description ?? "같이 주문하고 밥친구를 찾아요"}</p>
                    <p className="mt-1 text-[10px] text-[#1A344F]/45">{post.author} · 방금 전</p>
                  </div>
                </div>
              </Link>
            </article>
          );
        })}
        {filteredPosts.length === 0 && <p className="bg-white/60 py-12 text-center text-xs text-[#1A344F]/55">검색된 게시글이 없어요.</p>}
      </div>

      <Link href="/community/new" className="fixed bottom-[82px] right-[calc(50%-185px)] z-20 flex h-12 w-12 items-center justify-center rounded-full bg-[#1A344F] text-2xl font-light text-[#FEEA9C] shadow-lg" aria-label="게시글 작성">+</Link>
    </>
  );
}
