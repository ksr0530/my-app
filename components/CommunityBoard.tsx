"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { CommunityCard } from "../lib/appData";

const categories = ["전체", "점심", "석식", "배달메이트"];

export default function CommunityBoard({ initialPosts }: { initialPosts: CommunityCard[] }) {
  const [posts, setPosts] = useState(initialPosts);
  const [category, setCategory] = useState("전체");
  const [joinedPostId, setJoinedPostId] = useState<string | null>(null);
  const filteredPosts = useMemo(() => posts.filter((post) => category === "전체" || (category === "배달메이트" ? post.title.includes("배달") || post.description?.includes("배달") : post.title.includes(category) || post.category === category)), [category, posts]);

  function joinPost(postId: string) {
    setPosts((current) => current.map((post) => {
      if (post.postId !== postId || post.isClosed || post.currentCount >= post.targetCount) return post;
      const currentCount = post.currentCount + 1;
      return { ...post, currentCount, isClosed: currentCount >= post.targetCount };
    }));
    setJoinedPostId(postId);
  }

  return <>
    <div className="community-filter-row">{categories.map((item) => <button type="button" key={item} onClick={() => setCategory(item)} className={`community-filter-chip ${category === item ? "active" : ""}`}>{item}</button>)}</div>
    <div className="community-list-heading"><strong>커뮤니티</strong><span>총 {filteredPosts.length}개　 최신순⌄</span></div>
    <div className="community-card-list">{filteredPosts.map((post, index) => { const closed = post.isClosed || post.currentCount >= post.targetCount; const joined = joinedPostId === post.postId; return <article className="community-post-card" key={post.postId}><Link href={`/community/${post.postId}`} className="community-post-main"><div className={`community-post-icon icon-${index % 3}`}>{index % 3 === 0 ? "🍚" : index % 3 === 1 ? "🍱" : "🥗"}</div><div className="community-post-copy"><div className="community-post-title-row"><h3>{post.title}</h3><span className={closed ? "closed" : "open"}>{closed ? "모집완료" : `${post.currentCount}/${post.targetCount}`}</span></div><p>{post.description ?? "같이 주문하고 밥친구를 찾아요."}</p><small>{post.author} · {post.createdAt ?? "방금 전"}</small></div></Link><button type="button" disabled={closed || joined} onClick={() => joinPost(post.postId)} className="community-join-button">{joined ? "참여완료" : closed ? "모집완료" : "밥친구 참여"}</button></article>; })}{filteredPosts.length === 0 && <p className="community-empty">선택한 카테고리의 글이 없어요.</p>}</div>
    <Link href="/community/new" className="community-floating-button" aria-label="게시글 작성">+</Link>
  </>;
}
