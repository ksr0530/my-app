import Link from "next/link";
import { notFound } from "next/navigation";
import { getCommunityById } from "../../../lib/appData";

export const dynamic = "force-dynamic";

export default async function CommunityPostPage({ params }: { params: Promise<{ postId: string }> }) {
  const { postId } = await params;
  const post = await getCommunityById(postId);
  if (!post) notFound();
  const closed = post.isClosed || post.currentCount >= post.targetCount;
  return <section className="page community-detail-page"><header className="community-detail-header"><Link href="/community" className="back-button">‹</Link><div><p>커뮤니티 글</p><h1>밥친구 모집</h1></div></header><main className="community-detail-card"><div className="community-detail-icon">🍱</div><p className="community-detail-kicker">{closed ? "모집완료" : "모집중"}</p><h2>{post.title}</h2><p className="community-detail-author">{post.author} · 방금 전</p><div className="community-detail-info">현재 참여 인원 <strong>{post.currentCount}명</strong><br />모집 인원 <strong>{post.targetCount}명</strong><br /><span>같이 주문하고 밥친구를 찾아요.</span></div><button type="button" className="community-detail-join" disabled={closed}>{closed ? "모집이 마감됐어요" : "밥친구 참여하기"}</button></main></section>;
}
