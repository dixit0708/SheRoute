import React, { useEffect } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import 'leaflet-routing-machine';


function Routing({ source, destination }) {
  const map = useMap();

  useEffect(() => {
    if (!source || !destination) return;

    const routingControl = L.Routing.control({
      waypoints: [
        L.latLng(source.lat, source.lng),
        L.latLng(destination.lat, destination.lng),
      ],
      routeWhileDragging: true,
    }).addTo(map);

    return () => map.removeControl(routingControl);
  }, [source, destination, map]);

  return null;
}

function MapDisplay({ source, destination }) {
  return (
    <MapContainer center={[28.8386, 78.7733]} zoom={13} style={{ height: '400px', width: '100%' }}>
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Routing source={source} destination={destination} />
    </MapContainer>
  );
}

export default MapDisplay;
