import StarRating from "../../components/StarRating";

export default function MyPage() {
  return (
    <section className="min-h-screen bg-slate-50 px-5 pb-24 pt-10">
      <p className="text-sm font-semibold text-orange-500">쩝쩝대</p>
      <h1 className="mt-2 text-3xl font-bold text-slate-900">마이페이지</h1>
      <div className="mt-8 rounded-3xl bg-white p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 text-3xl">🙂</div>
          <div>
            <p className="font-bold text-slate-900">쩝쩝러님</p>
            <p className="mt-1 text-sm text-slate-500">재학생 인증을 완료해 주세요</p>
          </div>
        </div>
        <button className="mt-6 w-full rounded-xl bg-orange-500 py-3 font-semibold text-white">재학생 인증하기</button>
      </div>
      <div className="mt-4 rounded-3xl bg-white p-6 shadow-sm">
        <h2 className="font-bold text-slate-900">내 리뷰</h2>
        <div className="mt-4 flex items-center justify-between border-b border-slate-100 pb-4">
          <div><p className="font-semibold text-slate-800">학교 앞 김치찌개</p><p className="mt-1 text-sm text-slate-400">맛있고 든든해요</p></div>
          <StarRating value={5} readOnly size="sm" />
        </div>
        <p className="pt-4 text-center text-sm text-slate-400">작성한 리뷰를 모아볼 수 있어요.</p>
      </div>
    </section>
  );
}
