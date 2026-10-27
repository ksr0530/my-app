"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import KakaoMap from "./KakaoMap";
import type { RestaurantCard } from "../lib/appData";

const categories = ["전체", "분식", "한식", "일식", "중식", "기타"];

export default function MapExplorer({ restaurants }: { restaurants: RestaurantCard[] }) {
  const [category, setCategory] = useState("전체");
  const filtered = useMemo(() => category === "전체" ? restaurants : restaurants.filter((restaurant) => restaurant.category === category), [category, restaurants]);
  return <>
    <div className="map-category-row">{categories.map((item) => <button key={item} type="button" onClick={() => setCategory(item)} className={`map-category-chip ${category === item ? "active" : ""}`}>{item}</button>)}</div>
    <div className="restaurant-map-list">{filtered.length ? filtered.map((restaurant) => <Link href={`/restaurant/${restaurant.restaurantId}`} key={restaurant.restaurantId} className="map-restaurant-row"><div><h2>{restaurant.name}</h2><p>{restaurant.description}</p></div><span>★ {restaurant.avgRating.toFixed(1)}({restaurant.reviewCount})</span></Link>) : <p className="map-empty">해당 카테고리의 식당이 아직 없어요.</p>}</div>
    <div className="map-surface-wrap"><KakaoMap restaurants={filtered} /></div>
  </>;
}
