import { prisma } from "./prisma";

export type RestaurantCard = {
  restaurantId: string;
  name: string;
  description: string;
  avgRating: number;
};

export type CommunityCard = {
  postId: string;
  title: string;
  description?: string;
  category?: string;
  currentCount: number;
  targetCount: number;
  isClosed: boolean;
  author: string;
};

export type ReviewCard = {
  reviewId: string;
  content: string;
  rating: number;
  author: string;
  restaurantName: string;
};

export const demoRestaurants: RestaurantCard[] = [
  { restaurantId: "restaurant-001", name: "학생식당 오늘한끼", description: "든든하고 저렴한 학교 앞 한식 백반집", avgRating: 4.6 },
  { restaurantId: "restaurant-002", name: "캠퍼스 김밥", description: "혼밥하기 좋은 분식과 김밥 전문점", avgRating: 4.2 },
  { restaurantId: "restaurant-003", name: "골목 즉석떡볶이", description: "매콤한 떡볶이와 튀김을 함께 즐기는 곳", avgRating: 4.4 },
  { restaurantId: "restaurant-004", name: "소담 국수집", description: "잔치국수와 비빔국수가 인기인 작은 식당", avgRating: 4.0 },
  { restaurantId: "restaurant-005", name: "마루 덮밥", description: "빠르게 먹기 좋은 제육·연어 덮밥 전문점", avgRating: 4.7 },
  { restaurantId: "restaurant-006", name: "우리동네 카페", description: "수업 전후 쉬어가기 좋은 조용한 카페", avgRating: 4.3 },
  { restaurantId: "restaurant-007", name: "청춘 치킨", description: "배달메이트와 함께 주문하기 좋은 치킨집", avgRating: 4.5 },
  { restaurantId: "restaurant-008", name: "정든 부대찌개", description: "여럿이 방문하기 좋은 얼큰한 부대찌개", avgRating: 4.1 },
];

export const demoCommunities: CommunityCard[] = [
  { postId: "post-001", title: "오늘 점심 청춘 치킨 같이 시켜요!", description: "최소주문금액을 맞춰서 같이 주문할 밥친구를 모집해요.", category: "치킨", currentCount: 2, targetCount: 4, isClosed: false, author: "김사랑" },
  { postId: "post-002", title: "마루 덮밥 배달메이트 구합니다", description: "오늘 마루 덮밥 같이 주문하고 학교에서 받아요.", category: "한식", currentCount: 1, targetCount: 3, isClosed: false, author: "이혜민" },
  { postId: "post-003", title: "오늘 저녁 정든 부대찌개 드실 분", description: "저녁 6시에 정든 부대찌개 함께 드실 분을 찾아요.", category: "한식", currentCount: 3, targetCount: 5, isClosed: false, author: "박민준" },
  { postId: "post-004", title: "최소주문금액 맞춰서 같이 주문해요", description: "배달비와 최소주문금액을 아끼고 싶은 분들을 모집했어요.", category: "배달", currentCount: 4, targetCount: 4, isClosed: true, author: "최서연" },
];

export const demoReviews: ReviewCard[] = [
  { reviewId: "review-001", content: "가격도 착하고 반찬이 깔끔해서 자주 가요.", rating: 5, author: "김사랑", restaurantName: "학생식당 오늘한끼" },
  { reviewId: "review-002", content: "점심시간에는 사람이 많지만 회전이 빨라요.", rating: 4, author: "이혜민", restaurantName: "학생식당 오늘한끼" },
  { reviewId: "review-007", content: "제육덮밥 양이 많아서 든든하게 먹었어요.", rating: 5, author: "이혜민", restaurantName: "마루 덮밥" },
];

export async function getRestaurants(): Promise<RestaurantCard[]> {
  try {
    const rows = await prisma.restaurant.findMany({ orderBy: { avgRating: "desc" } });
    if (rows.length) return rows.map((row) => ({ ...row, description: row.description ?? "학교 주변 인기 맛집", avgRating: row.avgRating ?? 0 }));
  } catch {
    // 발표용 fallback 데이터를 사용합니다.
  }
  return demoRestaurants;
}

export async function getCommunities(): Promise<CommunityCard[]> {
  try {
    const rows = await prisma.community.findMany({ include: { user: true }, orderBy: { postId: "asc" } });
    if (rows.length) return rows.map((row) => ({
      postId: row.postId,
      title: row.title,
      currentCount: row.currentCount,
      targetCount: row.targetCount,
      isClosed: row.isClosed,
      author: row.user.name,
      description: "같이 주문하고 밥친구를 찾아요.",
      category: row.title.includes("배달") ? "배달" : "한식",
    }));
  } catch {
    // 발표용 fallback 데이터를 사용합니다.
  }
  return demoCommunities;
}

export async function getReviews(): Promise<ReviewCard[]> {
  try {
    const rows = await prisma.review.findMany({ include: { user: true, restaurant: true }, orderBy: { createdAt: "desc" }, take: 12 });
    if (rows.length) return rows.map((row) => ({ reviewId: row.reviewId, content: row.content, rating: row.rating, author: row.user.name, restaurantName: row.restaurant.name }));
  } catch {
    // 발표용 fallback 데이터를 사용합니다.
  }
  return demoReviews;
}
