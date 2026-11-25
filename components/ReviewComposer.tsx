"use client";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { RestaurantCard } from "../lib/appData";
import { useUserStore } from "../store/userStore";
import StudentVerificationModal from "./StudentVerificationModal";

export default function ReviewComposer({ restaurant }: { restaurant: RestaurantCard }) {
  const router = useRouter(); const user = useUserStore(); const userId = user.id ?? "demo-user";
  const [rating, setRating] = useState(0); const [content, setContent] = useState(""); const [photos, setPhotos] = useState<File[]>([]); const [verificationOpen, setVerificationOpen] = useState(false); const [confirmOpen, setConfirmOpen] = useState(false); const [message, setMessage] = useState(""); const [saving, setSaving] = useState(false); const ratingRef = useRef<HTMLDivElement>(null);
  const updateRatingFromPointer = (clientX: number) => { if (!ratingRef.current) return; const rect = ratingRef.current.getBoundingClientRect(); setRating(Math.max(1, Math.min(5, Math.ceil(Math.min(1, Math.max(0, (clientX - rect.left) / rect.width)) * 5)))); };
  function removePhoto(index: number) { setPhotos((items) => items.filter((_, itemIndex) => itemIndex !== index)); }
  async function submitReview() {
    if (!userId) { setMessage("로그인 후 리뷰를 작성해주세요."); setConfirmOpen(false); return; }
    if (!user.isStudentVerified) { setVerificationOpen(true); setConfirmOpen(false); return; }
    setSaving(true); setMessage("");
    const photoUrls: string[] = [];
    for (const file of photos) { const form = new FormData(); form.append("file", file); const upload = await fetch("/api/uploads", { method: "POST", body: form }); const data = await upload.json().catch(() => ({})); if (!upload.ok) { setMessage(data.message ?? "사진 업로드에 실패했습니다."); setSaving(false); setConfirmOpen(false); return; } photoUrls.push(data.url); }
    const response = await fetch("/api/reviews", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ userId, restaurantId: restaurant.restaurantId, rating, content, photoUrls }) }); const data = await response.json().catch(() => ({})); setSaving(false);
    if (!response.ok) { setMessage(data.message ?? "리뷰 등록에 실패했습니다."); setConfirmOpen(false); return; }
    router.push(`/restaurant/${restaurant.restaurantId}?review=created`); router.refresh();
  }
  return <section className="page review-composer-page"><header className="review-composer-header"><Link href={`/restaurant/${restaurant.restaurantId}`} className="back-button" aria-label="식당으로 돌아가기">‹</Link><Image src="/assets/jjeopjjeop-logo.png" alt="쩝쩝대" width={34} height={34} /><span>리뷰작성</span></header><main className="review-composer-main"><h1>{restaurant.name}</h1><div ref={ratingRef} className="rating-picker" role="slider" aria-label="별점 선택" aria-valuemin={1} aria-valuemax={5} aria-valuenow={rating} onClick={(event) => updateRatingFromPointer(event.clientX)} onPointerMove={(event) => { if (event.buttons === 1) updateRatingFromPointer(event.clientX); }}>{[1, 2, 3, 4, 5].map((star) => <button type="button" key={star} aria-label={`${star}점`} onClick={() => setRating(star)} className={star <= rating ? "selected" : ""}>★</button>)}</div><label className="photo-add-button">▣　사진 첨부하기<input type="file" accept="image/*" multiple hidden onChange={(event) => setPhotos((items) => [...items, ...Array.from(event.target.files ?? [])].slice(0, 5))} /></label>{photos.length > 0 && <div className="review-selected-photos">{photos.map((file, index) => <div className="review-selected-photo" key={`${file.name}-${file.lastModified}-${index}`}><img src={URL.createObjectURL(file)} alt="선택한 리뷰 사진" /><button type="button" onClick={() => removePhoto(index)} aria-label="사진 삭제">×</button></div>)}</div>}<textarea value={content} onChange={(event) => setContent(event.target.value)} placeholder="식당에서의 경험을 자세히 남겨주세요." aria-label="리뷰 내용" />{message && <p className="review-form-message">{message}</p>}<button type="button" className="submit-review-button" disabled={!rating || !content.trim() || saving} onClick={() => setConfirmOpen(true)}>{saving ? "등록 중..." : "제출하기"}</button><div className={`student-verify-card ${user.isStudentVerified ? "is-verified" : ""}`}><div className="student-verify-card-title"><span className="student-verify-check">{user.isStudentVerified ? "✓" : ""}</span><strong>{user.isStudentVerified ? "재학생 인증 완료" : "재학생 인증"}</strong></div><button type="button" className="student-verify-info" onClick={() => setVerificationOpen(true)}>인증 정보 확인</button><p>{user.isStudentVerified ? "재학생 인증이 완료되었어요." : "재학생 인증 후 리뷰를 작성할 수 있어요."}</p></div></main><StudentVerificationModal open={verificationOpen} onClose={() => setVerificationOpen(false)} />{confirmOpen && <div className="review-confirm-backdrop"><div className="review-confirm-modal"><div className="confirm-mark">?</div><h2>리뷰를 제출하시겠습니까?</h2><p>작성한 리뷰는 식당 페이지에 등록됩니다.</p><div className="confirm-actions"><button type="button" onClick={() => setConfirmOpen(false)}>취소</button><button type="button" onClick={submitReview}>제출하기</button></div></div></div>}</section>;
}
