import MapExplorer from "../../components/MapExplorer";
import { getRestaurants } from "../../lib/appData";

export const dynamic = "force-dynamic";

export default async function MapPage() {
  const restaurants = await getRestaurants();
  return <section className="page map-page"><MapExplorer restaurants={restaurants} /></section>;
}
