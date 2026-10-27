import { prisma } from "./prisma";

export type RestaurantCard = {
  restaurantId: string;
  name: string;
  description: string;
  avgRating: number;
  reviewCount: number;
  latitude: number | null;
  longitude: number | null;
  category: string;
  suitableFor: number[];
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
  createdAt?: string;
};

export type ReviewCard = {
  reviewId: string;
  content: string;
  rating: number;
  author: string;
  restaurantName: string;
  createdAt?: string;
};

export const BUCHEON_UNIVERSITY = { latitude: 37.4886, longitude: 126.7830 };

export const demoRestaurants: RestaurantCard[] = [
  { restaurantId: "restaurant-001", name: "학생식당 오늘한끼", description: "든든하고 저렴한 학교 앞 한식 백반집", avgRating: 4.5, reviewCount: 2, latitude: 37.4889, longitude: 126.7828, category: "한식", suitableFor: [1, 2, 4, 6] },
  { restaurantId: "restaurant-002", name: "캠퍼스 김밥", description: "혼밥하기 좋은 분식과 김밥 전문점", avgRating: 4.0, reviewCount: 2, latitude: 37.4893, longitude: 126.7838, category: "분식", suitableFor: [1, 2] },
  { restaurantId: "restaurant-003", name: "골목 즉석떡볶이", description: "매콤한 떡볶이와 튀김을 함께 즐기는 곳", avgRating: 4.3, reviewCount: 2, latitude: 37.4879, longitude: 126.7845, category: "분식", suitableFor: [2, 4, 6] },
  { restaurantId: "restaurant-004", name: "소담 국수집", description: "잔치국수와 비빔국수가 인기인 작은 식당", avgRating: 4.0, reviewCount: 1, latitude: 37.4876, longitude: 126.7819, category: "한식", suitableFor: [1, 2, 4] },
  { restaurantId: "restaurant-005", name: "마루 덮밥", description: "빠르게 먹기 좋은 제육·연어 덮밥 전문점", avgRating: 4.5, reviewCount: 2, latitude: 37.4897, longitude: 126.7818, category: "한식", suitableFor: [1, 2] },
  { restaurantId: "restaurant-006", name: "우리동네 카페", description: "수업 전후 쉬어가기 좋은 조용한 카페", avgRating: 4.0, reviewCount: 1, latitude: 37.4869, longitude: 126.7832, category: "기타", suitableFor: [1, 2, 4] },
  { restaurantId: "restaurant-007", name: "청춘 치킨", description: "배달메이트와 함께 주문하기 좋은 치킨집", avgRating: 4.3, reviewCount: 2, latitude: 37.4901, longitude: 126.7841, category: "기타", suitableFor: [2, 4, 6] },
  { restaurantId: "restaurant-008", name: "정든 부대찌개", description: "여럿이 방문하기 좋은 얼큰한 부대찌개", avgRating: 4.0, reviewCount: 1, latitude: 37.4867, longitude: 126.7809, category: "한식", suitableFor: [2, 4, 6] },
  { restaurantId: "restaurant-009", name: "한입 샐러드", description: "가볍고 건강한 점심을 위한 샐러드 가게", avgRating: 5.0, reviewCount: 1, latitude: 37.4890, longitude: 126.7850, category: "기타", suitableFor: [1, 2] },
  { restaurantId: "restaurant-010", name: "학생회관 석식당", description: "수업 후 든든하게 먹기 좋은 교내 석식 식당", avgRating: 4.0, reviewCount: 1, latitude: 37.4882, longitude: 126.7854, category: "한식", suitableFor: [1, 2, 4, 6] },
];

export const demoCommunities: CommunityCard[] = [
  { postId: "post-001", title: "오늘 점심 청춘 치킨 같이 시켜요!", description: "최소주문금액을 맞춰서 같이 주문할 밥친구를 모집해요.", category: "기타", currentCount: 2, targetCount: 4, isClosed: false, author: "김사랑", createdAt: "2026-10-26" },
  { postId: "post-002", title: "마루 덮밥 배달메이트 구합니다", description: "오늘 마루 덮밥 같이 주문하고 학교에서 받아요.", category: "한식", currentCount: 1, targetCount: 3, isClosed: false, author: "이혜민", createdAt: "2026-10-25" },
  { postId: "post-003", title: "오늘 저녁 정든 부대찌개 드실 분", description: "저녁 6시에 정든 부대찌개 함께 드실 분을 찾아요.", category: "한식", currentCount: 3, targetCount: 5, isClosed: false, author: "박민준", createdAt: "2026-10-24" },
  { postId: "post-004", title: "최소주문금액 맞춰서 같이 주문해요", description: "배달비와 최소주문금액을 아끼고 싶은 분들을 모집했어요.", category: "기타", currentCount: 4, targetCount: 4, isClosed: true, author: "최서연", createdAt: "2026-10-23" },
  { postId: "post-005", title: "오늘 저녁 학생회관 석식 같이 먹을 사람", description: "수업 끝나고 학생회관에서 같이 먹어요.", category: "한식", currentCount: 2, targetCount: 4, isClosed: false, author: "정준호", createdAt: "2026-10-22" },
];

export const demoReviews: ReviewCard[] = [
  { reviewId: "review-001", content: "가격도 착하고 반찬이 깔끔해서 자주 가요. 점심시간에는 사람이 많지만 회전이 빨라서 생각보다 오래 기다리지는 않았어요.", rating: 5, author: "김사랑", restaurantName: "학생식당 오늘한끼", createdAt: "2026.10.05" },
  { reviewId: "review-002", content: "메뉴가 매일 조금씩 달라져서 좋아요. 혼자 먹기에도 부담 없는 분위기입니다.", rating: 4, author: "이혜민", restaurantName: "학생식당 오늘한끼", createdAt: "2026.10.06" },
  { reviewId: "review-003", content: "김밥이 든든하고 혼자 먹기 편합니다.", rating: 4, author: "박민준", restaurantName: "캠퍼스 김밥", createdAt: "2026.10.07" },
  { reviewId: "review-004", content: "참치김밥이 맛있어요. 포장도 빨라요.", rating: 4, author: "최서연", restaurantName: "캠퍼스 김밥", createdAt: "2026.10.08" },
  { reviewId: "review-005", content: "맵기는 하지만 튀김과 같이 먹으면 딱 좋아요.", rating: 5, author: "정준호", restaurantName: "골목 즉석떡볶이", createdAt: "2026.10.08" },
  { reviewId: "review-006", content: "국물이 깔끔하고 양이 넉넉합니다.", rating: 4, author: "김사랑", restaurantName: "소담 국수집", createdAt: "2026.10.09" },
  { reviewId: "review-007", content: "제육덮밥 양이 많아서 든든하게 먹었어요.", rating: 5, author: "이혜민", restaurantName: "마루 덮밥", createdAt: "2026.10.09" },
  { reviewId: "review-008", content: "키오스크 주문이라 점심에도 편합니다.", rating: 4, author: "박민준", restaurantName: "마루 덮밥", createdAt: "2026.10.10" },
  { reviewId: "review-009", content: "콘센트가 많고 조용해서 공부하기 좋아요.", rating: 4, author: "최서연", restaurantName: "우리동네 카페", createdAt: "2026.10.10" },
  { reviewId: "review-010", content: "치킨이 바삭하고 배달이 빨랐어요.", rating: 5, author: "정준호", restaurantName: "청춘 치킨", createdAt: "2026.10.11" },
  { reviewId: "review-011", content: "여럿이 먹기 좋고 사리가 다양해요.", rating: 4, author: "김사랑", restaurantName: "정든 부대찌개", createdAt: "2026.10.11" },
  { reviewId: "review-012", content: "신선하고 소스 선택지가 많아서 좋습니다.", rating: 5, author: "이혜민", restaurantName: "한입 샐러드", createdAt: "2026.10.12" },
  { reviewId: "review-013", content: "수업 끝나고 먹기 좋은 든든한 석식 메뉴예요.", rating: 4, author: "박민준", restaurantName: "학생회관 석식당", createdAt: "2026.10.12" },
  { reviewId: "review-014", content: "친구들과 나눠 먹기 좋은 메뉴예요.", rating: 4, author: "정준호", restaurantName: "골목 즉석떡볶이", createdAt: "2026.10.13" },
  { reviewId: "review-015", content: "배달메이트를 구해서 배달비를 아꼈어요.", rating: 4, author: "김사랑", restaurantName: "청춘 치킨", createdAt: "2026.10.13" },
];

function normalizeRestaurant(row: { restaurantId: string; name: string; description: string | null; avgRating: number | null; latitude: number | null; longitude: number | null; category?: string | null; suitableFor?: string | null; _count?: { reviews: number } }): RestaurantCard {
  const fallback = demoRestaurants.find((item) => item.restaurantId === row.restaurantId);
  return { restaurantId: row.restaurantId, name: row.name, description: row.description ?? "학교 주변 인기 맛집", avgRating: row.avgRating ?? fallback?.avgRating ?? 0, reviewCount: row._count?.reviews ?? fallback?.reviewCount ?? 0, latitude: row.latitude ?? fallback?.latitude ?? null, longitude: row.longitude ?? fallback?.longitude ?? null, category: row.category ?? fallback?.category ?? "기타", suitableFor: row.suitableFor?.split(",").map(Number).filter(Boolean) ?? fallback?.suitableFor ?? [1, 2, 4] };
}

export async function getRestaurants(): Promise<RestaurantCard[]> {
  try {
    const rows = await prisma.restaurant.findMany({ include: { _count: { select: { reviews: true } } }, orderBy: { avgRating: "desc" } });
    if (rows.length) return rows.map(normalizeRestaurant);
  } catch { /* fallback */ }
  return demoRestaurants;
}

export async function getRestaurantById(restaurantId: string): Promise<RestaurantCard | null> {
  try {
    const row = await prisma.restaurant.findUnique({ where: { restaurantId }, include: { _count: { select: { reviews: true } } } });
    if (row) return normalizeRestaurant(row);
  } catch { /* fallback */ }
  return demoRestaurants.find((restaurant) => restaurant.restaurantId === restaurantId) ?? null;
}

function normalizeCommunity(row: { postId: string; title: string; currentCount: number; targetCount: number; isClosed: boolean; user: { name: string } }): CommunityCard {
  const fallback = demoCommunities.find((item) => item.postId === row.postId);
  return { postId: row.postId, title: row.title, currentCount: row.currentCount, targetCount: row.targetCount, isClosed: row.isClosed, author: row.user.name, description: fallback?.description ?? "같이 주문하고 밥친구를 찾아요.", category: fallback?.category ?? "기타", createdAt: fallback?.createdAt };
}

export async function getCommunities(): Promise<CommunityCard[]> {
  try {
    const rows = await prisma.community.findMany({ include: { user: true }, orderBy: { postId: "asc" } });
    if (rows.length) return rows.map(normalizeCommunity);
  } catch { /* fallback */ }
  return demoCommunities;
}

export async function getCommunityById(postId: string): Promise<CommunityCard | null> {
  try {
    const row = await prisma.community.findUnique({ where: { postId }, include: { user: true } });
    if (row) return normalizeCommunity(row);
  } catch { /* fallback */ }
  return demoCommunities.find((post) => post.postId === postId) ?? null;
}

export async function getReviews(): Promise<ReviewCard[]> {
  try {
    const rows = await prisma.review.findMany({ include: { user: true, restaurant: true }, orderBy: { createdAt: "desc" }, take: 30 });
    if (rows.length) return rows.map((row) => ({ reviewId: row.reviewId, content: row.content, rating: row.rating, author: row.user.name, restaurantName: row.restaurant.name, createdAt: row.createdAt.toISOString().slice(0, 10) }));
  } catch { /* fallback */ }
  return demoReviews;
}

export async function getReviewsForRestaurant(restaurantId: string, restaurantName: string): Promise<ReviewCard[]> {
  try {
    const rows = await prisma.review.findMany({ where: { restaurantId }, include: { user: true, restaurant: true }, orderBy: { createdAt: "desc" } });
    if (rows.length) return rows.map((row) => ({ reviewId: row.reviewId, content: row.content, rating: row.rating, author: row.user.name, restaurantName: row.restaurant.name, createdAt: row.createdAt.toISOString().slice(0, 10) }));
  } catch { /* fallback */ }
  return demoReviews.filter((review) => review.restaurantName === restaurantName || (restaurantId === "restaurant-001" && review.restaurantName === "학생식당 오늘한끼"));
}
