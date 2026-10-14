import "./globals.css";
import BottomNav from "../components/BottomNav";

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
<<<<<<< HEAD
  return <html lang="ko"><body><div className="mobile-shell"><main>{children}</main><BottomNav /></div></body></html>;
=======
  return (
    <html lang="ko">
      <body>
        <div className="mobile-shell">
          <main>{children}</main>
          <BottomNav />
        </div>
      </body>
    </html>
  );
>>>>>>> 5bc0bf9418aad098dfa780dbc4589d6a21e72db0
}
