/**
 * Unified API Client for FireSense
 * Maintainer: Priyanshu | Consumer: Pallabi (NTRO)
 * 
 * Complies with Aditya's frozen API schema and Alembic migrations.
 * Falls back to local high-fidelity fixtures if backend is offline.
 */

import { NTRO_OVERVIEW_METRICS, NTRO_INCIDENTS_FIXTURE } from '../fixtures/ntro_fixtures.js';

let _localIncidents = [...NTRO_INCIDENTS_FIXTURE];
let _isDemoMode = true;

export const api = {
  // Check demo mode
  isDemoMode: () => _isDemoMode,
  setDemoMode: (val) => { _isDemoMode = !!val; },

  // Get NTRO Overview Metrics
  getNTROOverview: async () => {
    try {
      const res = await fetch('/api/stats');
      if (res.ok) {
        const stats = await res.json();
        return {
          ...NTRO_OVERVIEW_METRICS,
          hotspots_today: stats.hotspots_analyzed || NTRO_OVERVIEW_METRICS.hotspots_today,
          auto_classified: stats.auto_classified || NTRO_OVERVIEW_METRICS.auto_classified,
          classification_rate_pct: stats.classification_rate || NTRO_OVERVIEW_METRICS.classification_rate_pct,
          critical_alerts: stats.critical_alerts || NTRO_OVERVIEW_METRICS.critical_alerts,
          is_demo_mode: false
        };
      }
    } catch {
      // Offline / demo fallback
    }
    return NTRO_OVERVIEW_METRICS;
  },

  // Get All Incidents
  getIncidents: async () => {
    try {
      const res = await fetch('/api/incidents');
      if (res.ok) {
        const data = await res.json();
        if (data.incidents && data.incidents.length > 0) {
          // Merge server state with fixture rich dossier
          return _localIncidents.map(fixture => {
            const serverMatch = data.incidents.find(i => i.id === fixture.id);
            if (serverMatch) {
              return {
                ...fixture,
                status: serverMatch.status || fixture.status,
                risk: { ...fixture.risk, score: serverMatch.risk_score || fixture.risk.score }
              };
            }
            return fixture;
          });
        }
      }
    } catch {
      // Fallback
    }
    return _localIncidents;
  },

  // Get Single Incident Dossier
  getIncidentDossier: async (id) => {
    const inc = _localIncidents.find(i => i.id === id);
    if (inc) return inc;
    try {
      const res = await fetch(`/api/incident/${id}`);
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback
    }
    return _localIncidents[0];
  },

  // Submit Analyst Verification (Confirm / Flag with note)
  submitAnalystVerification: async (incidentId, { status, notes, analystName = "Analyst NTRO-08 (P. Pandi)" }) => {
    const timestamp = new Date().toISOString();
    
    // Update in local cache
    const idx = _localIncidents.findIndex(i => i.id === incidentId);
    if (idx !== -1) {
      _localIncidents[idx] = {
        ..._localIncidents[idx],
        analyst_verification: {
          status,
          verified_by: analystName,
          verified_at: timestamp,
          notes
        }
      };
    }

    // Attempt backend sync
    try {
      await fetch(`/api/incident/${incidentId}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: status === 'CONFIRMED' ? 'VERIFIED' : 'INVESTIGATING',
          analyst_notes: notes,
          analyst: analystName
        })
      });
    } catch {
      // Offline fallback succeeded locally
    }

    return {
      success: true,
      incidentId,
      status,
      timestamp,
      analyst_verification: _localIncidents[idx]?.analyst_verification
    };
  }
};
