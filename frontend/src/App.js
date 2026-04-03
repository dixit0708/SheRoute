import React, { useState } from 'react';
import axios from 'axios';
import MapDisplay from './components/MapDisplay';
import SafetyIndicators from './components/SafetyIndicators';
import SOSButton from './components/SOSButton';
import './App.css';
import { MapPinIcon, MagnifyingGlassIcon } from '@heroicons/react/24/solid';

function App() {
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [sourceCoords, setSourceCoords] = useState(null);
  const [destinationCoords, setDestinationCoords] = useState(null);
  const [loading, setLoading] = useState(false);
  const [routeFound, setRouteFound] = useState(false);
  const [safeWaypoints, setSafeWaypoints] = useState([]);
  const [safestRoute, setSafestRoute] = useState(null);

  const geocode = async (place) => {
    try {
      const res = await axios.get(`https://nominatim.openstreetmap.org/search`, {
        params: { q: place, format: 'json', limit: 1 },
        headers: { 'User-Agent': 'SheRoute/1.0 (contact@herroute.example)' }
      });
      return res.data.length > 0 ? { lat: parseFloat(res.data[0].lat), lng: parseFloat(res.data[0].lon) } : null;
    } catch (err) { return null; }
  };

  const handleFindRoute = async () => {
    if (!source.trim() || !destination.trim()) return alert('Please enter locations');
    setLoading(true);
    try {
      const src = await geocode(source);
      const dest = await geocode(destination);
      if (!src || !dest) return alert('Location not found');

      setSourceCoords(src);
      setDestinationCoords(dest);

      // OSRM Routing for high-precision road paths
      const routeUrl = `https://router.project-osrm.org/route/v1/driving/${src.lng},${src.lat};${dest.lng},${dest.lat}?overview=full&geometries=geojson`;
      const res = await axios.get(routeUrl);
      
      const roadPoints = res.data.routes[0].geometry.coordinates.map(coord => ({ lat: coord[1], lng: coord[0] }));
      // Backend call for weighted safety scoring + safe detour
      let backendWaypoints = [];
      try {
        const backendRes = await axios.post('http://localhost:3002/getSafeRoute', { source: src, destination: dest });
        backendWaypoints = backendRes.data?.waypoints || [];
        setSafestRoute(backendRes.data?.safest_route || null);
      } catch (e) {
        console.warn("Backend safe-route unavailable, using OSRM path only.");
        setSafestRoute(null);
      }

      const mappedBackend = backendWaypoints.map(p => ({ lat: p.lat, lng: p.lng }));
      setSafeWaypoints(mappedBackend.length ? mappedBackend : roadPoints);
      setRouteFound(true);
    } catch (e) { alert("Routing failed. Check connection."); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ position: 'relative', height: '100vh', width: '100vw', overflow: 'hidden', backgroundColor: '#000' }}>
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
         <MapDisplay waypoints={safeWaypoints} source={sourceCoords} destination={destinationCoords} /> 
      </div>

      <div style={{ 
        position: 'absolute', top: '20px', left: '20px', zIndex: 10, width: '300px',
        backgroundColor: 'rgba(255, 255, 255, 0.98)', padding: '16px', borderRadius: '15px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.3)', boxSizing: 'border-box'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px', gap: '10px' }}>
          <img src="/Logo.jpeg" alt="Logo" style={{ height: '32px', width: '32px', borderRadius: '50%' }} />
          <div>
            <h1 style={{ fontSize: '18px', fontWeight: '900', margin: 0 }}>SheRoute</h1>
            <p style={{ fontSize: '8px', fontWeight: 'bold', color: '#999', margin: 0 }}>NAVIGATE WITH CONFIDENCE</p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ position: 'relative' }}>
            <MapPinIcon style={{ position: 'absolute', left: '10px', top: '10px', height: '14px', width: '14px', color: '#999' }} />
            <input type="text" placeholder="Start point..." value={source} onChange={(e) => setSource(e.target.value)}
              style={{ width: '100%', padding: '10px 10px 10px 35px', borderRadius: '8px', border: '1px solid #eee', fontSize: '12px', boxSizing: 'border-box' }} />
          </div>
          <div style={{ position: 'relative' }}>
            <MapPinIcon style={{ position: 'absolute', left: '10px', top: '10px', height: '14px', width: '14px', color: '#db2777' }} />
            <input type="text" placeholder="Destination..." value={destination} onChange={(e) => setDestination(e.target.value)}
              style={{ width: '100%', padding: '10px 10px 10px 35px', borderRadius: '8px', border: '1px solid #eee', fontSize: '12px', boxSizing: 'border-box' }} />
          </div>
          <button onClick={handleFindRoute} disabled={loading}
            style={{ width: '100%', padding: '12px', backgroundColor: '#000', color: '#fff', borderRadius: '8px', fontWeight: 'bold', fontSize: '11px', cursor: 'pointer', border: 'none' }}>
            {loading ? 'ANALYZING SAFETY...' : 'FIND SAFE ROUTE'}
          </button>
        </div>

        {routeFound && (
          <div style={{ marginTop: '15px', paddingTop: '15px', borderTop: '1px solid #eee' }}>
             <SafetyIndicators safest={safestRoute} />
          </div>
        )}
      </div>
      <SOSButton />
    </div>
  );
}
export default App;
