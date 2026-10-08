export default function MapPage() {
  return (
    <section className="min-h-screen bg-slate-50 px-5 pb-24 pt-10">
      <p className="text-sm font-semibold text-orange-500">쩝쩝대</p>
      <h1 className="mt-2 text-3xl font-bold text-slate-900">우리 학교 주변 지도</h1>
      <p className="mt-2 text-slate-500">내 주변의 맛집을 한눈에 찾아보세요.</p>
      <div className="mt-8 flex min-h-[420px] items-center justify-center rounded-3xl border border-dashed border-orange-200 bg-orange-50 text-center">
        <div>
          <div className="text-5xl">📍</div>
          <p className="mt-4 font-semibold text-slate-800">지도가 들어갈 자리예요</p>
          <p className="mt-1 text-sm text-slate-500">다음 미션에서 지도 API를 연결해요.</p>
        </div>
      </div>
    </section>
  );
}
