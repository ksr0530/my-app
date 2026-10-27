"use client";

import Link from "next/link";
import { useState } from "react";
import type { CommunityCard } from "../lib/appData";

export default function CommunityDetail({ post }: { post: CommunityCard }) {
  const [currentCount, setCurrentCount] = useState(post.currentCount);
  const closed = post.isClosed || currentCount >= post.targetCount;
  const [joined, setJoined] = useState(false);

  function join() {
    if (closed || joined) return;
    setCurrentCount((count) => Math.min(post.targetCount, count + 1));
    setJoined(true);
  }

  return (
    <section className="min-h-screen bg-[#FEEA9C] px-5 pb-28 pt-8 text-[#1A344F]">
      <header className="flex items-center justify-between">
        <Link href="/community" aria-label="커뮤니티로 돌아가기" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/70 text-2xl leading-none">‹</Link>
        <p className="text-[13px] font-black">커뮤니티 글</p>
        <span className="h-9 w-9" aria-hidden="true" />
      </header>

      <article className="mt-6">
        <p className="text-[11px] font-bold text-[#2F4F71]">밥친구 모집글</p>
        <h1 className="mt-2 text-[24px] font-black leading-tight tracking-[-0.07em]">{post.title}</h1>
        <p className="mt-3 text-[11px] text-[#1A344F]/55">{post.author} · 방금 전</p>

        <div className="mt-7 rounded-[10px] border border-[#1A344F]/15 bg-white/80 p-4">
          <div className="flex items-center justify-between border-b border-[#1A344F]/10 pb-3">
            <span className="text-[12px] font-bold">모집 현황</span>
            <strong className="text-[14px]">{currentCount}/{post.targetCount}명</strong>
          </div>
          <p className="mt-4 text-[13px] leading-6 text-[#1A344F]/80">{post.description ?? "같이 주문하고 밥친구를 찾아요."}</p>
          <div className="mt-4 flex items-center gap-2 text-[11px] text-[#1A344F]/55"><span className="rounded-full bg-[#F7D878] px-2 py-1">{post.category ?? "기타"}</span><span>재학생 밥친구 모집</span></div>
        </div>

        <div className="mt-4 rounded-[10px] border border-[#1A344F]/15 bg-white/55 p-4 text-[12px] leading-6">
          <p className="font-bold">참여 전 확인해주세요</p>
          <ul className="mt-2 list-disc pl-4 text-[#1A344F]/65"><li>약속 시간과 장소를 게시글 작성자와 확인해주세요.</li><li>모집 인원이 차면 참여 버튼이 닫혀요.</li></ul>
        </div>
      </article>

      <button type="button" disabled={closed || joined} onClick={join} className="fixed bottom-[82px] left-1/2 h-12 w-[calc(min(100%,390px)-40px)] -translate-x-1/2 rounded-[7px] bg-[#1A344F] text-[13px] font-black text-white disabled:bg-[#1A344F]/35">{joined ? "밥친구 참여 완료" : closed ? "모집이 마감됐어요" : "밥친구 참여하기"}</button>
    </section>
  );
}
