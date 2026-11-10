"use client";

import { usePathname } from "next/navigation";
import BottomNav from "./BottomNav";
import AdminBottomNav from "./AdminBottomNav";
import OwnerBottomNav from "./OwnerBottomNav";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideNavigation = pathname === "/login" || pathname === "/signup" || pathname === "/owner/status";
  const navigation = pathname.startsWith("/admin") ? <AdminBottomNav /> : pathname.startsWith("/owner") ? <OwnerBottomNav /> : <BottomNav />;
  return <div className="mobile-shell"><main>{children}</main>{!hideNavigation && navigation}</div>;
}
