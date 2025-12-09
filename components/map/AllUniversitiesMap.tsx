"use client";

import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { TurkishUniversity } from "@/lib/types";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { generatePartnerId } from "@/lib/data";

// Fix for default marker icons in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Custom red marker icon for Turkish universities
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

// Small green marker for selected filter
const greenIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
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

interface AllUniversitiesMapProps {
  universities: TurkishUniversity[];
  selectedUniversityId?: string | null;
}

export function AllUniversitiesMap({
  universities,
  selectedUniversityId = null,
}: AllUniversitiesMapProps) {
  const [mapCenter, setMapCenter] = useState<[number, number]>([39.9334, 32.8597]); // Ankara, Turkey
  const [mapZoom, setMapZoom] = useState<number>(6);

  // Get all unique partner universities across all Turkish universities
  const allPartners = new Map<string, { lat: number; lng: number; name: string; country: string }>();
  
  universities.forEach((uni) => {
    uni.departments.forEach((dept) => {
      dept.partners.forEach((partner) => {
        const key = `${partner.name}-${partner.country}`;
        if (!allPartners.has(key)) {
          allPartners.set(key, partner);
        }
      });
    });
  });

  // Filter universities if one is selected
  const displayUniversities = selectedUniversityId
    ? universities.filter((uni) => uni.id === selectedUniversityId)
    : universities;

  const handleMarkerClick = (lat: number, lng: number) => {
    setMapCenter([lat, lng]);
    setMapZoom(8);
  };

  return (
    <div className="h-full w-full relative">
      <MapContainer
        center={mapCenter}
        zoom={mapZoom}
        className="h-full w-full rounded-lg"
        scrollWheelZoom={true}
        style={{ zIndex: 0 }}
      >
        <MapCenterController center={mapCenter} zoom={mapZoom} />
        
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Turkish University Markers (Red or Green if selected) */}
        {displayUniversities.map((university) => {
          const isSelected = selectedUniversityId === university.id;
          const partnerCount = university.departments.reduce(
            (sum, dept) => sum + dept.partners.length,
            0
          );

          return (
            <Marker
              key={university.id}
              position={[university.lat, university.lng]}
              icon={isSelected ? greenIcon : redIcon}
              eventHandlers={{
                click: () => handleMarkerClick(university.lat, university.lng),
              }}
            >
              <Popup>
                <div className="text-sm min-w-[200px]">
                  <div className="font-bold text-red-600 mb-2">{university.name}</div>
                  <div className="text-gray-600 mb-1">{university.city}, Turkey</div>
                  <div className="text-xs text-gray-500 mb-2">
                    {university.departments.length} Departments • {partnerCount} Partners
                  </div>
                  <Link
                    href={`/university/${university.id}`}
                    className="inline-flex items-center text-xs text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    View Details
                    <ExternalLink className="ml-1 h-3 w-3" />
                  </Link>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* Partner University Markers (Blue) */}
        {!selectedUniversityId && Array.from(allPartners.values()).map((partner, idx) => {
          const partnerId = generatePartnerId(partner.name);
          return (
            <Marker
              key={`partner-${idx}`}
              position={[partner.lat, partner.lng]}
              icon={blueIcon}
              eventHandlers={{
                click: () => handleMarkerClick(partner.lat, partner.lng),
              }}
            >
              <Popup>
                <div className="text-sm min-w-[180px]">
                  <div className="font-bold text-blue-600 mb-1">{partner.name}</div>
                  <div className="text-gray-600 mb-2">{partner.country}</div>
                  <Link
                    href={`/partner/${partnerId}`}
                    className="inline-flex items-center text-xs text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    View Details
                    <ExternalLink className="ml-1 h-3 w-3" />
                  </Link>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* Show partner markers for selected university */}
        {selectedUniversityId && displayUniversities.map((uni) =>
          uni.departments.flatMap((dept) =>
            dept.partners.map((partner, idx) => {
              const partnerId = generatePartnerId(partner.name);
              return (
                <Marker
                  key={`selected-partner-${idx}`}
                  position={[partner.lat, partner.lng]}
                  icon={blueIcon}
                  eventHandlers={{
                    click: () => handleMarkerClick(partner.lat, partner.lng),
                  }}
                >
                  <Popup>
                    <div className="text-sm min-w-[180px]">
                      <div className="font-bold text-blue-600 mb-1">{partner.name}</div>
                      <div className="text-gray-600 mb-1">{partner.country}</div>
                      <div className="text-xs text-gray-500 mb-1">
                        Partner with: {uni.name}
                      </div>
                      {partner.department && (
                        <div className="text-xs text-gray-500 mb-2">
                          Department: {partner.department}
                        </div>
                      )}
                      <Link
                        href={`/partner/${partnerId}`}
                        className="inline-flex items-center text-xs text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        View Details
                        <ExternalLink className="ml-1 h-3 w-3" />
                      </Link>
                    </div>
                  </Popup>
                </Marker>
              );
            })
          )
        )}
      </MapContainer>

      {/* Map Legend */}
      <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-4 z-[1000] border">
        <div className="text-xs font-semibold mb-3">Map Legend</div>
        <div className="space-y-2 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>Turkish Universities ({displayUniversities.length})</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span>
              Partner Universities (
              {selectedUniversityId
                ? displayUniversities.reduce(
                    (sum, uni) =>
                      sum +
                      uni.departments.reduce((dSum, dept) => dSum + dept.partners.length, 0),
                    0
                  )
                : allPartners.size}
              )
            </span>
          </div>
          {selectedUniversityId && (
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Selected University</span>
            </div>
          )}
        </div>
        <div className="text-xs text-gray-500 mt-3 pt-3 border-t">
          Click markers to zoom in
        </div>
      </div>

      {/* Statistics Box */}
      <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-4 z-[1000] border max-w-xs">
        <div className="text-sm font-semibold mb-2">
          {selectedUniversityId
            ? displayUniversities[0]?.name
            : "All Universities Overview"}
        </div>
        <div className="space-y-1 text-xs text-gray-600">
          <div>Turkish Universities: <span className="font-semibold">{displayUniversities.length}</span></div>
          <div>
            Total Partners:{" "}
            <span className="font-semibold">
              {selectedUniversityId
                ? displayUniversities.reduce(
                    (sum, uni) =>
                      sum +
                      uni.departments.reduce((dSum, dept) => dSum + dept.partners.length, 0),
                    0
                  )
                : Array.from(allPartners.values()).length}
            </span>
          </div>
          <div>
            Departments:{" "}
            <span className="font-semibold">
              {displayUniversities.reduce((sum, uni) => sum + uni.departments.length, 0)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

