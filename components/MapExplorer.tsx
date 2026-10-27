"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import KakaoMap from "./KakaoMap";
import type { RestaurantCard } from "../lib/appData";

const foodCategories = ["한식", "분식", "일식", "중식", "기타"];
const peopleFilters = [1, 2, 4, 6];

export default function MapExplorer({ restaurants }: { restaurants: RestaurantCard[] }) {
  const [food, setFood] = useState<string | null>(null);
  const [people, setPeople] = useState<number | null>(null);
  const [showAll, setShowAll] = useState(false);
  const hasFilter = Boolean(food || people);
  const filtered = useMemo(() => restaurants.filter((restaurant) => (!food || restaurant.category === food) && (!people || restaurant.suitableFor.includes(people))), [food, people, restaurants]);
  const visible = showAll ? filtered : filtered.slice(0, 3);

  function chooseFood(value: string) { setFood((current) => current === value ? null : value); setShowAll(false); }
  function choosePeople(value: number) { setPeople((current) => current === value ? null : value); setShowAll(false); }

  return <>
    <div className="map-filter-panel"><p className="kicker">원하는 조건을 선택하면 지도와 식당이 나타나요.</p><div className="map-filter-title">음식 종류</div><div className="map-filter-chips">{foodCategories.map((item) => <button key={item} type="button" onClick={() => chooseFood(item)} className={`figma-chip ${food === item ? "active" : ""}`}>{item}</button>)}</div><div className="map-filter-title">인원수</div><div className="map-filter-chips">{peopleFilters.map((item) => <button key={item} type="button" onClick={() => choosePeople(item)} className={`figma-chip ${people === item ? "active" : ""}`}>{item}인</button>)}</div></div>
    {!hasFilter ? <div className="map-filter-empty">음식 종류나 인원수를 선택해보세요.<br /><span>선택한 조건에 맞는 식당과 지도가 표시돼요.</span></div> : <div className="map-results"><div className="map-results-header"><strong>조건에 맞는 식당</strong><span>{filtered.length}곳</span></div><div className="restaurant-map-list">{visible.length ? visible.map((restaurant) => <Link href={`/restaurant/${restaurant.restaurantId}`} key={restaurant.restaurantId} className="map-restaurant-row"><div><h2>{restaurant.name}</h2><p>{restaurant.description}</p><small>{restaurant.suitableFor.join("·")}인 방문 추천</small></div><span>★ {restaurant.avgRating.toFixed(1)}({restaurant.reviewCount})</span></Link>) : <p className="map-empty">선택한 조건에 맞는 식당이 아직 없어요.</p>}{filtered.length > 3 && <button type="button" onClick={() => setShowAll((value) => !value)} className="map-more-button">{showAll ? "목록 접기 ▲" : `식당 ${filtered.length - 3}개 더보기 ▼`}</button>}</div><div className="map-surface-wrap"><KakaoMap restaurants={filtered} /></div></div>}
  </>;
}
