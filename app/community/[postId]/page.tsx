import { notFound } from "next/navigation";
import CommunityDetail from "../../../components/CommunityDetail";
import { getCommunityById } from "../../../lib/appData";

export const dynamic = "force-dynamic";

export default async function CommunityPostPage({ params }: { params: Promise<{ postId: string }> }) {
  const { postId } = await params;
  const post = await getCommunityById(postId);
  if (!post) notFound();
  return <CommunityDetail post={post} />;
}
