"use client";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "../store/userStore";

type Suggestion = { restaurantId: string; name: string; category: string; address: string; menuNames: string[] };
type Recommendation = { restaurantId: string; name: string; description: string | null; imageUrl?: string | null; avgRating: number; reviewCount: number; reason: string };
const foodIcons = ["🍚", "🍜", "🥘", "🍙"];
const foodColors = ["#e7d3a1", "#f2c2b9", "#d8dfbd", "#f6d878"];

export default function HomeDiscovery() {
  const router = useRouter();
  const userId = useUserStore((state) => state.id);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [relatedKeywords, setRelatedKeywords] = useState<string[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [showAllRecent, setShowAllRecent] = useState(false);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [recommendationSource, setRecommendationSource] = useState("fallback");

  const loadRecommendations = useCallback(() => {
    fetch(`/api/recommendations${userId ? `?userId=${encodeURIComponent(userId)}` : ""}`, { cache: "no-store" })
      .then((response) => response.json())
      .then((data) => { setRecommendations(data.recommendations ?? []); setRecommendationSource(data.source ?? "fallback"); })
      .catch(() => setRecommendations([]));
  }, [userId]);

  useEffect(() => { loadRecommendations(); }, [loadRecommendations]);
  useEffect(() => {
    try {
      const saved = JSON.parse(window.localStorage.getItem("jjeopjjeop-recent-searches") ?? "[]");
      if (Array.isArray(saved)) setRecentSearches(saved.filter((item): item is string => typeof item === "string").slice(0, 10));
    } catch { /* 검색 기록이 없거나 손상된 경우 빈 목록으로 시작 */ }
  }, []);
  useEffect(() => {
    const value = query.trim();
    if (!value) { setSuggestions([]); setRelatedKeywords([]); return; }
    const timer = window.setTimeout(() => fetch(`/api/search?q=${encodeURIComponent(value)}`)
      .then((response) => response.json())
      .then((data) => { setSuggestions(data.suggestions ?? []); setRelatedKeywords(data.relatedKeywords ?? []); })
      .catch(() => { setSuggestions([]); setRelatedKeywords([]); }), 220);
    return () => window.clearTimeout(timer);
  }, [query]);

  async function search(item?: Suggestion) {
    const target = item ?? suggestions[0];
    const value = (target?.name ?? query).trim();
    if (!value) return;
    const nextRecent = [value, ...recentSearches.filter((item) => item !== value)].slice(0, 10);
    setRecentSearches(nextRecent);
    window.localStorage.setItem("jjeopjjeop-recent-searches", JSON.stringify(nextRecent));
    if (userId) {
      await fetch("/api/search", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ userId, query: value }) });
      loadRecommendations();
    }
    setSuggestions([]);
    setRelatedKeywords([]);
    if (target) router.push(`/restaurant/${target.restaurantId}`);
  }

  return <>
    <div className="home-search-wrap">
      <form className="figma-search home-search-form" onSubmit={(event) => { event.preventDefault(); void search(); }}>
        <span>⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="우리 학교 주변에 뭐가 있을까?" /><button type="submit" aria-label="검색">검색</button>
      </form>
      {!query.trim() && recentSearches.length > 0 && <div className="recent-search-box">
        <div className="recent-search-heading"><strong>검색기록</strong>{recentSearches.length > 4 && <button type="button" onClick={() => setShowAllRecent((value) => !value)}>{showAllRecent ? "접기" : "더보기"} ›</button>}</div>
        <div className="recent-search-list">{recentSearches.slice(0, showAllRecent ? 10 : 4).map((item) => <button type="button" key={item} onClick={() => setQuery(item)}><span>⌕</span>{item}</button>)}</div>
      </div>}
      {(relatedKeywords.length > 0 || suggestions.length > 0) && <div className="search-suggestion-list">
        {relatedKeywords.length > 0 && <div className="related-keyword-box"><strong>연관검색어</strong><div>{relatedKeywords.map((keyword) => <button type="button" key={keyword} onClick={() => setQuery(keyword)}>#{keyword}</button>)}</div></div>}
        {suggestions.map((item) => <button type="button" key={item.restaurantId} className="search-suggestion" onClick={() => void search(item)}><span className="search-suggestion-icon">⌖</span><span><strong>{item.name}</strong><small>{item.category} · {item.address}</small></span><span>›</span></button>)}
      </div>}
    </div>
    <section className="home-section restaurant-section">
      <div className="home-section-heading"><h2 className="section-title">오늘 밥은 이거 어때요?</h2><span className="recommendation-label">{recommendationSource === "gemini" ? "Gemini AI" : "AI 맞춤"}</span></div>
      <div className="recommendation-grid">
        {recommendations.slice(0, 4).map((item, index) => <Link href={`/restaurant/${item.restaurantId}`} className="recommendation-tile" key={item.restaurantId}>
          <div className="recommendation-image" style={{ backgroundColor: foodColors[index % foodColors.length], ...(item.imageUrl ? { backgroundImage: `url(${item.imageUrl})` } : {}) }}><span>{item.imageUrl ? "" : foodIcons[index % foodIcons.length]}</span></div>
          <div className="recommendation-tile-body"><strong>{item.name}</strong><p>★ {item.avgRating.toFixed(1)} ({item.reviewCount})</p><small>{item.reason}</small></div>
        </Link>)}
      </div>
      {recommendations.length === 0 && <p className="recommendation-empty">식당 데이터를 동기화하면 AI 추천이 표시돼요.</p>}
    </section>
  </>;
}
