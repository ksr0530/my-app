import RestaurantExplorer from "../../components/RestaurantExplorer";
import { getRestaurants } from "../../lib/appData";

export const dynamic = "force-dynamic";

export default async function MapPage() {
  const restaurants = await getRestaurants();
  return <section className="page"><header><p className="kicker">쩝쩝대 MAP</p><h1 className="section-title mt-1 text-3xl">학교 주변 맛집</h1><p className="mt-2 text-xs text-[#7a8490]">내 주변의 맛집을 한눈에 찾아보세요.</p></header><RestaurantExplorer restaurants={restaurants} /></section>;
}
