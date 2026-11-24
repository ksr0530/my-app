import Link from "next/link";
import BrandHeader from "../../components/BrandHeader";
import { getCommunities } from "../../lib/appData";
import HomeDiscovery from "../../components/HomeDiscovery";
export const dynamic = "force-dynamic";

export default async function Home() {
  const communities = await getCommunities();
  return <section className="page home-page">
    <div className="mb-4"><BrandHeader /></div>
    <div className="page-pad pt-2"><HomeDiscovery /></div>
    <div className="home-section community-section"><div className="home-section-heading"><h2 className="section-title">같이 먹어요!</h2><Link href="/community" className="text-xs text-[#979797]">더보기 ›</Link></div><div className="community-preview-list">{communities.slice(0, 3).map((post) => <Link href={`/community/${post.postId}`} key={post.postId} className="community-preview-row"><div><p className="text-sm font-semibold">{post.title}</p><p className="mt-1 text-[10px] text-[#888]">{post.author} · 글 내용 보기</p></div><span className="text-xs">♙ {post.currentCount}/{post.targetCount}</span></Link>)}</div></div>
  </section>;
}
