import Link from "next/link";

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
      <ul className="flex justify-around items-center h-16 text-xs text-gray-500">
        <li>
          <Link href="/" className="flex flex-col items-center">
            <span className="text-xl mb-1">🏠</span>
            <span>홈</span>
          </Link>
        </li>
        <li>
          <Link href="/map" className="flex flex-col items-center">
            <span className="text-xl mb-1">📍</span>
            <span>지도</span>
          </Link>
        </li>
        <li>
          <Link href="/community" className="flex flex-col items-center">
            <span className="text-xl mb-1">👥</span>
            <span>커뮤니티</span>
          </Link>
        </li>
        <li>
          <Link href="/mypage" className="flex flex-col items-center">
            <span className="text-xl mb-1">👤</span>
            <span>마이페이지</span>
          </Link>
        </li>
      </ul>
    </nav>
  );
}