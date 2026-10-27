/* eslint-disable @typescript-eslint/no-require-imports */
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const users = [
  {
    id: "user-sarang",
    name: "김사랑",
    email: "sarang@jjupjjupdae.test",
    password: "demo1234",
    university: "우리대학교",
    isStudentVerified: true,
  },
  {
    id: "user-hyemin",
    name: "이혜민",
    email: "hyemin@jjupjjupdae.test",
    password: "demo1234",
    university: "우리대학교",
    isStudentVerified: true,
  },
  {
    id: "user-minjun",
    name: "박민준",
    email: "minjun@jjupjjupdae.test",
    password: "demo1234",
    university: "우리대학교",
    isStudentVerified: true,
  },
  {
    id: "user-seoyeon",
    name: "최서연",
    email: "seoyeon@jjupjjupdae.test",
    password: "demo1234",
    university: "우리대학교",
    isStudentVerified: false,
  },
  {
    id: "user-junho",
    name: "정준호",
    email: "junho@jjupjjupdae.test",
    password: "demo1234",
    university: "우리대학교",
    isStudentVerified: true,
  },
];

const restaurants = [
  { restaurantId: "restaurant-001", name: "학생식당 오늘한끼", description: "든든하고 저렴한 학교 앞 한식 백반집", latitude: 37.12345, longitude: 127.12345, avgRating: 4.5 },
  { restaurantId: "restaurant-002", name: "캠퍼스 김밥", description: "혼밥하기 좋은 분식과 김밥 전문점", latitude: 37.1241, longitude: 127.1242, avgRating: 4.0 },
  { restaurantId: "restaurant-003", name: "골목 즉석떡볶이", description: "매콤한 떡볶이와 튀김을 함께 즐기는 곳", latitude: 37.1228, longitude: 127.1225, avgRating: 4.5 },
  { restaurantId: "restaurant-004", name: "소담 국수집", description: "잔치국수와 비빔국수가 인기인 작은 식당", latitude: 37.1252, longitude: 127.1219, avgRating: 4.0 },
  { restaurantId: "restaurant-005", name: "마루 덮밥", description: "빠르게 먹기 좋은 제육·연어 덮밥 전문점", latitude: 37.126, longitude: 127.1251, avgRating: 4.5 },
  { restaurantId: "restaurant-006", name: "우리동네 카페", description: "수업 전후 쉬어가기 좋은 조용한 카페", latitude: 37.1218, longitude: 127.1263, avgRating: 4.0 },
  { restaurantId: "restaurant-007", name: "청춘 치킨", description: "배달메이트와 함께 주문하기 좋은 치킨집", latitude: 37.1271, longitude: 127.1237, avgRating: 4.5 },
  { restaurantId: "restaurant-008", name: "정든 부대찌개", description: "여럿이 방문하기 좋은 얼큰한 부대찌개", latitude: 37.1209, longitude: 127.1222, avgRating: 4.0 },
  { restaurantId: "restaurant-009", name: "한입 샐러드", description: "가볍고 건강한 점심을 위한 샐러드 가게", latitude: 37.1247, longitude: 127.127, avgRating: 5.0 },
  { restaurantId: "restaurant-010", name: "학생회관 석식당", description: "수업 후 든든하게 먹기 좋은 교내 석식 식당", latitude: 37.1232, longitude: 127.1281, avgRating: 4.0 },
];

const reviews = [
  ["review-001", "user-sarang", "restaurant-001", "가격도 착하고 반찬이 깔끔해서 자주 가요.", 5, "2026-10-05"],
  ["review-002", "user-hyemin", "restaurant-001", "점심시간에는 사람이 많지만 회전이 빨라요.", 4, "2026-10-06"],
  ["review-003", "user-minjun", "restaurant-002", "김밥이 든든하고 혼자 먹기 편합니다.", 4, "2026-10-07"],
  ["review-004", "user-seoyeon", "restaurant-002", "참치김밥이 맛있어요. 포장도 빨라요.", 4, "2026-10-08"],
  ["review-005", "user-junho", "restaurant-003", "맵기는 하지만 튀김과 같이 먹으면 딱 좋아요.", 5, "2026-10-08"],
  ["review-006", "user-sarang", "restaurant-004", "국물이 깔끔하고 양이 넉넉합니다.", 4, "2026-10-09"],
  ["review-007", "user-hyemin", "restaurant-005", "제육덮밥 양이 많아서 든든하게 먹었어요.", 5, "2026-10-09"],
  ["review-008", "user-minjun", "restaurant-005", "키오스크 주문이라 점심에도 편합니다.", 4, "2026-10-10"],
  ["review-009", "user-seoyeon", "restaurant-006", "콘센트가 많고 조용해서 공부하기 좋아요.", 4, "2026-10-10"],
  ["review-010", "user-junho", "restaurant-007", "치킨이 바삭하고 배달이 빨랐어요.", 5, "2026-10-11"],
  ["review-011", "user-sarang", "restaurant-008", "여럿이 먹기 좋고 사리가 다양해요.", 4, "2026-10-11"],
  ["review-012", "user-hyemin", "restaurant-009", "신선하고 소스 선택지가 많아서 좋습니다.", 5, "2026-10-12"],
  ["review-013", "user-minjun", "restaurant-010", "수업 끝나고 먹기 좋은 든든한 석식 메뉴예요.", 4, "2026-10-12"],
  ["review-014", "user-junho", "restaurant-003", "친구들과 나눠 먹기 좋은 메뉴예요.", 4, "2026-10-13"],
  ["review-015", "user-sarang", "restaurant-007", "배달메이트를 구해서 배달비를 아꼈어요.", 4, "2026-10-13"],
];

const communities = [
  ["post-001", "user-sarang", "오늘 점심 청춘 치킨 같이 시켜요!", 4, 2, false],
  ["post-002", "user-hyemin", "마루 덮밥 배달메이트 구합니다", 3, 1, false],
  ["post-003", "user-minjun", "오늘 저녁 정든 부대찌개 드실 분", 5, 3, false],
  ["post-004", "user-seoyeon", "최소주문금액 맞춰서 같이 주문해요", 4, 4, true],
  ["post-005", "user-junho", "오늘 저녁 학생회관 석식 같이 먹을 사람", 4, 2, false],
];

async function main() {
  for (const user of users) await prisma.user.upsert({ where: { id: user.id }, update: user, create: user });
  for (const restaurant of restaurants) await prisma.restaurant.upsert({ where: { restaurantId: restaurant.restaurantId }, update: restaurant, create: restaurant });
  for (const [reviewId, userId, restaurantId, content, rating, createdAt] of reviews) await prisma.review.upsert({ where: { reviewId }, update: { userId, restaurantId, content, rating, createdAt: new Date(createdAt) }, create: { reviewId, userId, restaurantId, content, rating, createdAt: new Date(createdAt) } });
  for (const [postId, userId, title, targetCount, currentCount, isClosed] of communities) await prisma.community.upsert({ where: { postId }, update: { userId, title, targetCount, currentCount, isClosed }, create: { postId, userId, title, targetCount, currentCount, isClosed } });
  console.log(`Seed completed: ${users.length} users, ${restaurants.length} restaurants, ${reviews.length} reviews, ${communities.length} community posts`);
}

main().catch((error) => { console.error("Seed failed:", error); process.exitCode = 1; }).finally(async () => { await prisma.$disconnect(); });
