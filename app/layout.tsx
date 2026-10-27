import "./globals.css";
import AppShell from "../components/AppShell";

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ko"><body><AppShell>{children}</AppShell></body></html>;
}
