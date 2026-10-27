import CommunityPostLookup from "../../../components/CommunityPostLookup";
import { getCommunityById } from "../../../lib/appData";

export const dynamic = "force-dynamic";

export default async function CommunityPostPage({ params }: { params: Promise<{ postId: string }> }) {
  const { postId } = await params;
  const post = await getCommunityById(postId);
  return <CommunityPostLookup serverPost={post} />;
}
