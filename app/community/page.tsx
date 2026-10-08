import StarRating from "../../components/StarRating";

export default function CommunityPage() {
  return (
    <section className="min-h-screen bg-slate-50 px-5 pb-24 pt-10">
      <p className="text-sm font-semibold text-orange-500">쩝쩝대 커뮤니티</p>
      <div className="mt-2 flex items-end justify-between gap-4">
        <h1 className="text-3xl font-bold text-slate-900">밥친구들의 이야기</h1>
        <button className="rounded-full bg-orange-500 px-4 py-2 text-sm font-semibold text-white">글쓰기</button>
      </div>
      <div className="mt-8 space-y-3">
        {["오늘 점심 같이 먹을 사람!", "학교 근처 가성비 맛집 추천해주세요", "이번 주 신메뉴 먹어봤어요"].map((title, index) => (
          <article key={title} className="rounded-2xl bg-white p-4 shadow-sm">
            <p className="font-semibold text-slate-800">{title}</p>
            <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
              <span>익명의 쩝쩝러 · {index + 1}시간 전</span>
              {index === 1 && <StarRating value={4} readOnly size="sm" />}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
