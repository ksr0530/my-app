"use client";

import { useMemo, useState } from "react";
import type { CommunityCard } from "../lib/appData";

type Props = { initialPosts: CommunityCard[] };

export default function CommunityBoard({ initialPosts }: Props) {
  const [posts, setPosts] = useState(initialPosts);
  const [selectedPost, setSelectedPost] = useState<CommunityCard | null>(null);
  const [joinedPostId, setJoinedPostId] = useState<string | null>(null);
  const [keyword, setKeyword] = useState("");

  const filteredPosts = useMemo(() => {
    const normalized = keyword.trim().toLowerCase();
    if (!normalized) return posts;
    return posts.filter((post) => `${post.title} ${post.author}`.toLowerCase().includes(normalized));
  }, [keyword, posts]);

  function joinPost(postId: string) {
    setPosts((current) => current.map((post) => {
      if (post.postId !== postId || post.isClosed || post.currentCount >= post.targetCount) return post;
      const nextCount = post.currentCount + 1;
      return { ...post, currentCount: nextCount, isClosed: nextCount >= post.targetCount };
    }));
    setJoinedPostId(postId);
    setSelectedPost(null);
  }

  return (
    <>
      <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
        {["전체", "점심", "석식", "배달메이트"].map((category, index) => (
          <button key={category} type="button" className={`shrink-0 rounded-[5px] border px-3 py-1.5 text-[11px] font-bold ${index === 0 ? "border-[#1A344F] bg-[#1A344F] text-white" : "border-[#1A344F]/20 bg-white/55 text-[#1A344F]/70"}`}>
            {category}
          </button>
        ))}
      </div>

      <div className="mt-3 flex items-center justify-between border-b border-[#1A344F]/20 pb-2">
        <p className="text-[11px] font-bold text-[#1A344F]/60">총 {filteredPosts.length}개의 게시글</p>
        <input value={keyword} onChange={(event) => setKeyword(event.target.value)} aria-label="게시글 검색" className="w-28 border-0 border-b border-[#1A344F]/20 bg-transparent px-1 py-1 text-right text-[11px] outline-none placeholder:text-[#1A344F]/40" placeholder="검색" />
      </div>

      <div className="mt-2 divide-y divide-[#1A344F]/15 border-y border-[#1A344F]/15">
        {filteredPosts.map((post, index) => {
          const closed = post.isClosed || post.currentCount >= post.targetCount;
          const joined = joinedPostId === post.postId;
          return (
            <article key={post.postId} className="bg-white/60 px-3 py-3.5">
              <button type="button" onClick={() => setSelectedPost(post)} className="block w-full text-left">
                <div className="flex items-start gap-3">
                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-[5px] text-[22px] ${index % 3 === 0 ? "bg-[#F4C2C1]" : index % 3 === 1 ? "bg-[#F7D878]" : "bg-[#D6DDBB]"}`}>
                    {index % 3 === 0 ? "🍚" : index % 3 === 1 ? "🍱" : "🥗"}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="truncate text-[13px] font-black tracking-[-0.04em] text-[#1A344F]">{post.title}</h3>
                      <span className={`shrink-0 rounded-[4px] px-1.5 py-1 text-[10px] font-black ${closed ? "bg-[#1A344F]/10 text-[#1A344F]/50" : "bg-[#F4A9A8] text-[#1A344F]"}`}>{closed ? "모집완료" : `${post.currentCount}/${post.targetCount}`}</span>
                    </div>
                    <p className="mt-2 truncate text-[11px] leading-4 text-[#1A344F]/60">같이 주문하고 배달비를 나눠요</p>
                    <p className="mt-1 text-[10px] text-[#1A344F]/45">{post.author} · 방금 전</p>
                  </div>
                </div>
              </button>
              <div className="mt-2 flex justify-end">
                <button type="button" disabled={closed || joined} onClick={() => joinPost(post.postId)} className={`rounded-[4px] px-3 py-1.5 text-[10px] font-black ${closed || joined ? "bg-[#1A344F]/10 text-[#1A344F]/45" : "bg-[#1A344F] text-white"}`}>
                  {joined ? "참여완료" : closed ? "모집완료" : "밥친구 참여"}
                </button>
              </div>
            </article>
          );
        })}
        {filteredPosts.length === 0 && <p className="bg-white/60 py-12 text-center text-xs text-[#1A344F]/55">검색된 게시글이 없어요.</p>}
      </div>

      <button type="button" className="fixed bottom-[82px] right-[calc(50%-185px)] z-20 flex h-12 w-12 items-center justify-center rounded-full bg-[#1A344F] text-2xl font-light text-[#FEEA9C] shadow-lg" aria-label="게시글 작성">+</button>

      {selectedPost && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-[#1A344F]/30 px-5 pb-6" onClick={() => setSelectedPost(null)}>
          <div className="w-full max-w-[390px] rounded-[12px] bg-[#FEEA9C] p-5 text-[#1A344F]" onClick={(event) => event.stopPropagation()}>
            <div className="flex items-start justify-between gap-3"><div><p className="text-[11px] font-bold text-[#1A344F]/55">배달메이트 모집글</p><h3 className="mt-1 text-[18px] font-black tracking-[-0.06em]">{selectedPost.title}</h3></div><button type="button" onClick={() => setSelectedPost(null)} aria-label="닫기" className="text-xl">×</button></div>
            <div className="mt-4 rounded-[7px] border border-[#1A344F]/15 bg-white/70 p-3 text-[12px] leading-5">현재 참여 인원 <strong>{selectedPost.currentCount}명</strong> / 모집 인원 <strong>{selectedPost.targetCount}명</strong><br />점심 또는 석식 메뉴를 함께 주문하고 배달비를 나눠요.</div>
            <button type="button" disabled={selectedPost.isClosed || selectedPost.currentCount >= selectedPost.targetCount || joinedPostId === selectedPost.postId} onClick={() => joinPost(selectedPost.postId)} className="mt-4 h-11 w-full rounded-[6px] bg-[#1A344F] text-[13px] font-black text-white disabled:bg-[#1A344F]/30">{joinedPostId === selectedPost.postId ? "참여 완료" : selectedPost.isClosed ? "모집이 마감됐어요" : "밥친구 참여하기"}</button>
          </div>
        </div>
      )}
    </>
  );
}
