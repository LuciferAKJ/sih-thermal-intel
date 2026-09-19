import React from 'react';

/**
 * Dossier Block 4: Geospatial Context & Physical Buffer
 * Integrates ESA WorldCover 10m land-cover and OpenStreetMap infrastructure matches.
 */
export default function GeospatialContextBlock({ geospatial }) {
  if (!geospatial) return null;

  return (
    <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-3">
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700/60 pb-2">
        <div className="flex items-center gap-2">
          <span className="text-emerald-500 font-bold text-sm">🌍</span>
          <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
            Geospatial Context &bull; Land-Cover &amp; Infrastructure
          </h4>
        </div>
        <span className="font-mono text-[10px] text-slate-500 dark:text-slate-400">
          ESA WorldCover + OSM Overpass
        </span>
      </div>

      <div className="space-y-2 text-xs">
        {/* Land-Cover Resolution */}
        <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
          <div>
            <span className="text-[10px] font-mono uppercase text-slate-500 block">ESA WorldCover 10m Classification</span>
            <span className="font-bold text-slate-900 dark:text-white text-xs">
              {geospatial.land_cover_class}
            </span>
          </div>
          <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-mono text-[10px] font-bold">
            10m Resolution
          </span>
        </div>

        {/* Facility Match */}
        <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-mono uppercase text-slate-500">Nearest Cadastral Facility Match</span>
            <span className="text-[10px] font-mono font-bold text-blue-600 dark:text-blue-400">
              {geospatial.distance_to_facility_m}m proximity
            </span>
          </div>
          <div className="font-bold text-slate-900 dark:text-white mt-0.5">
            {geospatial.facility_name}
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">
            Type: {geospatial.facility_type} &bull; Nearest Arterial: {geospatial.nearest_transport}
          </span>
        </div>

        {/* Surface Wind & Downwind Threat Corridor */}
        {geospatial.surface_wind && (
          <div className="p-2.5 rounded-lg bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 flex flex-wrap items-center justify-between gap-2 text-blue-900 dark:text-blue-300 font-mono text-[11px]">
            <div>
              <span>Surface Wind: <strong>{geospatial.surface_wind.direction} at {geospatial.surface_wind.speed_kmh} km/h</strong></span>
              <span className="ml-2">Downwind Threat: <strong>{geospatial.surface_wind.threat_corridor_km} km</strong></span>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-200 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
              {geospatial.surface_wind.impact_zone}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
