"use client";
import BrandHeader from "../../../components/BrandHeader";

import { useEffect, useState } from "react";
import { useUserStore } from "../../../store/userStore";

type Review = {
  reviewId: string;
  content: string;
  rating: number;
  createdAt: string;
  user: {
    name: string;
  };
};

type Restaurant = {
  restaurantId: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  avgRating: number | null;
  reviews: Review[];
};

function Stars({ rating }: { rating: number }) {
  return (
    <span className="restaurant-stars" aria-label={`${rating}점`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={star <= Math.round(rating) ? "filled" : "empty"}
        >
          ★
        </span>
      ))}
    </span>
  );
}

export default function OwnerRestaurantPage() {
  const ownerId = useUserStore((state) => state.id) ?? "demo-owner";

  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [editing, setEditing] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const [modal, setModal] = useState({
    open: false,
    success: false,
    message: "",
  });
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    fetch(
      `/api/owner/restaurants?ownerId=${encodeURIComponent(ownerId)}`,
      { cache: "no-store" },
    )
      .then((response) => response.json())
      .then((data) => {
        const item = data.restaurants?.[0] as Restaurant | undefined;

        if (!item) {
          setModal({
            open: true,
            success: false,
            message: "등록된 식당 정보를 찾을 수 없습니다.",
          });
          return;
        }

        setRestaurant(item);
        setName(item.name);
        setDescription(item.description ?? "");
        setImageUrl(item.imageUrl ?? "");
      })
      .catch(() => {
        setModal({
          open: true,
          success: false,
          message: "식당 정보를 불러오지 못했습니다.",
        });
      });
  }, [ownerId]);

  function goToRestaurantView() {
    setEditing(false);

    if (restaurant) {
      setName(restaurant.name);
      setDescription(restaurant.description ?? "");
      setImageUrl(restaurant.imageUrl ?? "");
    }
  }

  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!restaurant) {
      setModal({ open: true, success: false, message: "식당 정보가 없습니다." });
      return;
    }
    setConfirmOpen(true);
  }

  async function confirmSave() {
    if (!restaurant) return;
    setConfirmOpen(false);
    try {
      const response = await fetch("/api/owner/restaurants", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ownerId, restaurantId: restaurant.restaurantId, name, description, imageUrl }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setModal({ open: true, success: false, message: data.message ?? "수정에 실패했습니다." });
        return;
      }
      setRestaurant((current) => current ? { ...current, ...data.restaurant, reviews: current.reviews } : current);
      setEditing(false);
      setModal({ open: true, success: true, message: "식당 정보가 수정되었습니다." });
    } catch {
      setModal({ open: true, success: false, message: "수정 중 오류가 발생했습니다." });
    }
  }

  return (
    <section className="page page-pad owner-restaurant-page">
      <header className={`role-page-header ${editing ? "role-page-header-editing" : ""}`}>
        {editing && (
          <button
            type="button"
            className="owner-back-button"
            aria-label="식당 정보 화면으로 돌아가기"
            onClick={goToRestaurantView}
          >
            ‹
          </button>
        )}
        <BrandHeader title="내 식당" />
      </header>

      {editing ? (
        <form className="owner-restaurant-form" onSubmit={save}>
          <div className="owner-edit-heading">
            <div>
              <p className="kicker">식당 정보 수정</p>
              <h2>내 식당 정보</h2>
            </div>
          </div>

          <label>
            식당 이름
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
          </label>

          <label>
            식당 소개
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={5}
            />
          </label>

          <label>
            사진 주소
            <input
              value={imageUrl}
              onChange={(event) => setImageUrl(event.target.value)}
              placeholder="https://..."
            />
          </label>

          <button
            type="submit"
            className="primary-wide"
            disabled={!restaurant}
          >
            수정 완료
          </button>
        </form>
      ) : (
        <main className="owner-restaurant-view">
          <div className="owner-restaurant-image">
            {restaurant?.imageUrl ? (
              <img src={restaurant.imageUrl} alt="식당 대표 이미지" />
            ) : (
              <span>🍽️</span>
            )}
          </div>

          <div className="owner-restaurant-title-row">
            <div>
              <p className="kicker">식당 정보</p>
              <h2>{restaurant?.name ?? "식당 정보 불러오는 중"}</h2>
            </div>

            <button
              type="button"
              className="outline-small-button"
              onClick={() => setEditing(true)}
              disabled={!restaurant}
            >
              수정
            </button>
          </div>

          <p className="owner-restaurant-description">
            {restaurant?.description || "등록된 식당 소개가 없습니다."}
          </p>

          <div className="owner-restaurant-score">
            <Stars rating={restaurant?.avgRating ?? 0} />
            <strong>{(restaurant?.avgRating ?? 0).toFixed(1)}</strong>
            <span>({restaurant?.reviews.length ?? 0})</span>
          </div>

          <section className="owner-reviews-section">
            <div className="reviews-heading">
              <h3>리뷰</h3>
              <span>
                ★ {(restaurant?.avgRating ?? 0).toFixed(1)}(
                {restaurant?.reviews.length ?? 0})
              </span>
            </div>

            {restaurant?.reviews.length ? (
              <div className="review-list">
                {restaurant.reviews.map((review) => (
                  <article className="review-item" key={review.reviewId}>
                    <div className="review-avatar">●</div>

                    <div className="review-content">
                      <div className="review-meta">
                        <strong>{review.user.name}</strong>
                        <Stars rating={review.rating} />
                        <span>
                          {new Date(review.createdAt).toLocaleDateString(
                            "ko-KR",
                          )}
                        </span>
                      </div>

                      <p>{review.content}</p>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <p className="empty-review">아직 작성된 리뷰가 없어요.</p>
            )}
          </section>
        </main>
      )}

      {modal.open && (
        <div className="owner-result-modal-backdrop">
          <div className="owner-result-modal" role="dialog" aria-modal="true">
            <div
              className={`owner-result-modal-icon ${
                modal.success ? "success" : "error"
              }`}
            >
              {modal.success ? "✓" : "!"}
            </div>

            <h2>{modal.success ? "수정 완료" : "수정 실패"}</h2>
            <p>{modal.message}</p>

            <button
              type="button"
              className="primary-wide"
              onClick={() =>
                setModal({
                  open: false,
                  success: false,
                  message: "",
                })
              }
            >
              확인
            </button>
          </div>
        </div>
      )}
      {confirmOpen && (
        <div className="owner-result-modal-backdrop">
          <div className="owner-result-modal" role="dialog" aria-modal="true">
            <div className="owner-result-modal-icon success">?</div>
            <h2>수정하시겠습니까?</h2>
            <p>입력한 식당 정보로 수정할까요?</p>
            <div className="confirm-actions">
              <button type="button" onClick={() => setConfirmOpen(false)}>취소</button>
              <button type="button" onClick={() => void confirmSave()}>수정하기</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
