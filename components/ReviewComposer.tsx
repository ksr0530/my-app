"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import type { RestaurantCard } from "../lib/appData";

export default function ReviewComposer({ restaurant }: { restaurant: RestaurantCard }) {
  const [rating, setRating] = useState(0);
  const [content, setContent] = useState("");
  const [studentVerified, setStudentVerified] = useState(false);
  const ratingRef = useRef<HTMLDivElement>(null);

  const updateRatingFromPointer = (clientX: number) => {
    if (!ratingRef.current) return;
    const rect = ratingRef.current.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    setRating(Math.max(1, Math.min(5, Math.ceil(ratio * 5))));
  };

  return <section className="page review-composer-page">
    <header className="review-composer-header">
      <Link href={`/restaurant/${restaurant.restaurantId}`} className="back-button" aria-label="식당으로 돌아가기">‹</Link>
      <Image src="/assets/jjeopjjeop-logo.png" alt="쩝쩝대" width={34} height={34} />
      <span>리뷰작성</span>
    </header>

    <main className="review-composer-main">
      <h1>{restaurant.name}</h1>
      <div ref={ratingRef} className="rating-picker" role="slider" aria-label="별점 선택" aria-valuemin={1} aria-valuemax={5} aria-valuenow={rating} onClick={(event) => updateRatingFromPointer(event.clientX)} onPointerMove={(event) => { if (event.buttons === 1) updateRatingFromPointer(event.clientX); }}>
        {[1, 2, 3, 4, 5].map((star) => <button type="button" key={star} aria-label={`${star}점`} onClick={() => setRating(star)} className={star <= rating ? "selected" : ""}>★</button>)}
      </div>
      <button type="button" className="photo-add-button">▣　사진</button>
      <textarea value={content} onChange={(event) => setContent(event.target.value)} placeholder="문의 내용을 입력해주세요." aria-label="리뷰 내용" />
      <button type="button" className="submit-review-button" disabled={!rating || !content.trim()}>제출하기</button>
      <label className="student-verify-row"><input type="checkbox" checked={studentVerified} onChange={(event) => setStudentVerified(event.target.checked)} /><span>재학생 인증 완료</span><small>재학생 인증을 거친 사용자만 리뷰를 작성할 수 있습니다.</small></label>
    </main>
  </section>;
}
