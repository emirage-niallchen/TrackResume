'use client';

import { useEffect, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// 修复 Leaflet 默认图标问题
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/images/marker-icon-2x.png',
  iconUrl: '/images/marker-icon.png',
  shadowUrl: '/images/marker-shadow.png',
});

type LocationData = {
  latitude: number;
  longitude: number;
  address: string;
  description: string;
  zoom: number;
};

const LocationMap = () => {
  const [location, setLocation] = useState<LocationData | null>(null);

  useEffect(() => {
    async function fetchLocation() {
      const response = await fetch('/api/location');
      const data = await response.json();
      setLocation(data);
    }
    fetchLocation();
  }, []);

  if (!location) return <div>Loading...</div>;

  return (
    <div className="h-[500px] w-full rounded-lg overflow-hidden shadow-lg">
      <MapContainer
        center={[location.latitude, location.longitude]}
        zoom={location.zoom}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[location.latitude, location.longitude]}>
          <Popup>
            <div className="p-2">
              <h3 className="font-bold mb-2">{location.description}</h3>
              <p>{location.address}</p>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
} 

export default LocationMap;