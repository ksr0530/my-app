"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/", label: "홈", icon: "⌂" },
  { href: "/map", label: "지도", icon: "⌖" },
  { href: "/community", label: "커뮤니티", icon: "▤" },
  { href: "/mypage", label: "마이", icon: "♙" },
];

export default function BottomNav() {
  const pathname = usePathname();
  return <nav className="bottom-nav"><ul className="mx-auto grid h-full max-w-[430px] grid-cols-4">
    {items.map((item) => { const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href); return <li key={item.href}><Link href={item.href} data-active={active} className="flex h-full flex-col items-center justify-center gap-0.5 text-[10px] font-bold"><span className="text-[22px] leading-6">{item.icon}</span><span>{item.label}</span></Link></li>; })}
  </ul></nav>;
}
