"use client";

import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { PartnerUniversityDetail } from "@/lib/types";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { getUniversityById } from "@/lib/data";

// Fix for default marker icons in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Custom blue marker icon for partner university (main)
const blueIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
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

interface MapCenterControllerProps {
  center: [number, number];
  zoom: number;
}

function MapCenterController({ center, zoom }: MapCenterControllerProps) {
  const map = useMap();

  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);

  return null;
}

interface PartnerUniversityMapProps {
  partner: PartnerUniversityDetail;
}

export function PartnerUniversityMap({ partner }: PartnerUniversityMapProps) {
  // Get actual coordinates for Turkish universities
  const turkishUniversitiesWithCoords = partner.turkishPartners.map((tp: any) => {
    const uni = getUniversityById(tp.universityId);
    return {
      ...tp,
      lat: uni?.lat || 39.0,
      lng: uni?.lng || 35.0,
    };
  });

  // Calculate center point between partner and Turkish universities
  const allLats = [partner.lat, ...turkishUniversitiesWithCoords.map(tp => tp.lat)];
  const allLngs = [partner.lng, ...turkishUniversitiesWithCoords.map(tp => tp.lng)];

  const centerLat = allLats.reduce((a, b) => a + b, 0) / allLats.length;
  const centerLng = allLngs.reduce((a, b) => a + b, 0) / allLngs.length;

  const [mapCenter] = useState<[number, number]>([centerLat, centerLng]);
  const [mapZoom] = useState<number>(4);

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

        {/* Partner University Marker (Blue - Main) */}
        <Marker
          position={[partner.lat, partner.lng]}
          icon={blueIcon}
        >
          <Popup>
            <div className="text-sm min-w-[200px]">
              <div className="font-bold text-blue-600 mb-2">{partner.name}</div>
              <div className="text-gray-600 mb-1">{partner.country}</div>
              <div className="text-xs text-gray-500">
                {partner.turkishPartners.length} Turkish Partner{partner.turkishPartners.length !== 1 ? 's' : ''}
              </div>
            </div>
          </Popup>
        </Marker>

        {/* Turkish Partner Universities Markers (Red) */}
        {turkishUniversitiesWithCoords.map((turkishPartner: any, idx: number) => {
          return (
            <Marker
              key={`turkish-${idx}`}
              position={[turkishPartner.lat, turkishPartner.lng]}
              icon={redIcon}
            >
              <Popup>
                <div className="text-sm min-w-[200px]">
                  <div className="font-bold text-red-600 mb-1">
                    {turkishPartner.universityName}
                  </div>
                  <div className="text-gray-600 mb-1">
                    {turkishPartner.universityCity}, Turkey
                  </div>
                  <div className="text-xs text-gray-500 mb-1">
                    Department: {turkishPartner.department}
                  </div>
                  {turkishPartner.partnerDepartment && (
                    <div className="text-xs text-gray-500 mb-2">
                      Partner Dept: {turkishPartner.partnerDepartment}
                    </div>
                  )}
                  <Link
                    href={`/university/${turkishPartner.universityId}`}
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

        {/* Connection Lines */}
        {turkishUniversitiesWithCoords.map((turkishPartner: any, idx: number) => {
          return (
            <Polyline
              key={`line-${idx}`}
              positions={[
                [partner.lat, partner.lng],
                [turkishPartner.lat, turkishPartner.lng],
              ]}
              color="#3b82f6"
              weight={2}
              opacity={0.5}
              dashArray="5, 10"
            />
          );
        })}
      </MapContainer>

      {/* Map Legend */}
      <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-4 z-[1000] border">
        <div className="text-xs font-semibold mb-3">Map Legend</div>
        <div className="space-y-2 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span>Partner University</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>Turkish Universities ({partner.turkishPartners.length})</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 border-2 border-blue-500 bg-transparent rounded-full"></div>
            <span className="text-gray-500">Partnership Connection</span>
          </div>
        </div>
      </div>

      {/* Info Box */}
      <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-4 z-[1000] border max-w-xs">
        <div className="text-sm font-semibold mb-2">{partner.name}</div>
        <div className="space-y-1 text-xs text-gray-600">
          <div>Location: <span className="font-semibold">{partner.country}</span></div>
          <div>Turkish Partners: <span className="font-semibold">{partner.turkishPartners.length}</span></div>
          <div>
            Departments: <span className="font-semibold">
              {new Set(partner.turkishPartners.map((p: any) => p.department)).size}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
