import React from 'react';
import SatelliteFieldsBlock from './SatelliteFieldsBlock';
import ClassificationBlock from './ClassificationBlock';
import PersistenceBlock from './PersistenceBlock';
import GeospatialContextBlock from './GeospatialContextBlock';
import RiskScoreBlock from './RiskScoreBlock';
import AnalystVerification from './AnalystVerification';

/**
 * Composite NTRO Intelligence Incident Dossier
 * Integrates all 5 labeled analytical blocks + Analyst Verification
 */
export default function NTRODossier({ incident, onClose, onVerify }) {
  if (!incident) return null;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl overflow-hidden space-y-4 p-5 sm:p-6 transition-all animate-fade-in">
      {/* Dossier Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400">
              {incident.id}
            </span>
            <span className="text-slate-300 dark:text-slate-700">&bull;</span>
            <span className="font-mono text-xs text-slate-500 dark:text-slate-400">
              {incident.timestamp_utc ? new Date(incident.timestamp_utc).toLocaleString('en-IN') : '04:30 UTC'}
            </span>
            <span className="text-slate-300 dark:text-slate-700">&bull;</span>
            <span className="font-mono text-xs text-slate-500 dark:text-slate-400">
              {incident.satellite_source}
            </span>
          </div>
          <h3 className="text-xl font-black text-slate-900 dark:text-white mt-1">
            {incident.title}
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            {incident.location_name} &bull; {incident.state}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold flex items-center gap-1"
            >
              <span>✕</span> Close Dossier
            </button>
          )}
        </div>
      </div>

      {/* 5 Distinct Labeled Blocks */}
      <div className="space-y-4">
        {/* Block 1: Satellite Fields */}
        <SatelliteFieldsBlock
          satellite={incident.satellite}
          coordinates={incident.coordinates}
          timestamp={incident.timestamp_utc}
        />

        {/* Block 2: AI Classification & Evidence */}
        <ClassificationBlock classification={incident.classification} />

        {/* Block 3: Persistence Baseline */}
        <PersistenceBlock persistence={incident.persistence} />

        {/* Block 4: Geospatial Context */}
        <GeospatialContextBlock geospatial={incident.geospatial} />

        {/* Block 5: Risk Score */}
        <RiskScoreBlock risk={incident.risk} />

        {/* Analyst Verification Protocol */}
        <AnalystVerification
          incidentId={incident.id}
          initialVerification={incident.analyst_verification}
          onVerify={onVerify}
        />
      </div>
    </div>
  );
}
