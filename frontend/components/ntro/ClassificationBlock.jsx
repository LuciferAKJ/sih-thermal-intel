import React from 'react';

/**
 * Dossier Block 2: AI Classification & Explainability Dossier
 * Shows: Target class, confidence score %, model version, positive evidence, and counter-evidence.
 */
export default function ClassificationBlock({ classification }) {
  if (!classification) return null;

  return (
    <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-3">
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700/60 pb-2">
        <div className="flex items-center gap-2">
          <span className="text-blue-500 font-bold text-sm">🧠</span>
          <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
            AI Classification &amp; Explainability
          </h4>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
            {classification.model_version}
          </span>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-black font-mono bg-blue-600 text-white">
            {classification.confidence_pct}% CONFIDENCE
          </span>
        </div>
      </div>

      <div>
        <span className="text-[10px] uppercase font-mono text-slate-500 font-bold block">Assigned Taxonomy</span>
        <div className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
          {classification.label}
        </div>
      </div>

      {/* Evidence & Counter-Evidence Two-Column Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
        {/* Supporting Evidence */}
        <div className="p-3 rounded-lg bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/60 space-y-2">
          <span className="text-[11px] font-mono font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5 uppercase">
            <span>✔</span> Supporting Telemetry Evidence
          </span>
          <div className="space-y-1.5">
            {classification.evidence?.map((item, idx) => (
              <div key={idx} className="text-xs text-slate-700 dark:text-slate-300 flex items-start gap-1.5 leading-tight">
                <span className="text-emerald-600 dark:text-emerald-400 font-bold mt-0.5">•</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Counter-Evidence / Caveats */}
        <div className="p-3 rounded-lg bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 space-y-2">
          <span className="text-[11px] font-mono font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1.5 uppercase">
            <span>⚠</span> Counter-Evidence &amp; Threat Flags
          </span>
          <div className="space-y-1.5">
            {classification.counter_evidence?.length > 0 ? (
              classification.counter_evidence.map((item, idx) => (
                <div key={idx} className="text-xs text-slate-700 dark:text-slate-300 flex items-start gap-1.5 leading-tight">
                  <span className="text-amber-600 dark:text-amber-400 font-bold mt-0.5">•</span>
                  <span>{item}</span>
                </div>
              ))
            ) : (
              <div className="text-xs text-slate-500 italic py-2">
                No contradictory telemetry flags observed. Classification bounds clean.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
