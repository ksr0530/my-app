"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUserStore } from "../../../store/userStore";
import { LogoutModal } from "../../../components/ActionModals";
import { useState } from "react";
export default function AdminMyPage(){const user=useUserStore();const router=useRouter();const [open,setOpen]=useState(false);function logout(){user.clearUser();router.push("/login")}return <section className="page page-pad admin-page"><div className="mypage-title-row"><div><p className="kicker">쩝쩝대 관리센터</p><h1 className="section-title">마이페이지</h1></div><span className="mypage-crown">♛</span></div><div className="profile-card"><div className="profile-avatar"><Image src="/assets/jjeopjjeop-mark.svg" alt="관리자" width={72} height={72}/></div><h2>{user.name??"쩝쩝대 관리자"}</h2><p>{user.email??"admin@jjupjjupdae.test"}</p><span>관리자</span></div><div className="mypage-menu"><Link href="/admin/reports">신고관리 <span>›</span><small>신고된 게시글과 리뷰를 관리해요</small></Link><Link href="/admin/support">사장님 상담 <span>›</span><small>사장님 문의를 확인해요</small></Link><button onClick={()=>setOpen(true)}>로그아웃 <span>›</span></button></div><LogoutModal open={open} onClose={()=>setOpen(false)} onConfirm={logout}/></section>}
