"use client";

import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { TurkishUniversity, PartnerUniversity } from "@/lib/types";

// Fix for default marker icons in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Custom red marker icon for Turkish university
const redIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Custom blue marker icon for partner universities
const blueIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface MapCenterControllerProps {
  center: [number, number];
  zoom: number;
}

// Component to control map center when marker is clicked
function MapCenterController({ center, zoom }: MapCenterControllerProps) {
  const map = useMap();

  useEffect(() => {
    map.flyTo(center, zoom, {
      duration: 1.5,
      easeLinearity: 0.5,
    });
  }, [center, zoom, map]);

  return null;
}

interface UniversityMapProps {
  university: TurkishUniversity;
  onMarkerClick?: (lat: number, lng: number) => void;
}

export function UniversityMap({ university, onMarkerClick }: UniversityMapProps) {
  // Get all partner universities with their departments
  const partners: Array<PartnerUniversity & { departmentName: string }> = [];
  university.departments.forEach((dept) => {
    dept.partners.forEach((partner) => {
      partners.push({
        ...partner,
        departmentName: dept.name,
      });
    });
  });

  // Calculate center point between Turkish university and all partners
  const allLats = [university.lat, ...partners.map((p) => p.lat)];
  const allLngs = [university.lng, ...partners.map((p) => p.lng)];
  
  const centerLat = (Math.max(...allLats) + Math.min(...allLats)) / 2;
  const centerLng = (Math.max(...allLngs) + Math.min(...allLngs)) / 2;

  // Calculate appropriate zoom level based on spread
  const latSpread = Math.max(...allLats) - Math.min(...allLats);
  const lngSpread = Math.max(...allLngs) - Math.min(...allLngs);
  const maxSpread = Math.max(latSpread, lngSpread);
  
  let initialZoom = 5;
  if (maxSpread < 5) initialZoom = 7;
  else if (maxSpread < 10) initialZoom = 6;
  else if (maxSpread < 20) initialZoom = 5;
  else if (maxSpread < 40) initialZoom = 4;
  else initialZoom = 3;

  const [mapCenter, setMapCenter] = useState<[number, number]>([centerLat, centerLng]);
  const [mapZoom, setMapZoom] = useState<number>(initialZoom);

  const handleMarkerClick = (lat: number, lng: number) => {
    setMapCenter([lat, lng]);
    setMapZoom(8);
    onMarkerClick?.(lat, lng);
  };

  return (
    <div className="h-full w-full relative">
      <MapContainer
        center={[centerLat, centerLng]}
        zoom={initialZoom}
        className="h-full w-full rounded-lg"
        scrollWheelZoom={true}
      >
        <MapCenterController center={mapCenter} zoom={mapZoom} />
        
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Turkish University Marker (Red) */}
        <Marker
          position={[university.lat, university.lng]}
          icon={redIcon}
          eventHandlers={{
            click: () => handleMarkerClick(university.lat, university.lng),
          }}
        >
          <Popup>
            <div className="text-sm">
              <div className="font-bold text-red-600 mb-1">{university.name}</div>
              <div className="text-gray-600">{university.city}, Turkey</div>
              <div className="text-xs text-gray-500 mt-1">
                {university.departments.length} Departments
              </div>
            </div>
          </Popup>
        </Marker>

        {/* Partner University Markers (Blue) */}
        {partners.map((partner, index) => (
          <Marker
            key={`${partner.name}-${index}`}
            position={[partner.lat, partner.lng]}
            icon={blueIcon}
            eventHandlers={{
              click: () => handleMarkerClick(partner.lat, partner.lng),
            }}
          >
            <Popup>
              <div className="text-sm">
                <div className="font-bold text-blue-600 mb-1">{partner.name}</div>
                <div className="text-gray-600">{partner.country}</div>
                <div className="text-xs text-gray-500 mt-1">
                  Department: {partner.department || partner.departmentName}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Map Legend */}
      <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-3 z-[1000] border">
        <div className="text-xs font-semibold mb-2">Legend</div>
        <div className="space-y-1 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>Turkish University</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span>Partner Universities</span>
          </div>
        </div>
        <div className="text-xs text-gray-500 mt-2 pt-2 border-t">
          Click markers to center map
        </div>
      </div>
    </div>
  );
}

