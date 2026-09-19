// FireSense Portal Modules - SIH26162
// Canonical Incident Lifecycle Tracker, Citizen Reports & Evacuation Mapping

// ===================== Canonical Incident Lifecycle State Machine =====================
const STATUS_FLOW = [
    'DETECTED', 'CLASSIFIED', 'ASSESSED', 'ALERTED',
    'ACKNOWLEDGED', 'EN_ROUTE', 'ARRIVED', 'CONTAINED', 'RESOLVED'
];

const STATUS_COLORS = {
    'DETECTED': 'bg-slate-500',
    'CLASSIFIED': 'bg-blue-500',
    'ASSESSED': 'bg-indigo-500',
    'ALERTED': 'bg-amber-500',
    'ACKNOWLEDGED': 'bg-purple-600',
    'EN_ROUTE': 'bg-cyan-600',
    'ARRIVED': 'bg-teal-600',
    'CONTAINED': 'bg-orange-600',
    'RESOLVED': 'bg-emerald-600'
};

const CANONICAL_TRANSITIONS = {
    'DETECTED': ['CLASSIFIED'],
    'CLASSIFIED': ['ASSESSED'],
    'ASSESSED': ['ALERTED'],
    'ALERTED': ['ACKNOWLEDGED'],
    'ACKNOWLEDGED': ['EN_ROUTE', 'RESOLVED'],
    'EN_ROUTE': ['ARRIVED'],
    'ARRIVED': ['CONTAINED'],
    'CONTAINED': ['RESOLVED'],
    'RESOLVED': []
};

async function loadIncidentTracker() {
    const listEl = document.getElementById('incident-tracker-list');
    if (!listEl) return;
    try {
        const resp = await apiFetch('/api/incidents');
        const incidents = resp.incidents || [];
        if (!incidents.length) {
            listEl.innerHTML = `
                <div class="p-6 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-lg space-y-2">
                    <p class="text-xs text-slate-500">Database has no active incidents.</p>
                    <button onclick="quickSeedDemo()" class="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-bold">
                        Seed Curated Demo Scenarios
                    </button>
                </div>`;
            return;
        }

        listEl.innerHTML = incidents.map(inc => {
            const st = (inc.status || 'DETECTED').toUpperCase();
            const idx = STATUS_FLOW.indexOf(st);
            const progress = STATUS_FLOW.map((s, i) =>
                `<div class="flex-1 h-1.5 rounded-full ${i <= idx ? (STATUS_COLORS[s] || 'bg-slate-500') : 'bg-slate-200 dark:bg-slate-700'}" title="${s}"></div>`).join('');
            
            const nextStates = CANONICAL_TRANSITIONS[st] || [];
            const advanceBtn = nextStates.length > 0 ? `
                <button onclick="advanceIncident('${inc.id}', '${nextStates[0]}')" class="px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] flex items-center gap-1">
                    <span>Advance &rarr; ${nextStates[0]}</span>
                </button>
            ` : `<span class="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">TERMINAL (RESOLVED)</span>`;

            const alertBtn = (st === 'ASSESSED' || st === 'ALERTED') ? `
                <button onclick="dispatchSimulatedAlert('${inc.id}')" class="px-2.5 py-1 rounded bg-amber-500 hover:bg-amber-600 text-white font-bold text-[11px] flex items-center gap-1">
                    <span>Simulated Alert</span>
                </button>
            ` : '';

            return `
            <div class="p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-xs space-y-2.5">
                <div class="flex flex-wrap items-center justify-between gap-2">
                    <div>
                        <span class="font-mono font-bold text-slate-800 dark:text-slate-200">${inc.id}</span>
                        <span class="text-slate-500 dark:text-slate-400 ml-2">${inc.classification || 'Thermal Anomaly'} &bull; ${Number(inc.latitude).toFixed(3)}&deg;N, ${Number(inc.longitude).toFixed(3)}&deg;E</span>
                    </div>
                    <span class="px-2 py-0.5 rounded text-[10px] font-bold font-mono text-white ${STATUS_COLORS[st] || 'bg-slate-500'}">${st}</span>
                </div>
                <div class="flex gap-1">${progress}</div>
                <div class="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
                    <div class="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                        Risk Score: <strong class="text-slate-900 dark:text-white">${inc.risk_score != null ? Number(inc.risk_score).toFixed(1) : '–'}</strong>/100 &bull; Severity: <strong>${inc.severity || '–'}</strong>
                    </div>
                    <div class="flex items-center gap-1.5">
                        ${alertBtn}
                        ${advanceBtn}
                    </div>
                </div>
            </div>`;
        }).join('');
    } catch (err) {
        listEl.innerHTML = `<div class="text-xs text-red-500 py-3 text-center">Failed to load incident tracker: ${err.message}</div>`;
    }
}

async function dispatchSimulatedAlert(id) {
    try {
        showToast('Dispatching simulated alert...', 'info');
        const resp = await apiFetch(`/api/incidents/${id}/alert`, { method: 'POST' });
        showToast(`🚨 SIMULATED DISPATCH: Priority alert generated for ${id} (is_simulated: true)`, 'success');
        await loadIncidentTracker();
        if (typeof renderCmdIncidents === 'function') renderCmdIncidents();
    } catch (err) {
        showToast(`Simulated dispatch error: ${err.message}`, 'error');
    }
}

async function advanceIncident(id, targetStatus) {
    try {
        showToast(`Transitioning ${id} &rarr; ${targetStatus}...`, 'info');
        const resp = await apiFetch(`/api/incidents/${id}/status`, {
            method: 'PATCH',
            body: JSON.stringify({
                status: targetStatus,
                note: `Lifecycle advanced to ${targetStatus} via Incident Command Console`
            })
        });
        showToast(`✓ Incident ${id} transitioned to ${targetStatus}`, 'success');
        await loadIncidentTracker();
        if (typeof renderCmdIncidents === 'function') renderCmdIncidents();
        if (typeof renderNtroIncidents === 'function') renderNtroIncidents();
        if (typeof renderResponderView === 'function') renderResponderView();
    } catch (err) {
        showToast(`Status transition rejected: ${err.message}`, 'error');
    }
}

// ===================== Citizen Reports (Crowdsourcing) =====================
let reportGps = null;

function attachGps() {
    const label = document.getElementById('gps-label');
    if (!navigator.geolocation) {
        if (label) label.textContent = 'GPS unavailable';
        return;
    }
    if (label) label.textContent = 'Locating...';
    navigator.geolocation.getCurrentPosition(
        pos => {
            reportGps = { lat: +pos.coords.latitude.toFixed(4), lon: +pos.coords.longitude.toFixed(4) };
            if (label) label.textContent = `GPS: ${reportGps.lat}°, ${reportGps.lon}°`;
        },
        () => {
            if (label) label.textContent = 'GPS denied';
        },
        { timeout: 8000 }
    );
}

async function getCitizenReports() {
    try {
        const resp = await apiFetch('/api/reports');
        return resp.reports || [];
    } catch {
        try {
            return JSON.parse(localStorage.getItem('citizenReports') || '[]');
        } catch {
            return [];
        }
    }
}

async function submitCitizenReport() {
    const typeEl = document.getElementById('report-type');
    const locEl = document.getElementById('report-location');
    const notesEl = document.getElementById('report-notes');
    const confirmEl = document.getElementById('report-confirmation');

    const type = typeEl ? typeEl.value : 'Smoke plume visible';
    const location = locEl ? locEl.value.trim() : '';
    const notes = notesEl ? notesEl.value.trim() : '';

    if (!location) {
        if (confirmEl) confirmEl.textContent = 'Please enter an area or landmark.';
        return;
    }

    const report = {
        type,
        location,
        notes,
        gps: reportGps,
        time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
    };

    try {
        const resp = await apiFetch('/api/reports/submit', {
            method: 'POST',
            body: JSON.stringify(report)
        });
        showToast(`✅ Citizen report ${resp.report?.id || 'submitted'} recorded on server`, 'success');
    } catch {
        // Local offline fallback
        const local = (() => { try { return JSON.parse(localStorage.getItem('citizenReports') || '[]'); } catch { return []; } })();
        report.id = `RPT-${Date.now().toString().slice(-6)}`;
        report.status = 'SUBMITTED';
        local.unshift(report);
        localStorage.setItem('citizenReports', JSON.stringify(local.slice(0, 50)));
        showToast(`Report saved locally in offline buffer`, 'info');
    }

    if (locEl) locEl.value = '';
    if (notesEl) notesEl.value = '';
    reportGps = null;
    const gpsLabel = document.getElementById('gps-label');
    if (gpsLabel) gpsLabel.textContent = 'Attach GPS';
    if (confirmEl) {
        confirmEl.textContent = '✅ Report submitted — visible in Command inbox.';
        setTimeout(() => { confirmEl.textContent = ''; }, 6000);
    }

    await renderCitizenReportsFeed();
    if (window.lucide) lucide.createIcons();
}

async function renderCitizenReportsFeed() {
    const feed = document.getElementById('citizen-reports-feed');
    if (!feed) return;
    const reports = await getCitizenReports();
    const countEl = document.getElementById('citizen-reports-count');
    if (countEl) countEl.textContent = `${reports.filter(r => r.status === 'SUBMITTED').length} new`;
    if (!reports.length) {
        feed.innerHTML = `<div class="text-xs text-slate-400 py-3 text-center border border-dashed border-slate-200 dark:border-slate-700 rounded-lg">No citizen reports yet. Reports from the Citizen Services portal appear here.</div>`;
        return;
    }

    feed.innerHTML = reports.slice(0, 8).map(r => `
        <div class="p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-xs space-y-1">
            <div class="flex items-center justify-between">
                <span class="font-mono font-bold text-slate-800 dark:text-slate-200">${r.id} &bull; ${r.type}</span>
                <span class="px-2 py-0.5 rounded text-[10px] font-bold font-mono ${r.status === 'VERIFIED' ? 'bg-emerald-600 text-white' : 'bg-amber-500 text-white'}">${r.status}</span>
            </div>
            <div class="text-[11px] text-slate-600 dark:text-slate-300">
                ${r.time} &bull; ${r.location}${r.gps ? ` &bull; ${r.gps.lat}&deg;N ${r.gps.lon}&deg;E` : ''}
            </div>
            ${r.notes ? `<div class="text-[11px] text-slate-500 dark:text-slate-400 italic">${r.notes}</div>` : ''}
            ${r.status === 'SUBMITTED' ? `<button onclick="verifyCitizenReport('${r.id}')" class="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] mt-1">Cross-check with FIRMS &amp; Verify</button>` : ''}
        </div>`).join('');
}

async function verifyCitizenReport(id) {
    try {
        const resp = await apiFetch('/api/reports/verify', {
            method: 'POST',
            body: JSON.stringify({ id })
        });
        showToast(`✅ ${id} verified against satellite FIRMS context`, 'success');
    } catch {
        const local = (() => { try { return JSON.parse(localStorage.getItem('citizenReports') || '[]'); } catch { return []; } })();
        const rep = local.find(r => r.id === id);
        if (rep) rep.status = 'VERIFIED';
        localStorage.setItem('citizenReports', JSON.stringify(local));
        showToast(`${id} verified locally`, 'info');
    }
    await renderCitizenReportsFeed();
}

// ===================== Public Alerts & Citizen Evacuation Map =====================
let citizenMap = null;

async function loadPublicAlertsFeed() {
    const listContainer = document.getElementById('txt-alerts-heading')?.parentElement?.querySelector('.space-y-2\\.5');
    if (!listContainer) return;
    try {
        const resp = await apiFetch('/public/alerts?limit=5');
        const alerts = resp.alerts || [];
        if (!alerts.length) {
            listContainer.innerHTML = `<div class="text-xs text-slate-400 py-3 text-center">No active simulated public advisories.</div>`;
            return;
        }

        listContainer.innerHTML = alerts.map(a => {
            const sev = a.severity || 'MEDIUM';
            const colorClass = sev === 'CRITICAL' ? 'bg-red-50/60 dark:bg-red-950/30 border-red-100 dark:border-red-900/40 text-red-700 dark:text-red-300' :
                sev === 'HIGH' ? 'bg-amber-50/60 dark:bg-amber-950/30 border-amber-100 dark:border-amber-900/40 text-amber-700 dark:text-amber-300' :
                'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300';
            const badgeClass = sev === 'CRITICAL' ? 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300' :
                sev === 'HIGH' ? 'bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300' :
                'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300';
            
            const timeStr = a.created_at ? new Date(a.created_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : 'Recent';
            return `
            <div class="flex items-center justify-between gap-3 p-2.5 rounded-lg border ${colorClass}">
                <div class="flex items-center gap-2 font-medium">
                    <span class="font-mono text-[11px] opacity-70">${timeStr}</span>
                    <span>${a.message}</span>
                </div>
                <div class="flex items-center gap-1.5 shrink-0">
                    <span class="px-1.5 py-0.5 rounded text-[9px] font-bold font-mono bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300">SIMULATED</span>
                    <span class="px-2 py-0.5 rounded font-mono text-[10px] font-bold ${badgeClass}">${sev}</span>
                </div>
            </div>`;
        }).join('');
    } catch (err) {
        console.warn('Public alerts feed error:', err.message);
    }
}

function initCitizenMap() {
    if (citizenMap) return;
    const el = document.getElementById('citizen-map');
    if (!el || typeof L === 'undefined') return;
    citizenMap = L.map(el).setView([20.8465, 85.0985], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18, attribution: '&copy; OpenStreetMap contributors'
    }).addTo(citizenMap);

    // Simulated incident zone
    L.circleMarker([20.8420, 85.1020], {
        radius: 12, color: '#dc2626', weight: 2.5, fillColor: '#dc2626', fillOpacity: 0.35
    }).bindPopup('<b style="color:#dc2626">THERMAL ANOMALY ZONE</b><br/>Angul Industrial Area &mdash; Avoid perimeter').addTo(citizenMap);

    // Safe shelter
    L.circleMarker([20.8520, 85.0930], {
        radius: 10, color: '#059669', weight: 2.5, fillColor: '#059669', fillOpacity: 0.45
    }).bindPopup('<b style="color:#059669">SAFE SHELTER</b><br/>Govt High School &mdash; Food, water, medical aid ready').addTo(citizenMap);

    // Evacuation route
    L.polyline([[20.8440, 85.0995], [20.8470, 85.0970], [20.8495, 85.0950], [20.8520, 85.0930]], {
        color: '#2563eb', weight: 4, dashArray: '8 6', opacity: 0.9
    }).bindPopup('<b>Evacuation Route (NH-55 Corridor)</b><br/>Via Market Road &rarr; Brahmani Bridge &rarr; Shelter').addTo(citizenMap);
}
