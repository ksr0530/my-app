import MapExplorer from "../../components/MapExplorer";
import { getRestaurants } from "../../lib/appData";

export const dynamic = "force-dynamic";

export default async function MapPage() {
  const restaurants = await getRestaurants();
  return <section className="page map-page">
    <div className="page-pad pt-2"><div className="figma-search"><span>⌕</span><span>부천대학교 주변에 뭐가 있을까?</span><span className="ml-auto">☷　⌕</span></div></div>
    <div className="filter-row"><span className="figma-chip active">전체</span><span className="figma-chip">1인</span><span className="figma-chip">2인</span><span className="figma-chip">4인</span><span className="figma-chip">6인</span><span className="figma-chip">단체</span></div>
    <MapExplorer restaurants={restaurants} />
  </section>;
}
