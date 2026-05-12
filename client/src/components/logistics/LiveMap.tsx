import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icon in Leaflet + React
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface LiveMapProps {
  center?: [number, number];
  zoom?: number;
  markers?: Array<{
    position: [number, number];
    label: string;
  }>;
  route?: Array<[number, number]>;
}

const LiveMap = ({ 
  center = [19.0760, 72.8777], 
  zoom = 12, 
  markers = [],
  route = [] 
}: LiveMapProps) => {
  return (
    <div className="w-full h-full rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-inner">
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
        {markers.map((marker, i) => (
          <Marker key={i} position={marker.position}>
            <Popup>
              <div className="font-bold">{marker.label}</div>
            </Popup>
          </Marker>
        ))}
        {route.length > 0 && (
          <Polyline 
            positions={route} 
            pathOptions={{ color: '#16a34a', weight: 4, dashArray: '10, 10' }} 
          />
        )}
      </MapContainer>
    </div>
  );
};

export default LiveMap;
