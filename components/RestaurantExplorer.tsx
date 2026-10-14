"use client";

import { useMemo, useState } from "react";
import type { RestaurantCard } from "../lib/appData";

export default function RestaurantExplorer({ restaurants }: { restaurants: RestaurantCard[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("전체");
  const filtered = useMemo(() => restaurants.filter((r) => `${r.name} ${r.description}`.toLowerCase().includes(query.toLowerCase()) && (category === "전체" || (category === "혼밥" ? r.name.includes("김밥") || r.name.includes("덮밥") : category === "배달" ? r.name.includes("치킨") || r.name.includes("부대") : true))), [restaurants, query, category]);
  return <>
    <div className="mt-5 flex items-center gap-2 rounded-xl bg-white/80 px-3 py-2"><span>⌕</span><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="식당 이름을 검색해보세요" className="w-full border-0 bg-transparent p-1 text-sm outline-none" /></div>
    <div className="mt-3 flex gap-2 overflow-x-auto pb-1">{["전체", "혼밥", "배달", "4점 이상"].map((item) => <button key={item} onClick={() => setCategory(item)} className={`pill shrink-0 ${category === item ? "pill-active" : ""}`}>{item}</button>)}</div>
    <div className="mt-5 rounded-2xl border border-[#c4cdb0] bg-[#cdd4bc] p-3"><div className="flex h-32 items-center justify-center rounded-xl bg-[#e8e7cf] text-center text-xs font-bold text-[#70806c]"><span className="text-4xl">⌖</span><span className="ml-2">학교 주변 맛집 지도<br /><small>식당을 선택하면 상세 정보를 볼 수 있어요</small></span></div></div>
    <div className="mt-5 space-y-3">{filtered.map((restaurant, index) => <article key={restaurant.restaurantId} className="card flex gap-3 p-3"><div className={`flex h-20 w-20 shrink-0 items-center justify-center rounded-xl text-3xl ${index % 2 ? "bg-[#f7c5c2]" : "bg-[#f5d878]"}`}>{["🍚", "🍙", "🌶️", "🍜", "🍛", "☕", "🍗", "🥘"][index % 8]}</div><div className="min-w-0 flex-1"><div className="flex items-start justify-between gap-2"><h3 className="truncate text-sm font-black text-[#102f54]">{restaurant.name}</h3><span className="shrink-0 text-xs font-black text-[#d78c21]">★ {restaurant.avgRating.toFixed(1)}</span></div><p className="mt-2 line-clamp-2 text-xs leading-5 text-[#7a8490]">{restaurant.description}</p><div className="mt-2 flex gap-1"><span className="rounded bg-[#f7a3a7]/50 px-2 py-1 text-[10px] font-bold">리뷰 {index + 2}</span><span className="rounded bg-white px-2 py-1 text-[10px] font-bold text-[#7a8490]">학교 앞</span></div></div></article>)}{filtered.length === 0 && <div className="py-10 text-center text-sm text-[#7a8490]">검색 결과가 없어요.</div>}</div>
  </>;
}
