import React from 'react';

/**
 * Dossier Block 5: Multi-Criteria Risk Score & Contributing Factors
 * 
 * STRICT ARCHITECTURAL CONSTRAINTS:
 * - Risk is an operational composite severity score (0 to 100), NEVER a probability.
 * - Explains contributing factors so command operators understand WHY an incident has this score.
 */
export default function RiskScoreBlock({ risk }) {
  if (!risk) return null;

  const getTierBadge = (tier, score) => {
    switch (tier) {
      case 'CRITICAL':
        return 'bg-red-600 text-white';
      case 'HIGH':
        return 'bg-amber-600 text-white';
      case 'MODERATE':
        return 'bg-blue-600 text-white';
      default:
        return 'bg-emerald-600 text-white';
    }
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-3">
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700/60 pb-2">
        <div className="flex items-center gap-2">
          <span className="text-red-500 font-bold text-sm">🎯</span>
          <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
            Multi-Criteria Risk Score (0–100 Scale)
          </h4>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-slate-500 uppercase">Composite Index</span>
          <span className={`px-2.5 py-0.5 rounded text-xs font-black font-mono ${getTierBadge(risk.tier, risk.score)}`}>
            {risk.tier} &bull; {risk.score} / 100
          </span>
        </div>
      </div>

      {/* Visual Risk Gauge Progress Bar */}
      <div>
        <div className="flex justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400 mb-1">
          <span>Priority Severity Gauge</span>
          <span>{risk.score >= 70 ? 'Immediate Operational Priority' : 'Standard Monitoring Protocol'}</span>
        </div>
        <div className="w-full h-3 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ${
              risk.score >= 70
                ? 'bg-gradient-to-r from-amber-500 to-red-600'
                : risk.score >= 40
                ? 'bg-amber-500'
                : 'bg-emerald-500'
            }`}
            style={{ width: `${risk.score}%` }}
          />
        </div>
      </div>

      {/* Contributing Factors Breakdown */}
      <div>
        <span className="text-[10px] uppercase font-mono text-slate-500 font-bold block mb-1.5">
          Contributing Factors Breakdown (Weighted Analysis)
        </span>
        <div className="space-y-1.5">
          {risk.contributing_factors?.map((item, idx) => (
            <div
              key={idx}
              className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs"
            >
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold">
                  {item.weight_pct}% wt
                </span>
                <span className="text-slate-800 dark:text-slate-200 font-medium">
                  {item.factor}
                </span>
              </div>
              <span className={`font-mono text-xs font-bold ${item.impact.startsWith('+') ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                {item.impact}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
