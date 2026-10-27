"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";
import type { RestaurantCard } from "../lib/appData";

declare global {
  interface Window {
    kakao?: {
      maps: {
        load: (callback: () => void) => void;
        Map: new (container: HTMLElement, options: { center: unknown; level: number }) => KakaoMapInstance;
        LatLng: new (latitude: number, longitude: number) => unknown;
        Marker: new (options: { map?: KakaoMapInstance; position: unknown; title?: string }) => { setMap: (map: KakaoMapInstance | null) => void };
        InfoWindow: new (options: { content: string; removable?: boolean }) => { open: (map: KakaoMapInstance, marker: unknown) => void; close: () => void };
        event: { addListener: (target: unknown, type: string, callback: () => void) => void };
        services: { Places: new () => { keywordSearch: (keyword: string, callback: (data: Array<{ y: string; x: string }>, status: string) => void) => void } };
        Status: { OK: string };
      };
    };
  }
}

type KakaoMapInstance = {
  setCenter: (center: unknown) => void;
  setLevel: (level: number) => void;
};

export default function KakaoMap({ restaurants }: { restaurants: RestaurantCard[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<KakaoMapInstance | null>(null);
  const [scriptReady, setScriptReady] = useState(false);
  const apiKey = process.env.NEXT_PUBLIC_KAKAO_MAP_KEY;

  useEffect(() => {
    if (!scriptReady || !containerRef.current || !window.kakao?.maps || !apiKey) return;
    window.kakao.maps.load(() => {
      if (!containerRef.current || !window.kakao?.maps) return;
      const maps = window.kakao.maps;
      const fallbackCenter = new maps.LatLng(37.4886, 126.7830);
      const map = new maps.Map(containerRef.current, { center: fallbackCenter, level: 4 });
      mapRef.current = map;
      const places = new maps.services.Places();

      const placeMarkers: Array<{ marker: { setMap: (map: KakaoMapInstance | null) => void }; info: { open: (map: KakaoMapInstance, marker: unknown) => void; close: () => void } }> = [];
      places.keywordSearch("부천대학교", (data, status) => {
        if (status === maps.Status.OK && data[0]) {
          map.setCenter(new maps.LatLng(Number(data[0].y), Number(data[0].x)));
        }
      });

      restaurants.forEach((restaurant) => {
        if (restaurant.latitude == null || restaurant.longitude == null) return;
        const marker = new maps.Marker({ map, position: new maps.LatLng(restaurant.latitude, restaurant.longitude), title: restaurant.name });
        const info = new maps.InfoWindow({ content: `<div style="padding:8px 12px;font-size:12px;color:#1A344F;white-space:nowrap;">${restaurant.name}<br/><span style="color:#777;">★ ${restaurant.avgRating.toFixed(1)}</span></div>`, removable: true });
        placeMarkers.push({ marker, info });
      });
      placeMarkers.forEach(({ marker, info }) => {
        maps.event.addListener(marker, "click", () => info.open(map, marker));
      });
    });
  }, [apiKey, restaurants, scriptReady]);

  if (!apiKey) {
    return <div className="map-api-placeholder"><strong>지도 API 키가 아직 연결되지 않았어요.</strong><span>프로젝트 루트의 .env.local에 NEXT_PUBLIC_KAKAO_MAP_KEY를 추가하면 부천대학교 주변 지도가 표시됩니다.</span></div>;
  }

  return <>
    <Script src={`https://dapi.kakao.com/v2/maps/sdk.js?appkey=${apiKey}&autoload=false&libraries=services`} strategy="afterInteractive" onLoad={() => setScriptReady(true)} />
    <div ref={containerRef} className="kakao-map" aria-label="부천대학교 주변 식당 지도" />
  </>;
}
