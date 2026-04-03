import React from 'react';
import { MapContainer, TileLayer, Polyline, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const MapDisplay = ({ waypoints, source, destination }) => {
  const center = source ? [source.lat, source.lng] : [28.6139, 77.2090];

  return (
    <MapContainer center={center} zoom={14} style={{ height: '100%', width: '100%' }} zoomControl={false}>
      {/* Cinematic Voyager Tile Layer */}
      <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />
      
      {source && <Marker position={[source.lat, source.lng]} />}
      {destination && <Marker position={[destination.lat, destination.lng]} />}

      {waypoints.length > 0 && (
        <Polyline positions={waypoints.map(p => [p.lat, p.lng])} 
          pathOptions={{ color: '#7c3aed', weight: 6, opacity: 0.8, lineJoin: 'round' }} />
      )}
    </MapContainer>
  );
};
export default MapDisplay;