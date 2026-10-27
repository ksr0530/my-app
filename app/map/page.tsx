import Link from "next/link";
import KakaoMap from "../../components/KakaoMap";
import { getRestaurants } from "../../lib/appData";

export const dynamic = "force-dynamic";

export default async function MapPage() {
  const restaurants = await getRestaurants();
  return <section className="page map-page">
    <div className="page-pad pt-2"><div className="figma-search"><span>⌕</span><span>부천대학교 주변에 뭐가 있을까?</span><span className="ml-auto">☷　⌕</span></div></div>
    <div className="filter-row"><span className="figma-chip active">전체</span><span className="figma-chip">1인</span><span className="figma-chip">2인</span><span className="figma-chip">4인</span><span className="figma-chip">6인</span><span className="figma-chip">단체</span></div>
    <div className="filter-row border-b border-[#e1e1d9] pt-0"><span className="figma-chip active">전체</span><span className="figma-chip">분식</span><span className="figma-chip">한식</span><span className="figma-chip">일식</span><span className="figma-chip">중식</span><span className="figma-chip">기타</span></div>
    <div className="restaurant-map-list">{restaurants.slice(0, 4).map((restaurant) => <Link href={`/restaurant/${restaurant.restaurantId}`} key={restaurant.restaurantId} className="map-restaurant-row"><div><h2>{restaurant.name}</h2><p>{restaurant.description}</p></div><span>★ {restaurant.avgRating.toFixed(1)}</span></Link>)}</div>
    <div className="map-surface-wrap"><KakaoMap restaurants={restaurants} /></div>
  </section>;
}
