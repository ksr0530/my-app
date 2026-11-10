"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
const items = [
  { href: "/admin/reports", label: "신고관리", icon: "/assets/report.svg" },
  { href: "/admin/support", label: "사장님 상담", icon: "/assets/person.svg" },
  { href: "/mypage", label: "마이페이지", icon: "/assets/mypage.svg" },
];
export default function AdminBottomNav() { const pathname = usePathname(); return <nav className="bottom-nav admin-bottom-nav" aria-label="관리자 메뉴"><ul className="mx-auto grid h-full max-w-[430px] grid-cols-3">{items.map(item => { const active = pathname.startsWith(item.href); return <li key={item.href}><Link href={item.href} data-active={active} className="flex h-full flex-col items-center justify-center gap-0.5 border-r border-[#2F4F71] text-[10px] last:border-r-0"><Image src={item.icon} alt="" width={26} height={26} className="h-6 w-6" /><span>{item.label}</span></Link></li>; })}</ul></nav>; }
