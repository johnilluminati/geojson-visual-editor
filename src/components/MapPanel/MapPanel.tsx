import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

const EMPTY_GEOJSON: GeoJSON.FeatureCollection = {
  type: 'FeatureCollection',
  features: [],
};

export interface MapPanelProps {
  /** GeoJSON to display. Omitted or null shows base map only. */
  geojson?: GeoJSON.FeatureCollection | null;
}

export default function MapPanel({ geojson = null }: MapPanelProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const data = geojson ?? EMPTY_GEOJSON;

    let cancelled = false;
    let map: maplibregl.Map | null = null;

    const initMap = () => {
      if (cancelled || !containerRef.current) return;
      const el = containerRef.current;
      if (el.offsetWidth === 0 || el.offsetHeight === 0) return;

      map = new maplibregl.Map({
        container: el,
        style: {
          version: 8,
          sources: {
            osm: {
              type: 'raster',
              tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
              tileSize: 256,
              attribution: '© OpenStreetMap contributors',
            },
            geojson: {
              type: 'geojson',
              data,
              generateId: true,
            },
          },
          layers: [
            {
              id: 'osm',
              type: 'raster',
              source: 'osm',
              minzoom: 0,
              maxzoom: 19,
            },
            {
              id: 'geojson-fills',
              type: 'fill',
              source: 'geojson',
              filter: ['in', ['geometry-type'], ['literal', ['Polygon', 'MultiPolygon']]],
              paint: {
                'fill-color': '#627BC1',
                'fill-opacity': 0.4,
              },
            },
            {
              id: 'geojson-lines',
              type: 'line',
              source: 'geojson',
              filter: ['in', ['geometry-type'], ['literal', ['LineString', 'MultiLineString', 'Polygon', 'MultiPolygon']]],
              paint: {
                'line-color': '#627BC1',
                'line-width': 1.5,
              },
            },
            {
              id: 'geojson-points',
              type: 'circle',
              source: 'geojson',
              filter: ['in', ['geometry-type'], ['literal', ['Point', 'MultiPoint']]],
              paint: {
                'circle-radius': 6,
                'circle-color': '#627BC1',
                'circle-stroke-width': 1.5,
                'circle-stroke-color': '#fff',
              },
            },
          ],
        },
        center: [0, 20],
        zoom: 2,
      });

      map.addControl(new maplibregl.NavigationControl(), 'top-right');
      mapRef.current = map;
    };

    // Defer until container has non-zero dimensions (avoids WebGL context loss)
    const rafId = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (cancelled) return;
        initMap();
      });
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafId);
      const m = mapRef.current;
      if (m) {
        m.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Update GeoJSON data when prop changes (after initial mount)
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const source = map.getSource('geojson') as maplibregl.GeoJSONSource | undefined;
    if (!source) return;

    source.setData(geojson ?? EMPTY_GEOJSON);
  }, [geojson]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full"
      style={{ minHeight: 385 }}
    />
  );
}
