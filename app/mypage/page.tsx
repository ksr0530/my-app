"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useUserStore } from "../../store/userStore";
import { LogoutModal } from "../../components/ActionModals";

export default function MyPage() {
  const router = useRouter(); const user = useUserStore(); const [logoutOpen, setLogoutOpen] = useState(false);
  function logout() { user.clearUser(); setLogoutOpen(false); router.push("/login"); }
  return <section className="page page-pad mypage-redesign"><div className="mypage-title-row"><div><p className="kicker">쩝쩝대</p><h1 className="section-title">마이페이지</h1></div><span className="mypage-crown">♡</span></div><div className="profile-card"><div className="profile-avatar"><Image src="/assets/jjeopjjeop-mark.svg" alt="프로필" width={72} height={72} /></div><h2>{user.name ?? "홍길동"}</h2><p>{user.email ?? "gildong.hong@example.com"}</p><span>{user.university ?? "부천대학교"}</span></div><div className="mypage-menu"><Link href="/my-activity">내 활동 <span>›</span><small>작성한 글과 리뷰를 확인해요</small></Link><Link href={user.isStudentVerified ? "/mypage/verified" : "/mypage/verify"}>재학생 인증 <span>{user.isStudentVerified ? "완료 ›" : "인증하기 ›"}</span><small>{user.isStudentVerified ? "인증이 완료된 계정이에요" : "리뷰와 글 작성 전 인증해주세요"}</small></Link><button onClick={() => setLogoutOpen(true)}>로그아웃 <span>›</span></button></div><LogoutModal open={logoutOpen} onClose={() => setLogoutOpen(false)} onConfirm={logout} /></section>;
}
