"use client";

import { usePathname } from "next/navigation";
import BottomNav from "./BottomNav";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideNavigation = pathname === "/login" || pathname === "/signup";
  return <div className="mobile-shell"><main>{children}</main>{!hideNavigation && <BottomNav />}</div>;
}
