import Link from "next/link";
import { getCommunities, getRestaurants } from "../lib/appData";
<<<<<<< HEAD
export const dynamic = "force-dynamic";

export default async function Home() {
  const [restaurants, communities] = await Promise.all([getRestaurants(), getCommunities()]);
  return <section className="page">
    <div className="page-pad pt-2"><div className="figma-search"><span>⌕</span><span>우리 학교 주변에 뭐가 있을까?</span><span className="ml-auto text-base">☷</span></div></div>
    <div className="filter-row"><span className="figma-chip active">전체</span><span className="figma-chip">1인</span><span className="figma-chip">2인</span><span className="figma-chip">4인</span><span className="figma-chip">6인</span><span className="figma-chip">단체</span></div>
    <div className="bg-white px-5 py-4"><div className="flex items-center justify-between"><h1 className="section-title">오늘 밥은 이거 어때요?</h1><Link href="/map" className="text-xs text-[#777]">더보기 ›</Link></div><div className="mt-3 grid grid-cols-2 gap-2">{restaurants.slice(0,4).map((restaurant, index) => <Link href="/map" key={restaurant.restaurantId} className="figma-card overflow-hidden"><div className={`flex h-24 items-center justify-center text-3xl ${index % 2 ? "bg-[#e7d3a1]" : "bg-[#d7d7d7]"}`}>{["🍚","🍙","🌶️","🍜"][index]}</div><div className="p-2"><p className="truncate text-sm font-bold">{restaurant.name}</p><p className="mt-1 text-[10px] text-[#777]">★ {restaurant.avgRating.toFixed(1)}({index + 4})</p></div></Link>)}</div></div>
    <div className="mt-3 bg-white px-5 py-4"><div className="flex items-center justify-between"><h2 className="section-title">같이 먹어요!</h2><Link href="/community" className="text-xs text-[#777]">더보기 ›</Link></div><div className="mt-3 space-y-2">{communities.slice(0,3).map((post) => <Link href="/community" key={post.postId} className="flex items-center justify-between border-b border-[#e2e2dd] py-3"><div><p className="text-sm font-semibold">{post.title}</p><p className="mt-1 text-[10px] text-[#888]">{post.author} · 글 내용 작성</p></div><span className="text-xs">♙ {post.currentCount}/{post.targetCount}</span></Link>)}</div></div>
=======

export const dynamic = "force-dynamic";

export default async function Home() {
  const [restaurants, communities] = await Promise.all([getRestaurants(), getCommunities()]);
  return <section className="page">
    <header className="flex items-start justify-between"><div><p className="kicker">우리 학교 주변 밥집 앱</p><h1 className="brand mt-1 text-3xl">쩝쩝대</h1></div><div className="rounded-full bg-white/70 px-3 py-2 text-xs font-bold text-[#102f54]">☀️ 좋은 하루!</div></header>
    <div className="mt-7 rounded-2xl bg-[#102f54] p-5 text-white"><p className="text-xs font-bold text-[#fff2ad]">오늘 뭐 먹지?</p><h2 className="mt-2 text-xl font-black tracking-tight">내 주변 맛집을 찾아보세요</h2><Link href="/map" className="mt-4 inline-flex rounded-lg bg-[#fff2ad] px-4 py-2 text-xs font-black text-[#102f54]">식당 찾으러 가기 →</Link></div>
    <div className="mt-7 flex items-end justify-between"><div><p className="kicker">RECOMMEND</p><h2 className="section-title mt-1">오늘의 추천 맛집</h2></div><Link href="/map" className="text-xs font-bold text-[#7a8490]">더보기 ›</Link></div>
    <div className="mt-3 grid grid-cols-2 gap-3">{restaurants.slice(0, 4).map((restaurant, index) => <Link href="/map" key={restaurant.restaurantId} className="card overflow-hidden"><div className={`flex h-24 items-center justify-center text-4xl ${index % 2 ? "bg-[#f7c5c2]" : "bg-[#f5d878]"}`}>{["🍚", "🍙", "🌶️", "🍜"][index]}</div><div className="p-3"><p className="truncate text-sm font-black text-[#102f54]">{restaurant.name}</p><p className="mt-1 text-[11px] text-[#7a8490]">★ {restaurant.avgRating.toFixed(1)} · 학교 앞</p></div></Link>)}</div>
    <div className="mt-8 flex items-end justify-between"><div><p className="kicker">DELIVERY MATE</p><h2 className="section-title mt-1">배달메이트 모집 중</h2></div><Link href="/community" className="text-xs font-bold text-[#7a8490]">전체보기 ›</Link></div>
    <div className="mt-3 space-y-3">{communities.slice(0, 2).map((post) => <Link href="/community" key={post.postId} className="card flex items-center justify-between p-4"><div><p className="text-sm font-black text-[#102f54]">{post.title}</p><p className="mt-2 text-[11px] text-[#7a8490]">{post.author} · 지금 모집 중</p></div><span className="rounded-full bg-[#f7a3a7] px-3 py-1 text-[11px] font-black text-[#102f54]">{post.currentCount}/{post.targetCount}</span></Link>)}</div>
>>>>>>> 5bc0bf9418aad098dfa780dbc4589d6a21e72db0
  </section>;
}
