"use client";

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

  const statusHref = user.name && user.email
    ? `/owner/status?name=${encodeURIComponent(user.name)}&email=${encodeURIComponent(user.email)}`
    : "/owner/status";

  return (
    <section className="page page-pad owner-mypage">
      <div className="mypage-title-row">
        <div><p className="kicker">쩝쩝대 사장님 페이지</p><h1 className="section-title">마이페이지</h1></div>
        <span className="mypage-crown">♛</span>
      </div>
      <div className="profile-card owner-profile-card">
        <div className="profile-avatar"><Image src="/assets/jjeopjjeop-mark.svg" alt="프로필" width={72} height={72} /></div>
        <h2>{user.name ?? "사장님"}</h2>
        <p>{user.email ?? "가입한 이메일을 확인해주세요"}</p>
        <span>식당 사장님</span>
      </div>
      <div className="mypage-menu owner-menu">
        <Link href={statusHref}>가입 승인 결과 <span>›</span><small>가입 요청 상태를 확인해요</small></Link>
        <button type="button" disabled>식당 정보 관리 <span>›</span><small>다음 단계에서 식당 정보와 사진을 수정해요</small></button>
        <button type="button" disabled>고객센터 <span>›</span><small>다음 단계에서 관리자에게 문의해요</small></button>
        <button onClick={logout}>로그아웃 <span>›</span><small>현재 계정에서 로그아웃해요</small></button>
      </div>
    </section>
  );
}
