import React, { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Globe, RefreshCw } from 'lucide-react';

interface MapContainerProps {
  pickup: string;
  dropoff: string;
}

export default function MapContainer({ pickup, dropoff }: MapContainerProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<maplibregl.Map | null>(null);
  const markers = useRef<maplibregl.Marker[]>([]);

  // Simulated coordinate dictionary based on route locations
  const coordinates: { [key: string]: [number, number] } = {
    'Central Business District': [77.5946, 12.9716],
    'International Tech Park': [77.7347, 12.9868],
    'Residential Suburb Sect-D': [77.6784, 12.9304],
    'Software Technology Park': [77.7011, 12.9568]
  };

  useEffect(() => {
    if (!mapContainer.current || mapInstance.current) return;

    // Initialize MapLibre GL Map
    mapInstance.current = new maplibregl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        sources: {
          'carto-dark': {
            type: 'raster',
            tiles: [
              'https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png',
              'https://b.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png',
              'https://c.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png'
            ],
            tileSize: 256
          }
        },
        layers: [
          {
            id: 'carto-dark-layer',
            type: 'raster',
            source: 'carto-dark',
            minzoom: 0,
            maxzoom: 20
          }
        ]
      },
      center: [77.5946, 12.9716], // Bangalore center coordinates
      zoom: 12
    });

    // Add navigation controls
    mapInstance.current.addControl(
      new maplibregl.NavigationControl({ showCompass: false }),
      'bottom-right'
    );

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  // Update markers and route lines when pickup or dropoff changes
  useEffect(() => {
    const map = mapInstance.current;
    if (!map) return;

    // Clear previous markers
    markers.current.forEach((marker) => marker.remove());
    markers.current = [];

    const pickupCoord = coordinates[pickup] || coordinates['Central Business District'];
    const dropoffCoord = coordinates[dropoff] || coordinates['International Tech Park'];

    // Create Pickup marker element
    const pickupEl = document.createElement('div');
    pickupEl.className = 'custom-map-marker';
    pickupEl.innerHTML = '<div class="w-4 h-4 rounded-full border-2 border-white bg-gradient-to-r from-cyan-400 to-blue-500 shadow-[0_0_10px_#06b6d4]"></div>';
    
    const pickupMarker = new maplibregl.Marker({ element: pickupEl })
      .setLngLat(pickupCoord)
      .setPopup(new maplibregl.Popup({ offset: 10 }).setHTML(`<p class="text-xs font-bold text-zinc-950 font-outfit">Pickup: ${pickup}</p>`))
      .addTo(map);

    // Create Dropoff marker element
    const dropoffEl = document.createElement('div');
    dropoffEl.className = 'custom-map-marker';
    dropoffEl.innerHTML = '<div class="w-4 h-4 rounded-full border-2 border-white bg-gradient-to-r from-purple-500 to-pink-500 shadow-[0_0_10px_#a855f7]"></div>';

    const dropoffMarker = new maplibregl.Marker({ element: dropoffEl })
      .setLngLat(dropoffCoord)
      .setPopup(new maplibregl.Popup({ offset: 10 }).setHTML(`<p class="text-xs font-bold text-zinc-950 font-outfit">Destination: ${dropoff}</p>`))
      .addTo(map);

    markers.current = [pickupMarker, dropoffMarker];

    // Fit map bounds to show both markers
    const bounds = new maplibregl.LngLatBounds()
      .extend(pickupCoord)
      .extend(dropoffCoord);

    map.fitBounds(bounds, { padding: 60 });

    // Draw route polyline
    map.on('load', () => {
      // Check if source already exists
      if (map.getSource('route')) {
        (map.getSource('route') as maplibregl.GeoJSONSource).setData({
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: [pickupCoord, dropoffCoord]
          }
        });
      } else {
        map.addSource('route', {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: [pickupCoord, dropoffCoord]
            }
          }
        });

        map.addLayer({
          id: 'route-layer',
          type: 'line',
          source: 'route',
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': '#06b6d4',
            'line-width': 4,
            'line-opacity': 0.8,
            'line-dasharray': [2, 2]
          }
        });
      }
    });

    // Trigger update if map is already loaded
    if (map.loaded()) {
      if (map.getSource('route')) {
        (map.getSource('route') as maplibregl.GeoJSONSource).setData({
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: [pickupCoord, dropoffCoord]
          }
        });
      }
    }
  }, [pickup, dropoff]);

  return (
    <div className="w-full h-full relative overflow-hidden rounded-3xl border border-zinc-800/40 glass-panel">
      {/* Map Canvas */}
      <div ref={mapContainer} className="w-full h-full" />

      {/* Floating Info Overlay */}
      <div className="absolute bottom-4 left-4 z-10 bg-zinc-950/80 backdrop-blur-md border border-zinc-800/60 rounded-2xl py-2 px-4 flex items-center gap-2 text-xxs text-zinc-400 font-medium">
        <Globe className="w-4 h-4 text-cyan-400 animate-spin-slow" />
        <span className="font-outfit uppercase tracking-wider text-white">CartoDB Dark Matter Mapping Source</span>
      </div>
    </div>
  );
}
