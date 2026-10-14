"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/", label: "홈", icon: "⌂" },
  { href: "/map", label: "지도", icon: "♧" },
  { href: "/community", label: "채팅", icon: "▱" },
  { href: "/mypage", label: "마이페이지", icon: "⚙" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="bottom-nav" aria-label="주요 메뉴">
      <ul className="mx-auto grid h-full max-w-[430px] grid-cols-4">
        {items.map((item) => {
          const active =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                data-active={active}
                aria-current={active ? "page" : undefined}
                className="flex h-full flex-col items-center justify-center gap-0.5 border-r border-[#e8e8e3] text-[10px] last:border-r-0"
              >
                <span className="text-[23px] leading-6">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
