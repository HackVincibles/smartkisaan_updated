import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Waypoint } from '../../hooks/useOptimizedTracking';

// Fix for default marker icon in Leaflet + React
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

// Custom high-fidelity SVGs converted to Leaflet DivIcons to fit premium dark theme
const createDivIcon = (color: string, svgHtml: string, rotateDeg = 0) => {
  return L.divIcon({
    html: `
      <div style="
        background-color: ${color}; 
        width: 38px; 
        height: 38px; 
        border-radius: 12px; 
        display: flex; 
        align-items: center; 
        justify-content: center; 
        border: 2px solid white; 
        box-shadow: 0 8px 16px rgba(0,0,0,0.15);
        transform: rotate(${rotateDeg}deg);
        transition: transform 0.5s ease-in-out;
      ">
        ${svgHtml}
      </div>
    `,
    className: 'custom-smartkisaan-icon',
    iconSize: [38, 38],
    iconAnchor: [19, 19],
  });
};

const ICONS = {
  origin: createDivIcon('#10b981', `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`),
  destination: createDivIcon('#3b82f6', `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`),
  checkpoint: createDivIcon('#f59e0b', `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/></svg>`),
  vehicle: (bearing: number) => createDivIcon('#090f1e', `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13" rx="2" ry="2"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>`, bearing),
};

// Viewport boundaries listener component inside Leaflet context
interface MapBoundsTrackerProps {
  onBoundsChange: (bounds: any) => void;
  onZoomChange: (zoom: number) => void;
}

const MapBoundsTracker = ({ onBoundsChange, onZoomChange }: MapBoundsTrackerProps) => {
  const map = useMapEvents({
    moveend() {
      onBoundsChange(map.getBounds());
    },
    zoomend() {
      onBoundsChange(map.getBounds());
      onZoomChange(map.getZoom());
    },
  });

  // Fetch initial bounds when map loads
  useEffect(() => {
    onBoundsChange(map.getBounds());
    onZoomChange(map.getZoom());
  }, [map, onBoundsChange, onZoomChange]);

  return null;
};

interface LiveMapProps {
  center?: [number, number];
  zoom?: number;
  route?: [number, number][];
  waypoints?: Waypoint[];
  vehiclePos?: [number, number];
  bearing?: number;
  onBoundsChange?: (bounds: any) => void;
  onZoomChange?: (zoom: number) => void;
}

const LiveMap = ({
  center = [19.076, 72.8777],
  zoom = 10,
  route = [],
  waypoints = [],
  vehiclePos,
  bearing = 0,
  onBoundsChange,
  onZoomChange,
}: LiveMapProps) => {
  return (
    <div className="w-full h-full rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-inner relative">
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Listen and notify parent about viewport bounds/zoom */}
        {(onBoundsChange || onZoomChange) && (
          <MapBoundsTracker
            onBoundsChange={onBoundsChange || (() => {})}
            onZoomChange={onZoomChange || (() => {})}
          />
        )}

        {/* Render visible waypoints only */}
        {waypoints.map((wp, i) => {
          const icon = wp.type === 'vehicle' ? ICONS.vehicle(bearing) : ICONS[wp.type];
          return (
            <Marker key={`${wp.type}_${i}`} position={[wp.lat, wp.lng]} icon={icon}>
              <Popup>
                <div className="font-bold text-gray-900">{wp.label}</div>
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                  Type: {wp.type}
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* Dynamic Route Polyline */}
        {route.length > 0 && (
          <Polyline
            positions={route}
            pathOptions={{ color: '#10b981', weight: 5, dashArray: '10, 10' }}
          />
        )}
      </MapContainer>
    </div>
  );
};

export default React.memo(LiveMap);
