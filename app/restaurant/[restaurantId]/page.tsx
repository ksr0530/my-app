import { notFound } from "next/navigation";
import RestaurantDetail from "../../../components/RestaurantDetail";
import { getRestaurantById, getReviewsForRestaurant } from "../../../lib/appData";

export const dynamic = "force-dynamic";

export default async function RestaurantPage({ params }: { params: Promise<{ restaurantId: string }> }) {
  const { restaurantId } = await params;
  const restaurant = await getRestaurantById(restaurantId);
  if (!restaurant) notFound();
  const reviews = await getReviewsForRestaurant(restaurant.restaurantId, restaurant.name);
  return <RestaurantDetail restaurant={restaurant} reviews={reviews} />;
}
