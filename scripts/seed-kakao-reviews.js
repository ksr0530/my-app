const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const users = [
  ["user-jieun", "한지은", "jieun@jjupjjupdae.test"],
  ["user-dohyun", "김도현", "dohyun@jjupjjupdae.test"],
  ["user-yuna", "오유나", "yuna@jjupjjupdae.test"],
  ["user-geonu", "이건우", "geonu@jjupjjupdae.test"],
  ["user-nari", "박나리", "nari@jjupjjupdae.test"],
  ["user-seungmin", "최승민", "seungmin@jjupjjupdae.test"],
  ["user-harin", "윤하린", "harin@jjupjjupdae.test"],
  ["user-taeyang", "강태양", "taeyang@jjupjjupdae.test"],
];
const templates = [
  ["학생들이 먹기 좋고 가격 대비 양이 괜찮아요.", 4],
  ["혼자 방문하기 편하고 주문이 빨라서 수업 사이에 먹기 좋았어요.", 4],
  ["메뉴가 다양하고 음식이 따뜻하게 나와서 만족했습니다.", 5],
  ["친구들과 함께 방문하기 좋고 전체적으로 맛있었어요.", 5],
];

async function main() {
  for (const [id, name, email] of users) {
    await prisma.user.upsert({ where: { id }, update: { name, email, isStudentVerified: true }, create: { id, name, email, password: "demo1234", university: "부천대학교", isStudentVerified: true } });
  }
  const restaurants = await prisma.restaurant.findMany({ where: { kakaoPlaceId: { not: null } }, orderBy: { name: "asc" }, take: 4 });
  let added = 0;
  for (const restaurant of restaurants) {
    const existing = await prisma.review.count({ where: { restaurantId: restaurant.restaurantId, deletedAt: null } });
    if (existing >= 4) continue;
    for (let index = existing; index < 4; index += 1) {
      const [content, rating] = templates[index % templates.length];
      await prisma.review.upsert({ where: { reviewId: `kakao-review-${restaurant.restaurantId}-${index + 1}` }, update: {}, create: { reviewId: `kakao-review-${restaurant.restaurantId}-${index + 1}`, userId: users[index % users.length][0], restaurantId: restaurant.restaurantId, content, rating } });
      added += 1;
    }
    const aggregate = await prisma.review.aggregate({ where: { restaurantId: restaurant.restaurantId, deletedAt: null }, _avg: { rating: true } });
    await prisma.restaurant.update({ where: { restaurantId: restaurant.restaurantId }, data: { avgRating: aggregate._avg.rating ?? 0 } });
  }
  console.log(`${restaurants.length}개 카카오 식당에 리뷰 ${added}개를 추가했습니다.`);
}

main().catch((error) => { console.error("카카오 리뷰 추가 실패:", error); process.exitCode = 1; }).finally(() => prisma.$disconnect());
