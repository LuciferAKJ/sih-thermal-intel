import React from 'react';

/**
 * Dossier Block 3: Persistence Baseline Timeline
 * Renders 60-day historical observation timeline, dot matrix, and anomaly ratio.
 */
export default function PersistenceBlock({ persistence }) {
  if (!persistence) return null;

  return (
    <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-3">
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700/60 pb-2">
        <div className="flex items-center gap-2">
          <span className="text-purple-500 font-bold text-sm">📈</span>
          <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
            Temporal Persistence &bull; 60-Day Baseline
          </h4>
        </div>
        <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
          {persistence.persistence_score_pct}% Persistence Score
        </span>
      </div>

      {/* Dot Strip Matrix */}
      <div>
        <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400 mb-1">
          <span>60-Day Overpass Temporal Samples (Chronological &rarr;)</span>
          <span>{persistence.observations_in_window} / {persistence.window_days} passes positive</span>
        </div>

        <div className="flex items-center gap-1.5 p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-x-auto">
          {persistence.dot_history?.map((active, i) => (
            <div
              key={i}
              title={`Overpass pass #${i + 1}: ${active ? 'Thermal Hotspot Detected' : 'Nominal Background'}`}
              className={`w-3.5 h-3.5 rounded-full transition-transform hover:scale-125 ${
                active ? 'bg-orange-500 shadow-xs ring-1 ring-orange-400' : 'bg-slate-200 dark:bg-slate-700'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Metrics & Baseline Comparison */}
      <div className="grid grid-cols-2 gap-3 text-xs">
        <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <span className="text-[10px] uppercase font-mono text-slate-500 block">Normal Seasonal Baseline</span>
          <div className="font-mono font-bold text-slate-800 dark:text-slate-200 mt-0.5">
            {persistence.normal_seasonal_range}
          </div>
          <span className="text-[10px] text-slate-400">Historical 5-year climatology</span>
        </div>

        <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <span className="text-[10px] uppercase font-mono text-slate-500 block">Anomaly Deviation</span>
          <div className="font-mono font-bold text-orange-600 dark:text-orange-400 mt-0.5">
            {persistence.anomaly_ratio}
          </div>
          <span className="text-[10px] text-slate-400">Statistical z-score outlier</span>
        </div>
      </div>

      {/* Analytical Verdict */}
      <div className="p-2.5 rounded-lg bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs italic text-slate-700 dark:text-slate-300">
        &ldquo;{persistence.verdict}&rdquo;
      </div>
    </div>
  );
}
