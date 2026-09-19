import React, { useEffect, useRef, useState } from 'react';

/**
 * MapLibre GL Interactive Incident Map with Offline Fallback
 * Developer: Pallabi (NTRO Frontend)
 * 
 * Features:
 * - Stable severity-coded markers (Critical: Red, High: Amber, Routine: Emerald)
 * - Click marker -> opens incident dossier
 * - Robust offline fallback: If Vector tiles or WebGL fail, smoothly renders an SVG tactical canvas
 */

const SEVERITY_COLORS = {
  CRITICAL: '#ef4444',
  HIGH: '#f59e0b',
  MODERATE: '#3b82f6',
  ROUTINE: '#10b981'
};

export default function IncidentMap({ incidents = [], selectedIncidentId, onSelectIncident }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [mapError, setMapError] = useState(false);
  const [usingFallback, setUsingFallback] = useState(false);

  useEffect(() => {
    // If MapLibre GL is available in window, initialize it; otherwise fallback to SVG tactical grid
    let map = null;

    if (window.maplibregl && mapContainerRef.current) {
      try {
        map = new window.maplibregl.Map({
          container: mapContainerRef.current,
          style: {
            version: 8,
            sources: {
              'osm-tiles': {
                type: 'raster',
                tiles: [
                  'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
                ],
                tileSize: 256,
                attribution: '&copy; OpenStreetMap contributors'
              }
            },
            layers: [
              {
                id: 'osm-tiles-layer',
                type: 'raster',
                source: 'osm-tiles',
                minzoom: 0,
                maxzoom: 19
              }
            ]
          },
          center: [82.0, 22.0], // India Center
          zoom: 4.2
        });

        map.on('error', () => {
          setUsingFallback(true);
        });

        // Add severity markers
        incidents.forEach(inc => {
          const color = SEVERITY_COLORS[inc.risk?.tier] || SEVERITY_COLORS.HIGH;
          const el = document.createElement('div');
          el.className = 'custom-map-marker';
          el.style.width = '24px';
          el.style.height = '24px';
          el.style.borderRadius = '50%';
          el.style.backgroundColor = color;
          el.style.border = '2.5px solid white';
          el.style.boxShadow = '0 0 10px rgba(0,0,0,0.35)';
          el.style.cursor = 'pointer';
          el.title = `${inc.id}: ${inc.title}`;

          if (inc.id === selectedIncidentId) {
            el.style.transform = 'scale(1.35)';
            el.style.borderColor = '#ff5a1f';
          }

          el.addEventListener('click', () => {
            if (onSelectIncident) onSelectIncident(inc.id);
          });

          new window.maplibregl.Marker({ element: el })
            .setLngLat([inc.coordinates.lon, inc.coordinates.lat])
            .addTo(map);
        });

        mapInstanceRef.current = map;
      } catch (err) {
        console.warn('MapLibre GL failed to load, activating offline-safe tactical canvas', err);
        setUsingFallback(true);
      }
    } else {
      // Offline fallback
      setUsingFallback(true);
    }

    return () => {
      if (mapInstanceRef.current && mapInstanceRef.current.remove) {
        try { mapInstanceRef.current.remove(); } catch { /* ignore cleanup */ }
      }
    };
  }, [incidents, selectedIncidentId]);

  return (
    <div className="relative w-full h-80 sm:h-96 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 shadow-sm">
      {/* Primary Map Container */}
      {!usingFallback && (
        <div ref={mapContainerRef} className="w-full h-full" />
      )}

      {/* Offline-Safe Tactical Canvas Fallback */}
      {usingFallback && (
        <div className="w-full h-full relative bg-slate-900 text-white flex flex-col justify-between p-4 font-mono select-none">
          {/* Tactical Grid Background */}
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]"></div>
          
          <div className="relative z-10 flex items-center justify-between border-b border-slate-800 pb-2 text-xs">
            <span className="text-blue-400 font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
              TACTICAL RADAR OVERLAY (OFFLINE SAFE)
            </span>
            <span className="text-[10px] text-slate-400">LAT: 6°-36°N | LON: 68°-98°E</span>
          </div>

          {/* Markers plotted proportionally across India spatial bounds */}
          <div className="relative w-full h-full z-10">
            {incidents.map(inc => {
              // Map lat 8-32 to Y: 90%-10%, lon 68-90 to X: 10%-90%
              const x = Math.min(Math.max(((inc.coordinates.lon - 68) / 24) * 80 + 10, 5), 95);
              const y = Math.min(Math.max((1 - (inc.coordinates.lat - 8) / 26) * 80 + 10, 5), 95);
              const isSelected = inc.id === selectedIncidentId;
              const color = SEVERITY_COLORS[inc.risk?.tier] || SEVERITY_COLORS.HIGH;

              return (
                <button
                  key={inc.id}
                  onClick={() => onSelectIncident && onSelectIncident(inc.id)}
                  style={{ left: `${x}%`, top: `${y}%` }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 group transition-transform ${isSelected ? 'scale-125 z-20' : 'hover:scale-110 z-10'}`}
                >
                  <div 
                    className="w-4 h-4 rounded-full border-2 border-white shadow-lg animate-pulse"
                    style={{ backgroundColor: color }}
                  />
                  <div className={`absolute left-5 top-1/2 -translate-y-1/2 whitespace-nowrap px-2 py-0.5 rounded text-[10px] font-bold shadow-md ${isSelected ? 'bg-orange-600 text-white' : 'bg-slate-800 text-slate-200 opacity-90'}`}>
                    {inc.id} ({inc.satellite?.frp_mw} MW)
                  </div>
                </button>
              );
            })}
          </div>

          <div className="relative z-10 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800 pt-2">
            <span>NASA VIIRS 375m Ground Tracks</span>
            <span>Click marker to inspect full dossier</span>
          </div>
        </div>
      )}

      {/* Map Legend */}
      <div className="absolute bottom-3 left-3 z-10 bg-white/90 dark:bg-slate-900/90 backdrop-blur px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-[11px] font-mono flex items-center gap-3 shadow-sm">
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block"></span> Critical</span>
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span> High</span>
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block"></span> Moderate</span>
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span> Routine</span>
      </div>
    </div>
  );
}
