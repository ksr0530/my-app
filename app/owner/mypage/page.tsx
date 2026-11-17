"use client";
import BrandHeader from "../../../components/BrandHeader";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUserStore } from "../../../store/userStore";

export default function OwnerMyPage() {
  const router = useRouter();
  const user = useUserStore();

  function logout() {
    user.clearUser();
    router.push("/login");
  }

  return (
    <section className="page page-pad owner-mypage">
      <header className="role-page-header"><BrandHeader title="마이페이지" /></header>
      <div className="profile-card owner-profile-card">
        <div className="profile-avatar"><Image src="/assets/jjeopjjeop-mark.svg" alt="프로필" width={72} height={72} /></div>
        <h2>{user.name ?? "사장님"}</h2>
        <p>{user.email ?? "가입한 이메일을 확인해주세요"}</p>
        <span>식당 사장님</span>
      </div>
      <div className="mypage-menu owner-menu">
        <Link href="/owner/restaurant">식당 정보 관리 <span>›</span><small>식당 정보와 사진을 수정해요</small></Link>
        <Link href="/owner/support">고객센터 <span>›</span><small>관리자에게 문의해요</small></Link>
        <button onClick={logout}>로그아웃 <span>›</span><small>현재 계정에서 로그아웃해요</small></button>
      </div>
    </section>
  );
}
