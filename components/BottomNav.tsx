"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUserStore } from "../store/userStore";

type NavItem = { href: string; label: string; icon: string };

const userItems: NavItem[] = [
  { href: "/home", label: "홈", icon: "/assets/home.svg" },
  { href: "/map", label: "지도", icon: "/assets/map.svg" },
  { href: "/community", label: "커뮤니티", icon: "/assets/community.svg" },
  { href: "/mypage", label: "마이페이지", icon: "/assets/mypage.svg" },
];

const ownerItems: NavItem[] = [
  { href: "/community", label: "커뮤니티", icon: "/assets/community.svg" },
  { href: "/owner/support", label: "관리자 상담", icon: "/assets/person.svg" },
  { href: "/owner/mypage", label: "마이페이지", icon: "/assets/mypage.svg" },
];

const adminItems: NavItem[] = [
  { href: "/admin/reports", label: "신고관리", icon: "/assets/report.svg" },
  { href: "/admin/support", label: "사장님 상담", icon: "/assets/person.svg" },
  { href: "/mypage", label: "마이페이지", icon: "/assets/mypage.svg" },
];

export default function BottomNav() {
  const pathname = usePathname();
  const role = useUserStore((state) => state.role);
  if (pathname === "/login" || pathname === "/signup" || pathname === "/owner/status") return null;

  const items = role === "OWNER" ? ownerItems : role === "ADMIN" ? adminItems : userItems;
  return (
    <nav className={`bottom-nav bottom-nav-${role.toLowerCase()}`} aria-label="주요 메뉴">
      <ul className="mx-auto grid h-full max-w-[430px]" style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}>
        {items.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return <li key={item.href}><Link href={item.href} data-active={active} aria-current={active ? "page" : undefined} className="flex h-full flex-col items-center justify-center gap-0.5 border-r border-[#2F4F71] text-[10px] last:border-r-0"><Image src={item.icon} alt="" width={30} height={30} className="h-7 w-7" /><span>{item.label}</span></Link></li>;
        })}
      </ul>
    </nav>
  );
}
