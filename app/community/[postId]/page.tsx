import { notFound } from "next/navigation";
import CommunityDetail from "../../../components/CommunityDetail";
import { getCommunities } from "../../../lib/appData";

export default async function CommunityPostPage({ params }: { params: Promise<{ postId: string }> }) {
  const { postId } = await params;
  const posts = await getCommunities();
  const post = posts.find((item) => item.postId === postId);
  if (!post) notFound();
  return <CommunityDetail post={post} />;
}
