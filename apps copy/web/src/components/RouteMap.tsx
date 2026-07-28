'use client';

import { useEffect, useRef } from 'react';

export interface RoutePoint {
  lat: number;
  lng: number;
}

export interface CheckPoint {
  lat: number;
  lng: number;
  label: string;
}

interface RouteMapProps {
  points: RoutePoint[];
  checkpoints?: CheckPoint[];
  height?: number;
}

// Percurso mock — será substituído por dados da API
export const MOCK_ROUTE: RoutePoint[] = [
  { lat: -15.8010, lng: -47.9134 },
  { lat: -15.8020, lng: -47.9120 },
  { lat: -15.8035, lng: -47.9105 },
  { lat: -15.8050, lng: -47.9095 },
  { lat: -15.8065, lng: -47.9090 },
  { lat: -15.8080, lng: -47.9095 },
  { lat: -15.8090, lng: -47.9110 },
  { lat: -15.8085, lng: -47.9130 },
  { lat: -15.8070, lng: -47.9145 },
  { lat: -15.8055, lng: -47.9150 },
  { lat: -15.8040, lng: -47.9148 },
  { lat: -15.8025, lng: -47.9142 },
  { lat: -15.8010, lng: -47.9134 },
];

export const MOCK_CHECKPOINTS: CheckPoint[] = [
  { lat: -15.8010, lng: -47.9134, label: '🏁 Largada / Meta' },
  { lat: -15.8065, lng: -47.9090, label: '👮 Fiscalização km 2,5' },
  { lat: -15.8085, lng: -47.9130, label: '💧 Hidratação km 3,5' },
];

export function RouteMap({ points, checkpoints = [], height = 380 }: RouteMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Carrega Leaflet dinamicamente (SSR safe)
    import('leaflet').then(L => {
      // Fix ícones padrão do Leaflet no Next.js
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });

      const center = points[0] ?? { lat: -15.8010, lng: -47.9134 };
      const map = L.map(mapRef.current!).setView([center.lat, center.lng], 15);
      mapInstanceRef.current = map;

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap',
        maxZoom: 19,
      }).addTo(map);

      // Polilinha do percurso
      if (points.length >= 2) {
        const latlngs = points.map(p => [p.lat, p.lng] as [number, number]);
        L.polyline(latlngs, { color: '#1E40AF', weight: 5, opacity: 0.85 }).addTo(map);
        map.fitBounds(L.polyline(latlngs).getBounds(), { padding: [30, 30] });
      }

      // Marcador início (verde)
      if (points.length > 0) {
        L.circleMarker([points[0].lat, points[0].lng], {
          radius: 10, fillColor: '#10B981', color: '#fff', weight: 2, fillOpacity: 1,
        }).addTo(map).bindPopup('🟢 Início');
      }

      // Marcador fim (vermelho)
      if (points.length > 1) {
        const last = points[points.length - 1];
        L.circleMarker([last.lat, last.lng], {
          radius: 10, fillColor: '#EF4444', color: '#fff', weight: 2, fillOpacity: 1,
        }).addTo(map).bindPopup('🔴 Chegada');
      }

      // Checkpoints
      checkpoints.forEach(cp => {
        L.marker([cp.lat, cp.lng], {
          icon: L.divIcon({
            html: `<div style="background:#F59E0B;color:white;border-radius:50%;width:28px;height:28px;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:bold;border:2px solid white;box-shadow:0 2px 4px rgba(0,0,0,0.3)">📍</div>`,
            className: '',
            iconSize: [28, 28],
            iconAnchor: [14, 14],
          }),
        }).addTo(map).bindPopup(cp.label);
      });
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [points, checkpoints]);

  return (
    <div
      ref={mapRef}
      style={{ height, width: '100%', borderRadius: '16px', overflow: 'hidden' }}
      className="z-0"
    />
  );
}
