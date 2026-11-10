"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
const items = [
  { href: "/community", label: "커뮤니티", icon: "/assets/community.svg" },
  { href: "/owner/support", label: "관리자 상담", icon: "/assets/person.svg" },
  { href: "/owner/mypage", label: "마이페이지", icon: "/assets/mypage.svg" },
];
export default function OwnerBottomNav(){const pathname=usePathname();return <nav className="bottom-nav bottom-nav-owner" aria-label="식당 주인 메뉴"><ul className="mx-auto grid h-full max-w-[430px] grid-cols-3">{items.map(item=>{const active=pathname===item.href||pathname.startsWith(`${item.href}/`);return <li key={item.href}><Link href={item.href} data-active={active} className="flex h-full flex-col items-center justify-center gap-0.5 border-r border-[#2F4F71] text-[10px] last:border-r-0"><Image src={item.icon} alt="" width={30} height={30} className="h-7 w-7"/><span>{item.label}</span></Link></li>})}</ul></nav>}
