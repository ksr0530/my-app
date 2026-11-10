"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "../../../store/userStore";

export default function VerifyPage() {
  const router = useRouter();
  const userId = useUserStore((state) => state.id);
  const setStudentVerified = useUserStore((state) => state.setStudentVerified);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function verify() {
    setLoading(true); setMessage("");
    if (userId) {
      const response = await fetch("/api/auth/verify-student", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ userId }) });
      if (!response.ok) { setMessage("인증 상태를 저장하지 못했습니다."); setLoading(false); return; }
    }
    setStudentVerified(true); setLoading(false); router.push("/mypage/verified");
  }

  return <section className="page page-pad verification-page"><header className="subpage-header"><Link href="/mypage">‹</Link><h1>재학생 인증</h1><span /></header><div className="verification-result-card"><div className="verification-icon">✦</div><h2>재학생 인증이 필요해요</h2><p>재학생 인증을 완료하면 리뷰와 배달메이트 모집 글을 작성할 수 있어요.</p>{message && <p className="form-message">{message}</p>}<button className="primary-wide" onClick={verify} disabled={loading}>{loading ? "인증 중..." : "재학생 인증하기"}</button></div></section>;
}
