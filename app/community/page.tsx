import CommunityBoard from "../../components/CommunityBoard";
import { getCommunities } from "../../lib/appData";

export const dynamic = "force-dynamic";

export default async function CommunityPage() {
  const posts = await getCommunities();
  return <section className="page"><header className="flex items-end justify-between"><div><p className="kicker">쩝쩝대 COMMUNITY</p><h1 className="section-title mt-1 text-3xl">배달메이트 찾기</h1></div><button className="navy-button">+ 글쓰기</button></header><p className="mt-3 text-xs text-[#7a8490]">같이 주문하고 배달비를 나눠보세요.</p><CommunityBoard initialPosts={posts} /></section>;
}
