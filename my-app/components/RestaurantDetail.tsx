"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { RestaurantCard, ReviewCard } from "../lib/appData";
import { useUserStore } from "../store/userStore";
import { DeleteModal, ReportModal } from "./ActionModals";

type Summary = { keywords: Array<{ keyword: string; count: number }>; mostMentioned: string; summary: string; reviewCount: number };
function Stars({ rating }: { rating: number }) { return <span className="restaurant-stars" aria-label={`${rating}점`}>{[1, 2, 3, 4, 5].map((s) => <span key={s} className={s <= Math.round(rating) ? "filled" : "empty"}>★</span>)}</span>; }

export default function RestaurantDetail({ restaurant, reviews }: { restaurant: RestaurantCard; reviews: ReviewCard[] }) {
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [summaryError, setSummaryError] = useState("");
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [reportId, setReportId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const userId = useUserStore((s) => s.id);
  const average = restaurant.avgRating;

  async function openSummary() {
    setSummaryOpen(true);
    setSummaryError("");
    if (summary || summaryLoading) return;
    setSummaryLoading(true);
    try {
      const response = await fetch(`/api/reviews/summary?restaurantId=${encodeURIComponent(restaurant.restaurantId)}`, { cache: "no-store" });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.message ?? "리뷰 요약을 불러오지 못했습니다.");
      setSummary(data as Summary);
    } catch (error) {
      setSummaryError(error instanceof Error ? error.message : "리뷰 요약을 불러오지 못했습니다.");
    } finally {
      setSummaryLoading(false);
    }
  }

  async function remove() {
    if (!deleteId) return;
    await fetch(`/api/reviews/${deleteId}`, { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ userId }) });
    setDeleteId(null);
    location.reload();
  }

  return <section className="page restaurant-detail-page">
    <header className="restaurant-detail-header"><Link href="/home" className="back-button">‹</Link><Image src="/assets/jjeopjjeop-logo.png" alt="쩝쩝대" width={34} height={34} /><span className="restaurant-header-title">식당</span></header>
    <main>
      <section className="restaurant-hero"><div><h1>{restaurant.name}</h1><p>{restaurant.description}</p></div><div className="restaurant-score"><Stars rating={average} /><strong>{average.toFixed(1)}</strong><span>({restaurant.reviewCount})</span></div></section>
      <div className="restaurant-photo-placeholder">식당 사진</div>
      <section className="restaurant-action-row"><button className="restaurant-action-button" onClick={openSummary}>✦ AI 리뷰 요약</button><Link href={`/restaurant/${restaurant.restaurantId}/review`} className="restaurant-action-button">✎ 리뷰 작성</Link></section>
      <section className="reviews-section"><div className="reviews-heading"><h2>리뷰</h2><span>★ {average.toFixed(1)}({restaurant.reviewCount})</span></div><div className="review-list">{reviews.length ? reviews.map((r) => { const own = Boolean(userId && r.userId === userId); const long = r.content.length > 42; const text = !expanded[r.reviewId] && long ? `${r.content.slice(0, 42)}...` : r.content; return <article className="review-item" key={r.reviewId}><div className="review-avatar">●</div><div className="review-content"><div className="review-meta"><strong>{r.author}</strong><Stars rating={r.rating} /><span>{r.createdAt ?? "오늘"}</span></div><p>{text}</p>{long && <button className="review-toggle" onClick={() => setExpanded((x) => ({ ...x, [r.reviewId]: !x[r.reviewId] }))}>{expanded[r.reviewId] ? "접기" : "더보기"}</button>}<div className="content-action-row">{own ? <><Link href={`/review-edit/${r.reviewId}`}>수정</Link><button onClick={() => setDeleteId(r.reviewId)}>삭제</button></> : <button onClick={() => setReportId(r.reviewId)}>신고</button>}</div></div><div className="review-photo-placeholder">사진</div></article>; }) : <p className="empty-review">아직 작성된 리뷰가 없어요.</p>}</div></section>
    </main>
    {summaryOpen && <div className="popup-backdrop" onClick={() => setSummaryOpen(false)}><div className="ai-summary-popup" onClick={(e) => e.stopPropagation()}><button className="popup-close" onClick={() => setSummaryOpen(false)}>×</button><div className="ai-popup-heading"><div className="ai-popup-badge">✦</div><div><p>쩝쩝대 AI</p><h2>리뷰를 한눈에 요약했어요</h2></div></div>{summaryLoading ? <p className="ai-summary-state">리뷰를 분석하고 있어요...</p> : summaryError ? <div className="ai-summary-state ai-summary-error"><p>{summaryError}</p><button type="button" onClick={openSummary}>다시 시도</button></div> : summary ? <><div className="ai-summary-score"><strong>{average.toFixed(1)}</strong><Stars rating={average} /><span>리뷰 {summary.reviewCount}개 기준</span></div><div className="summary-keywords"><span>많이 언급된 키워드</span><div>{summary.keywords.map((item) => <strong key={item.keyword}>#{item.keyword} <small>{item.count}</small></strong>)}</div></div><div className="summary-highlight"><span>가장 많이 언급된 내용</span><strong>{summary.mostMentioned}</strong></div><p className="summary-body">{summary.summary}</p></> : null}</div></div>}
    {reportId && <ReportModal open targetType="REVIEW" targetId={reportId} onClose={() => setReportId(null)} />}<DeleteModal open={Boolean(deleteId)} label="리뷰" onClose={() => setDeleteId(null)} onConfirm={remove} />
  </section>;
}
