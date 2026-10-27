"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/home", label: "홈", icon: "/assets/home.svg" },
  { href: "/map", label: "지도", icon: "/assets/map.svg" },
  { href: "/community", label: "채팅", icon: "/assets/community.svg" },
  { href: "/mypage", label: "마이페이지", icon: "/assets/mypage.svg" },
];

export default function BottomNav() {
  const pathname = usePathname();
  if (pathname === "/login" || pathname === "/signup") return null;
  return <nav className="bottom-nav" aria-label="주요 메뉴"><ul className="mx-auto grid h-full max-w-[430px] grid-cols-4">{items.map((item) => { const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href); return <li key={item.href}><Link href={item.href} data-active={active} aria-current={active ? "page" : undefined} className="flex h-full flex-col items-center justify-center gap-0.5 border-r border-[#2F4F71] text-[10px] last:border-r-0"><Image src={item.icon} alt="" width={30} height={30} className="h-7 w-7" /><span>{item.label}</span></Link></li>; })}</ul></nav>;
}
