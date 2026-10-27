import Link from "next/link";
import BrandHeader from "../components/BrandHeader";
import { getCommunities, getRestaurants } from "../lib/appData";
export const dynamic = "force-dynamic";

export default async function Home() {
  const [restaurants, communities] = await Promise.all([getRestaurants(), getCommunities()]);
  return <section className="page">
    <div className="mb-4"><BrandHeader /></div>
    <div className="page-pad pt-2"><div className="figma-search"><span>⌕</span><span>우리 학교 주변에 뭐가 있을까?</span><span className="ml-auto text-base">☷</span></div></div>
    <div className="filter-row"><span className="figma-chip active">전체</span><span className="figma-chip">1인</span><span className="figma-chip">2인</span><span className="figma-chip">4인</span><span className="figma-chip">6인</span><span className="figma-chip">단체</span></div>
    <div className="bg-white px-5 py-4"><div className="flex items-center justify-between"><h1 className="section-title">오늘 밥은 이거 어때요?</h1><Link href="/map" className="text-xs text-[#979797]">더보기 ›</Link></div><div className="mt-3 grid grid-cols-2 gap-2">{restaurants.slice(0,4).map((restaurant, index) => <Link href={`/restaurant/${restaurant.restaurantId}`} key={restaurant.restaurantId} className="figma-card overflow-hidden"><div className={`flex h-24 items-center justify-center text-3xl ${index % 2 ? "bg-[#e7d3a1]" : "bg-[#d7d7d7]"}`}>{["🍚","🍙","🌶️","🍜"][index]}</div><div className="p-2"><p className="truncate text-sm font-bold">{restaurant.name}</p><p className="mt-1 text-[10px] text-[#979797]">★ {restaurant.avgRating.toFixed(1)}({index + 4})</p></div></Link>)}</div></div>
    <div className="mt-3 bg-white px-5 py-4"><div className="flex items-center justify-between"><h2 className="section-title">같이 먹어요!</h2><Link href="/community" className="text-xs text-[#979797]">더보기 ›</Link></div><div className="mt-3 space-y-2">{communities.slice(0,3).map((post) => <Link href="/community" key={post.postId} className="flex items-center justify-between border-b border-[#e2e2dd] py-3"><div><p className="text-sm font-semibold">{post.title}</p><p className="mt-1 text-[10px] text-[#888]">{post.author} · 글 내용 작성</p></div><span className="text-xs">♙ {post.currentCount}/{post.targetCount}</span></Link>)}</div></div>
  </section>;
}
