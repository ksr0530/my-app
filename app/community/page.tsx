import BrandHeader from "../../components/BrandHeader";
import CommunityBoard from "../../components/CommunityBoard";
import { getCommunities } from "../../lib/appData";

export default async function CommunityPage() {
  const posts = await getCommunities();

  return (
    <section className="min-h-screen bg-[#FEEA9C] px-5 pb-28 pt-8 text-[#1A344F]">
      <header className="flex items-center justify-between">
        <BrandHeader compact />
      </header>
      <CommunityBoard initialPosts={posts} />
    </section>
  );
}
