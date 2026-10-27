import MapExplorer from "../../components/MapExplorer";
import { getRestaurants } from "../../lib/appData";

export const dynamic = "force-dynamic";

export default async function MapPage() {
  const restaurants = await getRestaurants();
  return <section className="page map-page"><div className="page-pad pt-2"><div className="figma-search"><span>⌕</span><span>부천대학교 주변에 뭐가 있을까?</span><span className="ml-auto">☷　⌕</span></div></div><MapExplorer restaurants={restaurants} /></section>;
}
