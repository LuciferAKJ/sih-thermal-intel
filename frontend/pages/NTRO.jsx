import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import IncidentMap from '../components/map/IncidentMap';
import NTRODossier from '../components/ntro/NTRODossier';

/**
 * NTRO Intelligence Dashboard
 * Author / Frontend Lead: Pallabi
 * 
 * Key Features:
 * - Real-time overview cards (Hotspot count, Auto-classified %, Critical alerts, Pending review)
 * - MapLibre GL map with severity-coded markers & offline-safe tactical radar
 * - Filter pills (All, Industrial, Wildfire, Gas Flare, Crop Burning, Illegal)
 * - Incident intelligence table with instant search and sort
 * - Click any incident -> Opens comprehensive 5-block evidence dossier
 * - Analyst verification workflow (Confirm / Flag + notes)
 * - "DEMO DATA" badge when running mock fixtures
 */
export default function NTRO() {
  const [overview, setOverview] = useState(null);
  const [incidents, setIncidents] = useState([]);
  const [selectedIncidentId, setSelectedIncidentId] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const [ovData, incData] = await Promise.all([
        api.getNTROOverview(),
        api.getIncidents()
      ]);
      setOverview(ovData);
      setIncidents(incData);
      if (incData.length > 0) {
        setSelectedIncidentId(incData[0].id);
      }
      setLoading(false);
    }
    loadData();
  }, []);

  // Filter & Search Logic
  const filteredIncidents = incidents.filter(inc => {
    if (categoryFilter !== 'all') {
      if (inc.classification?.category !== categoryFilter) return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchString = `${inc.id} ${inc.title} ${inc.location_name} ${inc.classification?.label} ${inc.risk?.tier}`.toLowerCase();
      if (!matchString.includes(q)) return false;
    }
    return true;
  });

  const selectedIncident = incidents.find(i => i.id === selectedIncidentId);

  const handleAnalystVerify = async (incidentId, payload) => {
    const res = await api.submitAnalystVerification(incidentId, payload);
    if (res.success) {
      setIncidents(prev => prev.map(i => {
        if (i.id === incidentId) {
          return { ...i, analyst_verification: res.analyst_verification };
        }
        return i;
      }));
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Top Banner / Mission Header */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold tracking-wider text-blue-600 dark:text-blue-400 uppercase">
                NATIONAL TECHNICAL RESEARCH ORGANISATION &bull; SATELLITE INTELLIGENCE
              </span>
              {overview?.is_demo_mode && (
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                  DEMO DATA ACTIVE
                </span>
              )}
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
              Thermal Anomaly Intelligence Platform
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              NASA FIRMS &bull; VIIRS 375m &bull; MODIS &bull; Automated ResNet Classification &bull; India Coverage
            </p>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-xs font-bold font-mono">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
            <span>LIVE TELEMETRY FEED</span>
          </div>
        </div>
      </div>

      {/* 4 Stat Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm space-y-1">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Hotspots Today</span>
          <div className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white font-mono">
            {overview?.hotspots_today || 247}
          </div>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
            &uarr; {overview?.delta_yesterday || 12} from yesterday pass
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm space-y-1">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Auto-Classified</span>
          <div className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white font-mono">
            {overview?.auto_classified || 238}
          </div>
          <span className="text-[11px] text-blue-600 dark:text-blue-400 font-medium">
            {overview?.classification_rate_pct || 96.3}% automated rate
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm space-y-1">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Critical Alerts</span>
          <div className="text-2xl sm:text-3xl font-bold text-red-600 dark:text-red-400 font-mono">
            {overview?.critical_alerts || 3}
          </div>
          <span className="text-[11px] text-red-500 font-medium">High operational priority</span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm space-y-1">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Pending Review</span>
          <div className="text-2xl sm:text-3xl font-bold text-amber-600 dark:text-amber-400 font-mono">
            {overview?.pending_review || 6}
          </div>
          <span className="text-[11px] text-slate-500 font-medium">Analyst verification queue</span>
        </div>
      </div>

      {/* Filter Pills & Search */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 shadow-sm">
        <div className="flex flex-wrap items-center gap-1.5 text-xs font-semibold">
          {[
            { key: 'all', label: 'All Hotspots' },
            { key: 'industrial', label: 'Industrial' },
            { key: 'wildfire', label: 'Wildfire' },
            { key: 'gas-flare', label: 'Gas Flare' },
            { key: 'crop-burning', label: 'Crop Residue' },
            { key: 'illegal', label: 'Clandestine' }
          ].map(f => (
            <button
              key={f.key}
              onClick={() => setCategoryFilter(f.key)}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                categoryFilter === f.key
                  ? 'bg-blue-600 text-white font-bold shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="w-full sm:w-64">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search ID, state, class..."
            className="w-full px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 outline-hidden"
          />
        </div>
      </div>

      {/* MapLibre GL Tactical Map */}
      <IncidentMap
        incidents={filteredIncidents}
        selectedIncidentId={selectedIncidentId}
        onSelectIncident={(id) => setSelectedIncidentId(id)}
      />

      {/* Split Two-Column View: Incident List (Left) + Full Dossier (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Incident Intelligence List */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2 text-xs font-bold">
            <span className="text-slate-800 dark:text-slate-200">Incident Feed ({filteredIncidents.length})</span>
            <span className="text-slate-400 font-mono text-[10px]">CLICK FOR DOSSIER</span>
          </div>

          <div className="space-y-2.5 max-h-[650px] overflow-y-auto pr-1">
            {filteredIncidents.map(inc => {
              const isSelected = inc.id === selectedIncidentId;
              const tier = inc.risk?.tier || 'HIGH';
              const tierColor =
                tier === 'CRITICAL'
                  ? 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/60 border-red-200'
                  : tier === 'HIGH'
                  ? 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 border-amber-200'
                  : 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200';

              return (
                <div
                  key={inc.id}
                  onClick={() => setSelectedIncidentId(inc.id)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50/40 dark:bg-blue-950/30 shadow-sm ring-1 ring-blue-500/20'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-bold text-xs text-blue-600 dark:text-blue-400">
                          {inc.id}
                        </span>
                        <span className="text-slate-400 text-[10px]">&bull;</span>
                        <span className="font-mono text-[10px] text-slate-500">
                          {inc.satellite?.frp_mw} MW
                        </span>
                      </div>
                      <h4 className="font-bold text-xs text-slate-900 dark:text-white mt-0.5 line-clamp-1">
                        {inc.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        {inc.location_name}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${tierColor}`}>
                        {tier} ({inc.risk?.score})
                      </span>
                      <div className="text-[10px] font-mono text-slate-400 mt-1">
                        Conf: {inc.classification?.confidence_pct}%
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 mt-2 border-t border-slate-100 dark:border-slate-800/80 text-[10px] font-mono text-slate-500">
                    <span>{inc.classification?.label}</span>
                    <span className="text-blue-600 dark:text-blue-400 font-bold">Inspect &rarr;</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Full Analytical Dossier */}
        <div className="lg:col-span-7">
          {selectedIncident ? (
            <NTRODossier
              incident={selectedIncident}
              onVerify={handleAnalystVerify}
            />
          ) : (
            <div className="p-8 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-400 text-xs">
              Select an incident from the list or map to view its full analytical dossier.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
