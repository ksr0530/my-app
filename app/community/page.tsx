import CommunityBoard from "../../components/CommunityBoard";
import { getCommunities } from "../../lib/appData";

export default async function CommunityPage() {
  const posts = await getCommunities();

  return (
    <section className="min-h-screen bg-[#FEEA9C] px-5 pb-28 pt-8 text-[#1A344F]">
      <header>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold tracking-[-0.04em] text-[#1A344F]/70">우리 학교 밥친구 커뮤니티</p>
            <h1 className="mt-1 text-[25px] font-black tracking-[-0.08em]">쩝쩝대</h1>
          </div>
          <button type="button" aria-label="알림" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/70 text-[18px]">♧</button>
        </div>

        <div className="mt-5 flex h-10 items-center gap-2 rounded-[7px] border border-[#1A344F]/15 bg-white/75 px-3">
          <span className="text-[20px] leading-none text-[#1A344F]/70">⌕</span>
          <input aria-label="커뮤니티 검색" className="w-full border-0 bg-transparent p-0 text-[12px] outline-none placeholder:text-[#1A344F]/45" placeholder="커뮤니티 글을 검색해보세요" />
        </div>
      </header>

      <div className="mt-5 flex items-center justify-between">
        <h2 className="text-[20px] font-black tracking-[-0.07em]">커뮤니티</h2>
        <span className="text-[11px] font-bold text-[#1A344F]/55">최신순 ˅</span>
      </div>

      <CommunityBoard initialPosts={posts} />
    </section>
  );
}
