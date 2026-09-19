import React, { useState } from 'react';

/**
 * Analyst Verification Workflow Block
 * Allows on-duty intelligence analysts to Confirm or Flag AI predictions with notes.
 */
export default function AnalystVerification({ incidentId, initialVerification, onVerify }) {
  const [status, setStatus] = useState(initialVerification?.status || 'UNVERIFIED');
  const [notes, setNotes] = useState(initialVerification?.notes || '');
  const [submitting, setSubmitting] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleAction = async (newStatus) => {
    setSubmitting(true);
    setStatus(newStatus);
    if (onVerify) {
      await onVerify(incidentId, { status: newStatus, notes });
    }
    setSubmitting(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 4000);
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-3">
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700/60 pb-2">
        <div className="flex items-center gap-2">
          <span className="text-amber-500 font-bold text-sm">🛡️</span>
          <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
            Analyst Verification Protocol
          </h4>
        </div>
        <span
          className={`px-2.5 py-0.5 rounded text-xs font-mono font-bold ${
            status === 'CONFIRMED'
              ? 'bg-emerald-600 text-white'
              : status === 'FLAGGED'
              ? 'bg-red-600 text-white'
              : 'bg-amber-500 text-white'
          }`}
        >
          {status}
        </span>
      </div>

      <div className="space-y-2">
        <label className="text-[11px] font-mono text-slate-600 dark:text-slate-400 block">
          Analyst Verification Memo / Ground Recon Note:
        </label>
        <textarea
          rows={2}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add analyst verification notes (e.g., Cross-checked against State Industrial Cadastre. Valid flaring schedule confirmed)..."
          className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 outline-hidden"
        />

        <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
          <div className="flex gap-2">
            <button
              onClick={() => handleAction('CONFIRMED')}
              disabled={submitting}
              className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 transition-transform active:scale-98 disabled:opacity-50"
            >
              <span>✔</span> Confirm Verification
            </button>
            <button
              onClick={() => handleAction('FLAGGED')}
              disabled={submitting}
              className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 transition-transform active:scale-98 disabled:opacity-50"
            >
              <span>🚩</span> Flag for Review
            </button>
          </div>

          {savedSuccess && (
            <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 animate-fade-in">
              ✅ Verification Logged to Command Bus
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
