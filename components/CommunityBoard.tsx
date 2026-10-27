"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { CommunityCard } from "../lib/appData";

const categories = ["전체", "한식", "분식", "일식", "중식", "디저트", "기타"];
type SortMode = "latest" | "popular";
const STORAGE_KEY = "jjeopjjeop-community-posts";

export default function CommunityBoard({ initialPosts }: { initialPosts: CommunityCard[] }) {
  const [posts, setPosts] = useState(initialPosts);
  const [category, setCategory] = useState("전체");
  const [sort, setSort] = useState<SortMode>("latest");

  useEffect(() => {
    let cancelled = false;
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]") as CommunityCard[];
      if (Array.isArray(saved) && saved.length) {
        window.setTimeout(() => {
          if (!cancelled) setPosts([...saved, ...initialPosts.filter((post) => !saved.some((item) => item.postId === post.postId))]);
        }, 0);
      }
    } catch { /* ignore malformed local demo data */ }
    return () => { cancelled = true; };
  }, [initialPosts]);

  useEffect(() => {
    function refresh() {
      try {
        const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]") as CommunityCard[];
        if (Array.isArray(saved)) setPosts([...saved, ...initialPosts.filter((post) => !saved.some((item) => item.postId === post.postId))]);
      } catch { /* ignore */ }
    }
    window.addEventListener("jjeopjjeop:community-updated", refresh);
    return () => window.removeEventListener("jjeopjjeop:community-updated", refresh);
  }, [initialPosts]);

  const filteredPosts = useMemo(() => {
    const result = posts.filter((post) => category === "전체" || post.category === category);
    return [...result].sort((a, b) => sort === "popular" ? (b.currentCount / Math.max(1, b.targetCount)) - (a.currentCount / Math.max(1, a.targetCount)) : (b.createdAt ?? "").localeCompare(a.createdAt ?? ""));
  }, [category, posts, sort]);

  return <>
    <div className="community-filter-row">{categories.map((item) => <button type="button" key={item} onClick={() => setCategory(item)} className={`community-filter-chip ${category === item ? "active" : ""}`}>{item}</button>)}</div>
    <div className="community-list-heading"><strong>커뮤니티</strong><label><span className="sr-only">게시글 정렬</span><select value={sort} onChange={(event) => setSort(event.target.value as SortMode)}><option value="latest">최신순</option><option value="popular">인기순</option></select><span className="sort-chevron">⌄</span></label></div>
    <p className="community-count">총 {filteredPosts.length}개의 게시글</p>
    <div className="community-card-list">{filteredPosts.map((post, index) => { const closed = post.isClosed || post.currentCount >= post.targetCount; return <article className="community-post-card" key={post.postId}><Link href={`/community/${post.postId}`} className="community-post-main"><div className={`community-post-icon icon-${index % 3}`}>{index % 3 === 0 ? "🍚" : index % 3 === 1 ? "🍱" : "🥗"}</div><div className="community-post-copy"><div className="community-post-title-row"><h3>{post.title}</h3><span className={closed ? "closed" : "open"}>{closed ? "모집완료" : `${post.currentCount}/${post.targetCount}`}</span></div><p>{post.description ?? "같이 주문하고 밥친구를 찾아요."}</p><small>{post.author} · {post.createdAt ?? "방금 전"}</small></div></Link></article>; })}{filteredPosts.length === 0 && <p className="community-empty">선택한 음식 카테고리의 글이 없어요.</p>}</div>
    <Link href="/community/new" className="community-floating-button" aria-label="게시글 작성">+</Link>
  </>;
}
