"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

const categories = ["분식", "한식", "일식", "중식", "디저트", "기타"];

export default function CommunityComposer() {
  const router = useRouter();
  const [category, setCategory] = useState("한식");
  const [people, setPeople] = useState(2);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [verified, setVerified] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  function openConfirm() {
    if (!title.trim() || !description.trim()) return;
    if (!verified) {
      setAuthOpen(true);
      return;
    }
    setConfirmOpen(true);
  }

  function completeVerification() {
    setVerified(true);
    setAuthOpen(false);
  }

  return (
    <section className="min-h-screen bg-[#FEEA9C] px-5 pb-28 pt-8 text-[#1A344F]">
      <header className="flex items-center justify-between">
        <Link href="/community" aria-label="커뮤니티로 돌아가기" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/70 text-2xl leading-none">‹</Link>
        <h1 className="text-[18px] font-black">글 작성</h1>
        <span className="h-9 w-9" aria-hidden="true" />
      </header>

      <p className="mt-2 text-center text-[11px] text-[#979797]">같이 먹을 친구를 모집해보세요.</p>

      <label className="mt-7 block text-[12px] font-black">카테고리</label>
      <div className="mt-2 flex flex-wrap gap-2">
        {categories.map((item) => <button key={item} type="button" onClick={() => setCategory(item)} className={`rounded-full border px-3 py-2 text-[11px] font-bold ${category === item ? "border-[#1A344F] bg-[#1A344F] text-white" : "border-[#979797] bg-white/60 text-[#979797]"}`}>{item}</button>)}
      </div>

      <div className="mt-6 flex items-center justify-between rounded-[8px] border border-[#1A344F]/15 bg-white/65 px-3 py-3">
        <span className="text-[12px] font-black">모집 인원</span>
        <div className="flex items-center gap-3"><button type="button" onClick={() => setPeople((value) => Math.max(1, value - 1))} className="flex h-8 w-8 items-center justify-center rounded-full border border-[#979797] text-lg">−</button><strong className="min-w-[50px] text-center text-[13px]">{people}명</strong><button type="button" onClick={() => setPeople((value) => Math.min(10, value + 1))} className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1A344F] text-lg text-white">+</button></div>
      </div>

      <label className="mt-6 block text-[12px] font-black">제목<input value={title} onChange={(event) => setTitle(event.target.value)} maxLength={40} placeholder="커뮤니티 글 제목" className="mt-2 h-11 w-full rounded-[7px] border border-[#979797] bg-white/80 px-3 text-[12px] font-normal outline-none focus:border-[#1A344F]" /></label>
      <label className="mt-4 block text-[12px] font-black">내용<textarea value={description} onChange={(event) => setDescription(event.target.value)} maxLength={300} placeholder="글 내용을 작성해주세요" className="mt-2 h-32 w-full resize-none rounded-[7px] border border-[#979797] bg-white/80 p-3 text-[12px] font-normal outline-none focus:border-[#1A344F]" /></label>

      <div className="mt-5 rounded-[9px] border border-[#1A344F]/15 bg-white/65 p-3">
        <div className="flex items-center justify-between gap-3"><label className="flex items-center gap-2 text-[12px] font-bold"><input type="checkbox" checked={verified} onChange={(event) => setVerified(event.target.checked)} className="h-4 w-4 accent-[#1A344F]" />재학생 인증 완료</label><button type="button" onClick={() => setAuthOpen(true)} className="text-[11px] font-bold text-[#2F4F71] underline underline-offset-2">인증 정보 확인</button></div>
        <p className="mt-2 pl-6 text-[10px] leading-4 text-[#979797]">재학생 인증 후 밥친구 모집글을 등록할 수 있어요.</p>
      </div>

      <button type="button" onClick={openConfirm} className="mt-7 h-12 w-full rounded-[7px] bg-[#1A344F] text-[13px] font-black text-white">작성 완료</button>

      {authOpen && <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1A344F]/40 px-6"><div className="w-full max-w-[350px] rounded-[14px] bg-[#FEEA9C] p-6 text-[#1A344F]"><div className="flex items-start justify-between"><div><p className="text-[11px] font-bold text-[#2F4F71]">재학생 인증</p><h2 className="mt-2 text-[20px] font-black">재학생만 이용할 수 있어요</h2></div><button type="button" onClick={() => setAuthOpen(false)} className="text-2xl" aria-label="인증 팝업 닫기">×</button></div><p className="mt-4 rounded-[8px] bg-white/75 p-3 text-[12px] leading-5 text-[#1A344F]/75">학교 이메일 또는 학생증을 확인해 재학생 인증을 완료해주세요. 인증된 사용자만 신뢰할 수 있는 밥친구 모집글을 작성할 수 있어요.</p><button type="button" onClick={completeVerification} className="mt-5 h-11 w-full rounded-[7px] bg-[#1A344F] text-[12px] font-black text-white">인증하기</button></div></div>}

      {confirmOpen && <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#1A344F]/40 px-6"><div className="w-full max-w-[340px] rounded-[14px] bg-white p-6 text-center text-[#1A344F]"><h2 className="text-[17px] font-black">게시글을 등록하시겠습니까?</h2><p className="mt-2 text-[11px] leading-5 text-[#979797]">{category} 카테고리, 모집 인원 {people}명으로 등록해요.</p><div className="mt-5 grid grid-cols-2 gap-2"><button type="button" onClick={() => setConfirmOpen(false)} className="h-11 rounded-[6px] border border-[#979797] text-[12px] font-bold">취소</button><button type="button" onClick={() => router.push("/community")} className="h-11 rounded-[6px] bg-[#1A344F] text-[12px] font-bold text-white">등록하기</button></div></div></div>}
    </section>
  );
}
