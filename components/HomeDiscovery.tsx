"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "../store/userStore";

type Suggestion = { restaurantId: string; name: string; category: string; address: string; menuNames: string[] };
type Recommendation = { restaurantId: string; name: string; description: string | null; avgRating: number; reviewCount: number; reason: string };
export default function HomeDiscovery() {
  const router = useRouter(); const userId = useUserStore((state) => state.id); const [query, setQuery] = useState(""); const [suggestions, setSuggestions] = useState<Suggestion[]>([]); const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  useEffect(() => { fetch(`/api/recommendations${userId ? `?userId=${encodeURIComponent(userId)}` : ""}`, { cache: "no-store" }).then((r) => r.json()).then((d) => setRecommendations(d.recommendations ?? [])).catch(() => setRecommendations([])); }, [userId]);
  useEffect(() => { const value = query.trim(); if (!value) { setSuggestions([]); return; } const timer = window.setTimeout(() => fetch(`/api/search?q=${encodeURIComponent(value)}`).then((r) => r.json()).then((d) => setSuggestions(d.suggestions ?? [])).catch(() => setSuggestions([])), 220); return () => window.clearTimeout(timer); }, [query]);
  async function search(item?: Suggestion) { const value = (item?.name ?? query).trim(); if (!value) return; if (userId) await fetch("/api/search", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ userId, query: value }) }); setSuggestions([]); if (item) router.push(`/restaurant/${item.restaurantId}`); }
  return <><div className="home-search-wrap"><form className="figma-search home-search-form" onSubmit={(event) => { event.preventDefault(); void search(); }}><span>⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="우리 학교 주변에 뭐가 있을까?" /><button type="submit" aria-label="검색">검색</button></form>{suggestions.length > 0 && <div className="search-suggestion-list">{suggestions.map((item) => <button type="button" key={item.restaurantId} className="search-suggestion" onClick={() => void search(item)}><span className="search-suggestion-icon">⌖</span><span><strong>{item.name}</strong><small>{item.category} · {item.address}</small></span><span>›</span></button>)}</div>}</div><section className="home-section recommendation-section"><div className="home-section-heading"><h2 className="section-title">당신을 위한 추천</h2><span className="recommendation-label">AI 맞춤</span></div><div className="recommendation-list">{recommendations.map((item) => <Link href={`/restaurant/${item.restaurantId}`} className="recommendation-card" key={item.restaurantId}><div><strong>{item.name}</strong><p>★ {item.avgRating.toFixed(1)} · 리뷰 {item.reviewCount}개</p><small>{item.reason}</small></div><span>›</span></Link>)}</div></section></>;
}
