import { notFound } from "next/navigation";
import ReviewComposer from "../../../../components/ReviewComposer";
import { getRestaurantById } from "../../../../lib/appData";

export const dynamic = "force-dynamic";

export default async function ReviewPage({ params }: { params: Promise<{ restaurantId: string }> }) {
  const { restaurantId } = await params;
  const restaurant = await getRestaurantById(restaurantId);
  if (!restaurant) notFound();
  return <ReviewComposer restaurant={restaurant} />;
}
