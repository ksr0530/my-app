"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { RestaurantCard, ReviewCard } from "../lib/appData";

function Stars({ rating }: { rating: number }) {
  return <span className="restaurant-stars" aria-label={`${rating}점`}>{[1, 2, 3, 4, 5].map((star) => <span key={star} className={star <= Math.round(rating) ? "filled" : "empty"}>★</span>)}</span>;
}

export default function RestaurantDetail({ restaurant, reviews }: { restaurant: RestaurantCard; reviews: ReviewCard[] }) {
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [expandedReviews, setExpandedReviews] = useState<Record<string, boolean>>({});

  const toggleReview = (reviewId: string) => setExpandedReviews((current) => ({ ...current, [reviewId]: !current[reviewId] }));
  const average = restaurant.avgRating;
  const reviewCount = restaurant.reviewCount;

  return <section className="page restaurant-detail-page">
    <header className="restaurant-detail-header">
      <Link href="/" className="back-button" aria-label="홈으로 돌아가기">‹</Link>
      <Image src="/assets/jjeopjjeop-logo.png" alt="쩝쩝대" width={34} height={34} className="restaurant-logo" />
      <span className="restaurant-header-title">식당</span>
    </header>

    <main>
      <section className="restaurant-hero">
        <div>
          <h1>{restaurant.name}</h1>
          <p>{restaurant.description}</p>
        </div>
        <div className="restaurant-score"><Stars rating={average} /><strong>{average.toFixed(1)}</strong><span>({reviewCount})</span></div>
      </section>

      <div className="restaurant-photo-placeholder" aria-label="식당 사진 자리"><span>식당 사진</span><small>추후 이미지 파일을 이 영역에 넣을 수 있어요.</small></div>

      <section className="restaurant-action-row">
        <button type="button" className="restaurant-action-button" onClick={() => setSummaryOpen(true)}>✦ AI 리뷰 요약</button>
        <Link href={`/restaurant/${restaurant.restaurantId}/review`} className="restaurant-action-button">✎ 리뷰 작성</Link>
      </section>

      <section className="reviews-section">
        <div className="reviews-heading"><h2>리뷰</h2><span>★ {average.toFixed(1)}({reviewCount})</span></div>
        <div className="review-list">
          {reviews.length ? reviews.map((review) => {
            const expanded = Boolean(expandedReviews[review.reviewId]);
            const isLong = review.content.length > 42;
            const visibleText = !expanded && isLong ? `${review.content.slice(0, 42)}...` : review.content;
            return <article className="review-item" key={review.reviewId}>
              <div className="review-avatar" aria-hidden="true">●</div>
              <div className="review-content">
                <div className="review-meta"><strong>{review.author}</strong><Stars rating={review.rating} /><span>{review.createdAt ?? "2024.06.12"}</span></div>
                <p>{visibleText}</p>
                {isLong && <button type="button" className="review-toggle" onClick={() => toggleReview(review.reviewId)}>{expanded ? "접기" : "더보기"} {expanded ? "⌃" : "⌄"}</button>}
              </div>
              <div className="review-photo-placeholder">사진</div>
            </article>;
          }) : <p className="empty-review">아직 작성된 리뷰가 없어요.</p>}
        </div>
      </section>
    </main>

    {summaryOpen && <div className="popup-backdrop" role="presentation" onClick={() => setSummaryOpen(false)}>
      <div className="ai-summary-popup" role="dialog" aria-modal="true" aria-labelledby="ai-summary-title" onClick={(event) => event.stopPropagation()}>
        <button type="button" className="popup-close" onClick={() => setSummaryOpen(false)} aria-label="팝업 닫기">×</button>
        <div className="ai-popup-heading"><div className="ai-popup-badge">✦</div><div><p>쩝쩝대 AI</p><h2 id="ai-summary-title">리뷰를 한눈에 요약했어요</h2></div></div>
        <div className="ai-summary-score"><strong>{average.toFixed(1)}</strong><Stars rating={average} /><span>리뷰 {reviewCount}개 기준</span></div>
        <div className="summary-highlight"><span>가장 많이 언급된 내용</span><strong>가격이 합리적이고 혼밥하기 좋아요</strong></div>
        <ul><li>가격 대비 만족도가 높다는 의견이 많아요.</li><li>점심시간에는 방문자가 많지만 회전이 빠른 편이에요.</li></ul>
        <p className="summary-note">리뷰 내용을 바탕으로 정리한 발표용 요약입니다.</p>
      </div>
    </div>}
  </section>;
}
