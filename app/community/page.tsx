<<<<<<< HEAD
import Link from "next/link";
import { getCommunities } from "../../lib/appData";
=======
import CommunityBoard from "../../components/CommunityBoard";
import { getCommunities } from "../../lib/appData";

>>>>>>> 5bc0bf9418aad098dfa780dbc4589d6a21e72db0
export const dynamic = "force-dynamic";

export default async function CommunityPage() {
  const posts = await getCommunities();
<<<<<<< HEAD
  return <section className="page"><div className="page-pad pt-2"><div className="figma-search"><span>⌕</span><span>커뮤니티 글을 검색해보세요</span><span className="ml-auto">☷　⌕</span></div></div><div className="filter-row"><span className="figma-chip active">전체</span><span className="figma-chip">밥친구</span><span className="figma-chip">맛집</span><span className="figma-chip">질문</span><span className="figma-chip">후기</span></div><div className="bg-white">{posts.map((post) => <Link href="/community" key={post.postId} className="flex min-h-[84px] items-center justify-between border-b border-[#ddd] px-5 py-4"><div><h2 className="text-sm font-bold">{post.title}</h2><p className="mt-2 text-[11px] text-[#777]">글 내용 작성</p></div><span className="text-xs">♙ {post.currentCount}/{post.targetCount}</span></Link>)}</div><Link href="/community" className="fixed bottom-24 right-6 flex h-14 w-14 items-center justify-center rounded-full bg-[#d0d1d1] text-3xl text-[#697174] shadow">＋</Link></section>;
=======
  return <section className="page"><header className="flex items-end justify-between"><div><p className="kicker">쩝쩝대 COMMUNITY</p><h1 className="section-title mt-1 text-3xl">배달메이트 찾기</h1></div><button className="navy-button">+ 글쓰기</button></header><p className="mt-3 text-xs text-[#7a8490]">같이 주문하고 배달비를 나눠보세요.</p><CommunityBoard initialPosts={posts} /></section>;
>>>>>>> 5bc0bf9418aad098dfa780dbc4589d6a21e72db0
}
