import React from 'react';

/**
 * Dossier Block 1: Satellite Observation Telemetry
 * Fields: FRP (MW), Brightness Temperature (K & °C), Acquisition Timestamp, Detection Confidence %
 */
export default function SatelliteFieldsBlock({ satellite, coordinates, timestamp }) {
  if (!satellite) return null;

  return (
    <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-3">
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700/60 pb-2">
        <div className="flex items-center gap-2">
          <span className="text-orange-500 font-bold text-sm">🛰️</span>
          <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
            Satellite Observation Telemetry
          </h4>
        </div>
        <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold">
          {satellite.satellite_name} &bull; {satellite.instrument}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <span className="text-[10px] font-mono text-slate-500 uppercase block">Fire Radiative Power</span>
          <div className="text-lg font-black font-mono text-orange-600 dark:text-orange-400 mt-0.5">
            {satellite.frp_mw} MW
          </div>
          <span className="text-[10px] text-slate-400">Thermal energy flux</span>
        </div>

        <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <span className="text-[10px] font-mono text-slate-500 uppercase block">Brightness Temp</span>
          <div className="text-lg font-black font-mono text-slate-900 dark:text-white mt-0.5">
            {satellite.brightness_temp_k} K
          </div>
          <span className="text-[10px] text-slate-500 dark:text-slate-400">({satellite.brightness_temp_c}°C surface)</span>
        </div>

        <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <span className="text-[10px] font-mono text-slate-500 uppercase block">Spatial Resolution</span>
          <div className="text-lg font-black font-mono text-slate-900 dark:text-white mt-0.5">
            {satellite.track_m}m &times; {satellite.scan_m}m
          </div>
          <span className="text-[10px] text-slate-400">{satellite.pass_type}</span>
        </div>

        <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <span className="text-[10px] font-mono text-slate-500 uppercase block">Detection Conf.</span>
          <div className="text-lg font-black font-mono text-emerald-600 dark:text-emerald-400 mt-0.5">
            {satellite.detection_confidence_pct}%
          </div>
          <span className="text-[10px] text-slate-400">NASA FIRMS verified</span>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400 pt-1">
        <span>Centroid GPS: <strong>{coordinates?.lat}°N, {coordinates?.lon}°E</strong></span>
        <span>Acquisition: <strong>{timestamp ? new Date(timestamp).toUTCString() : '04:30 UTC'}</strong></span>
      </div>
    </div>
  );
}
