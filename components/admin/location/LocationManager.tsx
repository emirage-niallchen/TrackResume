"use client";

import { useState } from "react";

interface LocationFormData {
  latitude: string;
  longitude: string;
  address: string;
  description: string;
  zoom: string;
}

export default function LocationManager() {
  const [formData, setFormData] = useState<LocationFormData>({
    latitude: "",
    longitude: "",
    address: "",
    description: "",
    zoom: "13"
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch("/api/location", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          latitude: parseFloat(formData.latitude),
          longitude: parseFloat(formData.longitude),
          zoom: parseInt(formData.zoom)
        })
      });
      
      if (!response.ok) throw new Error("Failed to update location");
      
      alert("Location updated successfully!");
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to update location");
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Latitude</label>
          <input
            type="number"
            step="any"
            value={formData.latitude}
            onChange={e => setFormData(prev => ({ ...prev, latitude: e.target.value }))}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Longitude</label>
          <input
            type="number"
            step="any"
            value={formData.longitude}
            onChange={e => setFormData(prev => ({ ...prev, longitude: e.target.value }))}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Address</label>
          <input
            type="text"
            value={formData.address}
            onChange={e => setFormData(prev => ({ ...prev, address: e.target.value }))}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Description</label>
          <textarea
            value={formData.description}
            onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Zoom Level (1-20)</label>
          <input
            type="number"
            min="1"
            max="20"
            value={formData.zoom}
            onChange={e => setFormData(prev => ({ ...prev, zoom: e.target.value }))}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Update Location
        </button>
      </form>
    </div>
  );
} 