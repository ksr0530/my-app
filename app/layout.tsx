import "./globals.css";
import BottomNav from "../components/BottomNav";

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ko"><body><div className="mobile-shell"><main>{children}</main><BottomNav /></div></body></html>;
}
