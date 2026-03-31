import React, { useState } from 'react';
import axios from 'axios';
import MapDisplay from './components/MapDisplay';
import SafetyIndicators from './components/SafetyIndicators';
import SOSButton from './components/SOSButton';
import './App.css';

function App() {
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [sourceCoords, setSourceCoords] = useState(null);
  const [destinationCoords, setDestinationCoords] = useState(null);
  const [routeFound, setRouteFound] = useState(false);

  const geocode = async (place) => {
    const res = await axios.get(`https://nominatim.openstreetmap.org/search`, {
      params: {
        q: place,
        format: 'json',
        limit: 1,
      },
    });
    if (res.data.length > 0) {
      return {
        lat: parseFloat(res.data[0].lat),
        lng: parseFloat(res.data[0].lon),
      };
    }
    return null;
  };

  const handleFindRoute = async () => {
    if (!source.trim() || !destination.trim()) {
      alert('Please enter both source and destination');
      return;
    }

    const src = await geocode(source);
    const dest = await geocode(destination);

    if (!src || !dest) {
      alert('Could not find coordinates for one of the locations');
      return;
    }

    setSourceCoords(src);
    setDestinationCoords(dest);
    setRouteFound(true);
  };

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-xl font-bold">SheRoute</h1>
      <div className="flex space-x-4 items-center">
        <input
          type="text"
          placeholder="Source"
          value={source}
          onChange={(e) => setSource(e.target.value)}
          className="border p-2 rounded w-1/4"
        />
        <input
          type="text"
          placeholder="Destination"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          className="border p-2 rounded w-1/4"
        />
        <button
          onClick={handleFindRoute}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          Find Safe Route
        </button>
      </div>

      <MapDisplay source={sourceCoords} destination={destinationCoords} />

      {routeFound && <SafetyIndicators />}

      <SOSButton />
    </div>
  );
}

export default App;
