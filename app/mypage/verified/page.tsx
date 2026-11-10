"use client";

import Link from "next/link";
import { useUserStore } from "../../../store/userStore";

export default function VerifiedPage() {
  const user = useUserStore();
  return <section className="page page-pad verification-page"><header className="subpage-header"><Link href="/mypage">‹</Link><h1>재학생 인증</h1><span /></header><div className="verification-result-card"><div className="verification-icon verified">✓</div><h2>재학생 인증이 완료되었어요</h2><p>{user.university ?? "부천대학교"} 재학생 인증 계정으로 리뷰와 커뮤니티 글을 작성할 수 있어요.</p><div className="verification-complete">✓ 인증 완료</div><Link href="/community" className="primary-wide verification-link">커뮤니티로 이동</Link></div></section>;
}
