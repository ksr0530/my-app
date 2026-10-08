import "./globals.css";
import BottomNav from "../components/BottomNav"; // 1. BottomNav 불러오기

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        {/* 2. 메인 화면 (하단바에 내용이 가려지지 않게 pb-16 여백 추가) */}
        <main className="pb-16">
          {children}
        </main>
        
        {/* 3. 하단바 고정 */}
        <BottomNav />
      </body>
    </html>
  );
}