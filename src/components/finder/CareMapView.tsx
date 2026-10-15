import React, { useEffect, useRef, useState } from 'react';
import { HealthcareFacility } from '../../types';
import { loadGoogleMaps } from '../../services/nearbyCareService';
import { Crosshair, Plus, Minus, Layers, MapPin } from 'lucide-react';

interface CareMapViewProps {
  centerLat: number;
  centerLng: number;
  facilities: HealthcareFacility[];
  selectedFacility: HealthcareFacility | null;
  onSelectFacility: (facility: HealthcareFacility) => void;
  onRecenter: () => void;
  isLocating?: boolean;
}

export const CareMapView: React.FC<CareMapViewProps> = ({
  centerLat,
  centerLng,
  facilities,
  selectedFacility,
  onSelectFacility,
  onRecenter,
  isLocating = false,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const userMarkerRef = useRef<any>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState(false);

  // Initialize Map
  useEffect(() => {
    let isCancelled = false;

    async function initMap() {
      if (!mapContainerRef.current) return;

      try {
        const googleInstance = await loadGoogleMaps();
        if (isCancelled) return;

        if (!googleInstance?.maps?.Map) {
          setMapError(true);
          return;
        }

        const mapOptions: any = {
          center: { lat: centerLat, lng: centerLng },
          zoom: 14,
          internalUsageAttributionIds: ['gmp_git_agentskills_v1'],
          disableDefaultUI: true,
          zoomControl: false,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
          styles: [
            {
              featureType: 'poi.medical',
              elementType: 'geometry',
              stylers: [{ color: '#fbe9e7' }],
            },
            {
              featureType: 'poi.medical',
              elementType: 'labels.icon',
              stylers: [{ visibility: 'on' }],
            },
            {
              featureType: 'transit',
              elementType: 'labels.icon',
              stylers: [{ visibility: 'simplified' }],
            },
          ],
        };

        const map = new googleInstance.maps.Map(mapContainerRef.current, mapOptions);
        mapInstanceRef.current = map;
        setMapLoaded(true);
      } catch (err) {
        console.warn('Could not initialize Google Maps view', err);
        setMapError(true);
      }
    }

    initMap();

    return () => {
      isCancelled = true;
    };
  }, []);

  // Update center when coordinates change
  useEffect(() => {
    if (mapInstanceRef.current && (window as any).google?.maps) {
      mapInstanceRef.current.panTo({ lat: centerLat, lng: centerLng });

      // Update or create User Location Marker
      if (userMarkerRef.current) {
        userMarkerRef.current.setPosition({ lat: centerLat, lng: centerLng });
      } else {
        const google = (window as any).google;
        userMarkerRef.current = new google.maps.Marker({
          position: { lat: centerLat, lng: centerLng },
          map: mapInstanceRef.current,
          title: 'Your Location',
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: '#2563EB',
            fillOpacity: 1,
            strokeColor: '#FFFFFF',
            strokeWeight: 3,
          },
        });
      }
    }
  }, [centerLat, centerLng]);

  // Update markers when facilities list changes
  useEffect(() => {
    if (!mapInstanceRef.current || !(window as any).google?.maps) return;

    const google = (window as any).google;

    // Clear old markers
    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = [];

    const bounds = new google.maps.LatLngBounds();
    bounds.extend({ lat: centerLat, lng: centerLng });

    facilities.forEach((facility) => {
      const isHospital = facility.type === 'hospital' || facility.type === 'emergency';
      const isPharmacy = facility.type === 'pharmacy';

      const pinColor = isHospital ? '#DC2626' : isPharmacy ? '#059669' : '#4F46E5';

      // SVG Icon with hospital cross or pill mark
      const icon = {
        path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z',
        fillColor: pinColor,
        fillOpacity: 1,
        strokeWeight: 1.5,
        strokeColor: '#FFFFFF',
        scale: 1.6,
        anchor: new google.maps.Point(12, 22),
      };

      const marker = new google.maps.Marker({
        position: { lat: facility.lat, lng: facility.lng },
        map: mapInstanceRef.current,
        title: facility.name,
        icon,
        animation: selectedFacility?.id === facility.id ? google.maps.Animation.BOUNCE : null,
      });

      marker.addListener('click', () => {
        onSelectFacility(facility);
      });

      bounds.extend({ lat: facility.lat, lng: facility.lng });
      markersRef.current.push(marker);
    });

    // Fit map bounds if there are facilities
    if (facilities.length > 0) {
      mapInstanceRef.current.fitBounds(bounds, { top: 40, bottom: 40, left: 40, right: 40 });
    }
  }, [facilities, selectedFacility, onSelectFacility, centerLat, centerLng]);

  // Highlight selected marker
  useEffect(() => {
    if (!selectedFacility || !mapInstanceRef.current || !(window as any).google?.maps) return;

    mapInstanceRef.current.panTo({ lat: selectedFacility.lat, lng: selectedFacility.lng });
    mapInstanceRef.current.setZoom(15);
  }, [selectedFacility]);

  // Radar visual scale factor for fallback mode
  const [radarZoom, setRadarZoom] = useState(1);

  // Zoom handlers
  const handleZoomIn = () => {
    if (mapInstanceRef.current && (window as any).google?.maps) {
      mapInstanceRef.current.setZoom(mapInstanceRef.current.getZoom() + 1);
    } else {
      setRadarZoom((prev) => Math.min(prev * 1.3, 3));
    }
  };

  const handleZoomOut = () => {
    if (mapInstanceRef.current && (window as any).google?.maps) {
      mapInstanceRef.current.setZoom(mapInstanceRef.current.getZoom() - 1);
    } else {
      setRadarZoom((prev) => Math.max(prev / 1.3, 0.4));
    }
  };

  const handleRecenterRadar = () => {
    setRadarZoom(1);
    onRecenter();
  };

  return (
    <div className="relative w-full h-full min-h-[380px] bg-slate-900 rounded-2xl overflow-hidden border border-slate-800">
      {/* Map DOM target for Google Maps */}
      <div ref={mapContainerRef} className="w-full h-full absolute inset-0 z-0" />

      {/* Interactive Medical Radar fallback if Google Maps JS API is blocked/loading */}
      {(!mapLoaded || mapError) && (
        <div className="absolute inset-0 bg-radial from-slate-900 via-slate-950 to-black flex flex-col items-center justify-center p-4 overflow-hidden z-10 select-none">
          {/* Subtle Radar Concentric Rings */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div
              className="rounded-full border border-blue-500/20 absolute transition-all duration-300"
              style={{ width: `${120 * radarZoom}px`, height: `${120 * radarZoom}px` }}
            />
            <div
              className="rounded-full border border-blue-500/25 absolute transition-all duration-300"
              style={{ width: `${240 * radarZoom}px`, height: `${240 * radarZoom}px` }}
            />
            <div
              className="rounded-full border border-blue-500/15 border-dashed absolute transition-all duration-300"
              style={{ width: `${360 * radarZoom}px`, height: `${360 * radarZoom}px` }}
            />
            {/* Crosshair lines */}
            <div className="w-full h-px bg-blue-500/15 absolute" />
            <div className="h-full w-px bg-blue-500/15 absolute" />
          </div>

          {/* Center User Location Node */}
          <div className="relative z-20 flex flex-col items-center pointer-events-none">
            <div className="w-5 h-5 rounded-full bg-blue-500 ring-4 ring-blue-500/30 flex items-center justify-center shadow-lg shadow-blue-500/50 animate-pulse">
              <div className="w-2 h-2 rounded-full bg-white" />
            </div>
            <span className="text-[10px] font-bold text-blue-300 mt-1 bg-slate-900/80 px-2 py-0.5 rounded border border-blue-500/30 shadow-xs">
              Center
            </span>
          </div>

          {/* Plotted Facility Radar Nodes */}
          <div className="absolute inset-0 pointer-events-auto">
            {facilities.map((fac) => {
              // Calculate relative offset from center (scaled by radarZoom)
              const dLat = (fac.lat - centerLat) * 111; // ~km
              const dLng = (fac.lng - centerLng) * 85; // ~km
              const scalePxPerKm = 35 * radarZoom;
              const leftPercent = 50 + (dLng * scalePxPerKm * 100) / 400;
              const topPercent = 50 - (dLat * scalePxPerKm * 100) / 400;

              // Constrain to visible radar canvas
              const clampedX = Math.max(8, Math.min(92, leftPercent));
              const clampedY = Math.max(8, Math.min(88, topPercent));

              const isHospital = fac.type === 'hospital' || fac.type === 'emergency';
              const isPharmacy = fac.type === 'pharmacy';
              const isSelected = selectedFacility?.id === fac.id;

              const pinColor = isHospital ? 'bg-red-500 ring-red-400' : isPharmacy ? 'bg-emerald-500 ring-emerald-400' : 'bg-blue-500 ring-blue-400';

              return (
                <button
                  key={fac.id}
                  onClick={() => onSelectFacility(fac)}
                  style={{ left: `${clampedX}%`, top: `${clampedY}%` }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer transition-transform duration-200 z-30 ${
                    isSelected ? 'scale-125 z-40' : 'hover:scale-115'
                  }`}
                  title={`${fac.name} (${fac.distanceKm} km)`}
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-white shadow-md ring-2 ${pinColor} ${
                      isSelected ? 'ring-4 ring-white shadow-xl' : ''
                    }`}
                  >
                    <span className="text-[10px] font-bold">
                      {isHospital ? 'H' : isPharmacy ? 'Rx' : '+'}
                    </span>
                  </div>
                  {/* Floating tooltip */}
                  <div
                    className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-0.5 rounded bg-slate-900/95 border border-slate-700 text-[10px] text-white font-medium whitespace-nowrap shadow-md pointer-events-none transition ${
                      isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                    }`}
                  >
                    {fac.name.length > 22 ? fac.name.slice(0, 20) + '...' : fac.name}
                    <span className="text-emerald-400 ml-1">({fac.distanceKm}km)</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Selected Facility Mini Ribbon on Radar */}
          {selectedFacility && (
            <div className="absolute bottom-12 left-4 right-4 z-40 bg-slate-900/90 backdrop-blur-md border border-slate-700 p-2.5 rounded-xl shadow-xl flex items-center justify-between gap-2 text-white">
              <div className="truncate text-left">
                <p className="text-xs font-bold truncate text-slate-100">{selectedFacility.name}</p>
                <p className="text-[11px] text-slate-400 truncate">
                  {selectedFacility.distanceKm} km · {selectedFacility.is24Hours ? 'Open 24/7' : 'Open Now'} · {selectedFacility.address}
                </p>
              </div>
              <a
                href={selectedFacility.googleMapsUri}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 px-2.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1 shadow-sm transition"
              >
                <span>Navigate</span>
              </a>
            </div>
          )}
        </div>
      )}

      {/* Floating Map Controls */}
      <div className="absolute top-4 right-4 z-40 flex flex-col gap-2">
        {/* Recenter Button */}
        <button
          onClick={handleRecenterRadar}
          disabled={isLocating}
          title="Recenter on My Location"
          className="w-9 h-9 rounded-xl bg-white/95 text-slate-800 shadow-md border border-slate-200 flex items-center justify-center hover:bg-blue-50 hover:text-blue-600 transition active:scale-95 disabled:opacity-50 cursor-pointer"
        >
          <Crosshair className={`w-4 h-4 ${isLocating ? 'animate-spin text-blue-600' : ''}`} />
        </button>

        {/* Zoom In */}
        <button
          onClick={handleZoomIn}
          title="Zoom In"
          className="w-9 h-9 rounded-xl bg-white/95 text-slate-800 shadow-md border border-slate-200 flex items-center justify-center hover:bg-blue-50 hover:text-blue-600 transition active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
        </button>

        {/* Zoom Out */}
        <button
          onClick={handleZoomOut}
          title="Zoom Out"
          className="w-9 h-9 rounded-xl bg-white/95 text-slate-800 shadow-md border border-slate-200 flex items-center justify-center hover:bg-blue-50 hover:text-blue-600 transition active:scale-95 cursor-pointer"
        >
          <Minus className="w-4 h-4" />
        </button>
      </div>

      {/* Legend Badge */}
      <div className="absolute bottom-3 left-3 z-30 flex flex-wrap items-center gap-2 p-1.5 rounded-xl bg-slate-900/85 backdrop-blur-md border border-slate-700/80 shadow-md text-[10px] font-semibold text-slate-200">
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block"></span>
          Hospital
        </span>
        <span className="text-slate-500">|</span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
          Pharmacy
        </span>
        <span className="text-slate-500">|</span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block"></span>
          Clinic
        </span>
      </div>

      {/* Google Maps External Link Badge */}
      <a
        href={`https://www.google.com/maps/search/?api=1&query=24+hour+pharmacy+near+${centerLat},${centerLng}`}
        target="_blank"
        rel="noopener noreferrer"
        title="Open Full Area in Google Maps"
        className="absolute bottom-3 right-3 z-30 px-2 py-1 rounded-lg bg-white/95 hover:bg-blue-50 text-slate-700 hover:text-blue-700 text-[10px] font-semibold border border-slate-200 shadow-sm transition flex items-center gap-1"
      >
        <span>Open in Google Maps</span>
        <MapPin className="w-3 h-3 text-rose-500" />
      </a>
    </div>
  );
};
