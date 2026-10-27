"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import type { CommunityCard } from "../lib/appData";

type Comment = { id: number; author: string; text: string; time: string };

export default function CommunityDetail({ post }: { post: CommunityCard }) {
  const [currentCount, setCurrentCount] = useState(post.currentCount);
  const [joined, setJoined] = useState(false);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<Comment[]>([
    { id: 1, author: "박민준", text: "저도 같이 참여하고 싶어요!", time: "10분 전" },
    { id: 2, author: "최서연", text: "몇 시에 만날까요?", time: "5분 전" },
  ]);
  const closed = post.isClosed || (!joined && currentCount >= post.targetCount);

  function toggleJoin() {
    if (joined) { setCurrentCount((count) => Math.max(post.currentCount, count - 1)); setJoined(false); return; }
    if (!closed) { setCurrentCount((count) => Math.min(post.targetCount, count + 1)); setJoined(true); }
  }
  function addComment(event: FormEvent) { event.preventDefault(); if (!comment.trim()) return; setComments((items) => [...items, { id: Date.now(), author: "홍길동", text: comment.trim(), time: "방금 전" }]); setComment(""); }

  return <section className="community-detail-screen"><header className="community-detail-top"><Link href="/community" className="back-button" aria-label="커뮤니티로 돌아가기">‹</Link><h1>커뮤니티 글</h1><span className="detail-header-spacer" aria-hidden="true" /></header><main className="community-detail-content"><div className="detail-post-head"><div className="detail-post-avatar">🍱</div><div><p className="detail-category">{post.category ?? "밥친구"}</p><h2>{post.title}</h2><small>{post.author} · {post.createdAt ?? "방금 전"}</small></div></div><p className="detail-post-body">{post.description ?? "같이 주문하고 밥친구를 찾아요."}</p><div className="detail-recruit-box"><div><span>모집 인원</span><strong>{currentCount}/{post.targetCount}명</strong></div><div className="detail-progress"><i style={{ width: `${Math.min(100, (currentCount / post.targetCount) * 100)}%` }} /></div><p>{closed && !joined ? "모집이 마감됐어요." : joined ? "참여를 취소할 수도 있어요." : "아직 참여할 수 있어요."}</p></div><div className="detail-actions"><button type="button" onClick={toggleJoin}>{joined ? "참여 취소" : closed ? "모집 완료" : "배달메이트 참여하기"}</button></div><section className="comment-section"><div className="comment-heading"><h3>댓글</h3><span>{comments.length}</span></div><div className="comment-list">{comments.map((item) => <article className="comment-item" key={item.id}><div className="comment-avatar">●</div><div><div className="comment-meta"><strong>{item.author}</strong><small>{item.time}</small></div><p>{item.text}</p></div></article>)}</div><form className="comment-form" onSubmit={addComment}><input value={comment} onChange={(event) => setComment(event.target.value)} placeholder="댓글을 남겨주세요" aria-label="댓글 입력" /><button type="submit">등록</button></form></section></main></section>;
}
