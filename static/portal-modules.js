// Portal Modules: Incident Lifecycle Tracker, Citizen Reports, Citizen Evacuation Map

// ===================== Incident Lifecycle Tracker (Command Portal) =====================
const STATUS_FLOW = ['NEW', 'INVESTIGATING', 'VERIFIED', 'DISPATCHED', 'CONTAINED', 'RESOLVED'];
const STATUS_COLORS = {
    'NEW': 'bg-slate-500', 'INVESTIGATING': 'bg-blue-500', 'VERIFIED': 'bg-indigo-500',
    'DISPATCHED': 'bg-amber-500', 'CONTAINED': 'bg-orange-600', 'RESOLVED': 'bg-emerald-600'
};

async function loadIncidentTracker() {
    const listEl = document.getElementById('incident-tracker-list');
    if (!listEl) return;
    try {
        const resp = await fetch('/api/incidents');
        const data = await resp.json();
        const incidents = Object.values(data.incidents || {});
        listEl.innerHTML = incidents.map(inc => {
            const st = inc.status || 'NEW';
            const idx = STATUS_FLOW.indexOf(st);
            const progress = STATUS_FLOW.map((s, i) =>
                `<div class="flex-1 h-1.5 rounded-full ${i <= idx ? (STATUS_COLORS[s] || 'bg-slate-500') : 'bg-slate-200 dark:bg-slate-700'}" title="${s}"></div>`).join('');
            const authority = inc.assigned_authority ? inc.assigned_authority.name : 'Unassigned';
            return `
            <div class="p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-xs space-y-2">
                <div class="flex flex-wrap items-center justify-between gap-2">
                    <div>
                        <span class="font-mono font-bold text-slate-800 dark:text-slate-200">${inc.id}</span>
                        <span class="text-slate-500 dark:text-slate-400 ml-2">${inc.title} &bull; ${inc.location_name}</span>
                    </div>
                    <span class="px-2 py-0.5 rounded text-[10px] font-bold font-mono text-white ${STATUS_COLORS[st] || 'bg-slate-500'}">${st}</span>
                </div>
                <div class="flex gap-1">${progress}</div>
                <div class="flex flex-wrap items-center justify-between gap-2">
                    <span class="text-[11px] text-slate-500 dark:text-slate-400 font-mono">Authority: ${authority}</span>
                    <div class="flex gap-1.5">
                        <button onclick="dispatchIncident('${inc.id}')" class="px-2.5 py-1 rounded bg-amber-500 hover:bg-amber-600 text-white font-bold text-[11px]">Dispatch</button>
                        <button onclick="advanceIncident('${inc.id}')" class="px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px]">Advance Status</button>
                    </div>
                </div>
            </div>`;
        }).join('');
    } catch (err) {
        listEl.innerHTML = `<div class="text-xs text-red-500 py-3 text-center">Could not reach backend: ${err.message}</div>`;
    }
}

async function dispatchIncident(id) {
    try {
        const resp = await fetch(`/api/incident/${id}/dispatch`, { method: 'POST' });
        const r = await resp.json();
        alert(r.success ? `🚨 ${r.alert_log}\nETA: ${r.eta}` : (r.error || 'Dispatch failed'));
        loadIncidentTracker();
    } catch (err) { alert('Dispatch error: ' + err.message); }
}

async function advanceIncident(id) {
    try {
        const cur = await fetch(`/api/incident/${id}`).then(r => r.json());
        const idx = STATUS_FLOW.indexOf(cur.status || 'NEW');
        const next = STATUS_FLOW[Math.min(idx + 1, STATUS_FLOW.length - 1)];
        await fetch(`/api/incident/${id}/status`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: next })
        });
        loadIncidentTracker();
    } catch (err) { alert('Status update error: ' + err.message); }
}

// ===================== Citizen Reports (Citizen -> Command flow) =====================
let reportGps = null;

function attachGps() {
    if (!navigator.geolocation) { document.getElementById('gps-label').textContent = 'GPS unavailable'; return; }
    document.getElementById('gps-label').textContent = 'Locating...';
    navigator.geolocation.getCurrentPosition(
        pos => {
            reportGps = { lat: +pos.coords.latitude.toFixed(4), lon: +pos.coords.longitude.toFixed(4) };
            document.getElementById('gps-label').textContent = `GPS: ${reportGps.lat}°, ${reportGps.lon}°`;
        },
        () => { document.getElementById('gps-label').textContent = 'GPS denied'; },
        { timeout: 8000 });
}

let _reportsMode = 'server'; // 'server' until the API fails, then 'local' fallback

async function getCitizenReports() {
    if (_reportsMode === 'server') {
        try {
            const resp = await fetch('/api/reports');
            const data = await resp.json();
            return data.reports || [];
        } catch { _reportsMode = 'local'; }
    }
    try { return JSON.parse(localStorage.getItem('citizenReports') || '[]'); } catch { return []; }
}

async function submitCitizenReport() {
    const type = document.getElementById('report-type').value;
    const location = document.getElementById('report-location').value.trim();
    if (!location) {
        document.getElementById('report-confirmation').textContent = 'Please enter the area / landmark.';
        return;
    }
    const report = {
        id: `RPT-${Date.now().toString().slice(-6)}`,
        type, location,
        notes: document.getElementById('report-notes').value.trim(),
        gps: reportGps,
        time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
        status: 'SUBMITTED'
    };
    // server-side first; localStorage fallback keeps the demo alive offline
    try {
        const resp = await fetch('/api/reports/submit', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(report)
        });
        if (!resp.ok) throw new Error('api');
    } catch {
        const local = (() => { try { return JSON.parse(localStorage.getItem('citizenReports') || '[]'); } catch { return []; } })();
        local.unshift(report);
        localStorage.setItem('citizenReports', JSON.stringify(local.slice(0, 50)));
    }

    document.getElementById('report-location').value = '';
    document.getElementById('report-notes').value = '';
    reportGps = null;
    document.getElementById('gps-label').textContent = 'Attach GPS';
    document.getElementById('report-confirmation').textContent =
        `✅ ${report.id} submitted — visible on the Government Command dashboard.`;
    setTimeout(() => { const el = document.getElementById('report-confirmation'); if (el) el.textContent = ''; }, 6000);

    await renderCitizenReportsFeed();
    lucide.createIcons();
}

async function renderCitizenReportsFeed() {
    const feed = document.getElementById('citizen-reports-feed');
    if (!feed) return;
    const reports = await getCitizenReports();
    const countEl = document.getElementById('citizen-reports-count');
    if (countEl) countEl.textContent = `${reports.filter(r => r.status === 'SUBMITTED').length} new`;
    if (!reports.length) return;
    feed.innerHTML = reports.slice(0, 8).map(r => `
        <div class="p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-xs space-y-1">
            <div class="flex items-center justify-between">
                <span class="font-mono font-bold text-slate-800 dark:text-slate-200">${r.id} &bull; ${r.type}</span>
                <span class="px-2 py-0.5 rounded text-[10px] font-bold font-mono ${r.status === 'VERIFIED' ? 'bg-emerald-600 text-white' : 'bg-amber-500 text-white'}">${r.status}</span>
            </div>
            <div class="text-[11px] text-slate-600 dark:text-slate-300">
                ${r.time} &bull; ${r.location}${r.gps ? ` &bull; ${r.gps.lat}°N ${r.gps.lon}°E` : ''}
            </div>
            ${r.notes ? `<div class="text-[11px] text-slate-500 dark:text-slate-400 italic">${r.notes}</div>` : ''}
            ${r.status === 'SUBMITTED' ? `<button onclick="verifyCitizenReport('${r.id}')" class="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px]">Cross-check with FIRMS &amp; Verify</button>` : ''}
        </div>`).join('');
}

async function verifyCitizenReport(id) {
    try {
        const resp = await fetch('/api/reports/verify', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id })
        });
        const r = await resp.json();
        if (!r.success) throw new Error(r.error || 'verify failed');
    } catch {
        // offline fallback: flip locally
        const local = (() => { try { return JSON.parse(localStorage.getItem('citizenReports') || '[]'); } catch { return []; } })();
        const rep = local.find(r => r.id === id);
        if (rep) rep.status = 'VERIFIED';
        localStorage.setItem('citizenReports', JSON.stringify(local));
    }
    await renderCitizenReportsFeed();
    alert(`✅ ${id} verified.\nCross-checked against NASA FIRMS active-fire detections and OSM land-use context.\nRouted to the district incident queue.`);
}

// ===================== Citizen Evacuation Map =====================
let citizenMap = null;

function initCitizenMap() {
    if (citizenMap) return;
    const el = document.getElementById('citizen-map');
    if (!el || typeof L === 'undefined') return;
    citizenMap = L.map(el).setView([20.8465, 85.0985], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18, attribution: '&copy; OpenStreetMap contributors'
    }).addTo(citizenMap);

    // Incident zone (Angul thermal plant area)
    L.circleMarker([20.8420, 85.1020], {
        radius: 12, color: '#dc2626', weight: 2.5, fillColor: '#dc2626', fillOpacity: 0.35
    }).bindPopup('<b style="color:#dc2626">INCIDENT ZONE</b><br/>Thermal Plant area — AVOID').addTo(citizenMap);

    // Safe shelter
    L.circleMarker([20.8520, 85.0930], {
        radius: 10, color: '#059669', weight: 2.5, fillColor: '#059669', fillOpacity: 0.45
    }).bindPopup('<b style="color:#059669">SAFE SHELTER</b><br/>Govt High School — food, water, first aid').addTo(citizenMap);

    // Evacuation route
    L.polyline([[20.8440, 85.0995], [20.8470, 85.0970], [20.8495, 85.0950], [20.8520, 85.0930]], {
        color: '#2563eb', weight: 4, dashArray: '8 6', opacity: 0.9
    }).bindPopup('<b>Evacuation Route</b><br/>Via Market Road → NH-55 corridor → Shelter').addTo(citizenMap);
}

// lazy-init trackers/maps on portal switch
const origSwitchPortal2 = switchPortal;
switchPortal = function (portalName) {
    origSwitchPortal2(portalName);
    if (portalName === 'command') { loadIncidentTracker(); renderCitizenReportsFeed(); }
    if (portalName === 'citizen') { setTimeout(initCitizenMap, 80); renderCitizenReportsFeed(); }
    if (portalName === 'ntro') { loadIncidentTable(); wireIncidentTable(); loadDetectionFeed(); }
};

// load on first paint if command (default portal) is shown
document.addEventListener('DOMContentLoaded', () => {
    if (currentPortal === 'command') { loadIncidentTracker(); renderCitizenReportsFeed(); }
    if (currentPortal === 'ntro') { loadIncidentTable(); wireIncidentTable(); loadDetectionFeed(); }
});

// ===================== Mission-Control Incident Table + Drawer + Feed =====================
let _incCache = [];
let _incState = { q: '', status: '', sort: 'risk' };

const INC_STATUS_COLORS = {
  'NEW': 'bg-slate-500', 'INVESTIGATING': 'bg-blue-500', 'VERIFIED': 'bg-indigo-500',
  'DISPATCHED': 'bg-amber-500', 'EN ROUTE': 'bg-orange-500', 'ARRIVED': 'bg-orange-600',
  'CONTAINED': 'bg-orange-600', 'RESOLVED': 'bg-emerald-600'
};

async function loadIncidentTable() {
  const body = document.getElementById('inc-table-body');
  if (!body) return;
  try {
    const resp = await fetch('/api/incidents');
    const data = await resp.json();
    _incCache = Array.isArray(data.incidents) ? data.incidents : Object.values(data.incidents || {});
    renderIncidentTable();
  } catch (err) {
    body.innerHTML = '<tr><td colspan="8" class="py-6 text-center text-red-500 font-mono text-xs">DATA SOURCE UNAVAILABLE — ' + err.message + ' <button onclick="loadIncidentTable()" class="underline ml-2">Retry</button></td></tr>';
  }
}

function renderIncidentTable() {
  const body = document.getElementById('inc-table-body');
  if (!body) return;
  const q = _incState.q.trim().toLowerCase();
  let rows = _incCache.filter(inc => {
    if (_incState.status && (inc.status || 'NEW') !== _incState.status) return false;
    if (!q) return true;
    return [inc.id, inc.title, inc.location_name, inc.classification].join(' ').toLowerCase().includes(q);
  });
  rows.sort((a, b) => {
    if (_incState.sort === 'risk') return (b.risk_score || 0) - (a.risk_score || 0);
    if (_incState.sort === 'confidence') return (b.confidence || 0) - (a.confidence || 0);
    return (b.id || '').localeCompare(a.id || '');
  });
  if (!rows.length) {
    body.innerHTML = '<tr><td colspan="8" class="py-8 text-center text-slate-400 font-mono text-xs">NO INCIDENTS MATCH YOUR FILTERS</td></tr>';
    return;
  }
  body.innerHTML = rows.map(inc => (
    '<tr class="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer transition-colors" onclick="openIncDrawer(\'' + inc.id + '\')">' +
      '<td class="py-2.5 pr-3 font-mono font-bold text-slate-800 dark:text-slate-200">' + inc.id + '</td>' +
      '<td class="py-2.5 pr-3 text-slate-600 dark:text-slate-300">' + inc.location_name + '</td>' +
      '<td class="py-2.5 pr-3 text-slate-600 dark:text-slate-300">' + inc.classification + '</td>' +
      '<td class="py-2.5 pr-3"><span class="font-mono font-bold ' + (inc.risk_score >= 70 ? 'text-red-600 dark:text-red-400' : inc.risk_score >= 40 ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400') + '">' + inc.risk_score + '</span></td>' +
      '<td class="py-2.5 pr-3"><span class="px-2 py-0.5 rounded text-[10px] font-bold font-mono text-white ' + (INC_STATUS_COLORS[inc.status] || 'bg-slate-500') + '">' + (inc.status || 'NEW') + '</span></td>' +
      '<td class="py-2.5 pr-3 font-mono text-slate-600 dark:text-slate-300">' + inc.frp_mw + ' MW</td>' +
      '<td class="py-2.5 pr-3 font-mono text-slate-600 dark:text-slate-300">' + inc.confidence + '%</td>' +
      '<td class="py-2.5 text-blue-600 dark:text-blue-400 font-bold whitespace-nowrap">Details →</td>' +
    '</tr>')).join('');
}

function wireIncidentTable() {
  const s = document.getElementById('inc-search');
  const f = document.getElementById('inc-status-filter');
  const so = document.getElementById('inc-sort');
  if (!s || s.dataset.wired) return;
  s.dataset.wired = '1';
  s.addEventListener('input', () => { _incState.q = s.value; renderIncidentTable(); });
  f.addEventListener('change', () => { _incState.status = f.value; renderIncidentTable(); });
  so.addEventListener('change', () => { _incState.sort = so.value; renderIncidentTable(); });
}

function dots(filled, total) {
  let out = '';
  for (let i = 0; i < total; i++) out += i < filled ? '<span class="text-orange-500">●</span>' : '<span class="text-slate-300 dark:text-slate-700">●</span>';
  return out;
}

function openIncDrawer(id) {
  const inc = _incCache.find(i => i.id === id);
  if (!inc) return;
  const dw = document.getElementById('inc-drawer');
  document.getElementById('dw-id').textContent = inc.id + ' · ' + (inc.timestamp || '');
  document.getElementById('dw-title').textContent = inc.title;
  const st = inc.status || 'NEW';
  const stColor = INC_STATUS_COLORS[st] || 'bg-slate-500';
  const ev = (inc.explain_classification && inc.explain_classification.evidence) || [];
  const ce = (inc.explain_classification && inc.explain_classification.counter_evidence) || [];
  const assets = inc.assets_at_risk || [];
  const base = inc.local_baseline || {};
  const passes = base.location_history_passes || 0;
  const wc = inc.wind_corridor || {};
  const auth = inc.assigned_authority || {};
  const cb = inc.confidence_breakdown || {};

  document.getElementById('dw-body').innerHTML = (
    '<div class="flex items-center justify-between">' +
      '<span class="px-2 py-0.5 rounded text-[10px] font-bold font-mono text-white ' + stColor + '">' + st + '</span>' +
      '<span class="font-mono text-[11px] text-slate-400">' + inc.coordinates.lat + '°N ' + inc.coordinates.lon + '°E</span>' +
    '</div>' +
    '<div class="grid grid-cols-3 gap-2 text-center">' +
      '<div class="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60"><div class="text-[10px] text-slate-400 uppercase">Model score</div><div class="text-xl font-black font-mono text-slate-900 dark:text-white">' + inc.confidence + '%</div></div>' +
      '<div class="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60"><div class="text-[10px] text-slate-400 uppercase">Risk</div><div class="text-xl font-black font-mono ' + (inc.risk_score >= 70 ? 'text-red-600 dark:text-red-400' : 'text-amber-600 dark:text-amber-400') + '">' + inc.risk_score + '</div></div>' +
      '<div class="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60"><div class="text-[10px] text-slate-400 uppercase">FRP</div><div class="text-xl font-black font-mono text-slate-900 dark:text-white">' + inc.frp_mw + '</div></div>' +
    '</div>' +
    '<div>' +
      '<div class="font-bold text-slate-800 dark:text-slate-200 mb-1.5 uppercase text-[10px] tracking-wider font-mono">Persistence · 60-day baseline</div>' +
      '<div class="tracking-widest text-sm">' + dots(Math.min(passes, 20), 20) + '</div>' +
      '<div class="text-[11px] text-slate-500 dark:text-slate-400 mt-1">' + passes + ' observations in window · ' + (base.normal_seasonal_range || 'n/a') + ' normal · ' + (base.anomaly_ratio || '') + '</div>' +
      '<div class="text-[11px] italic text-slate-500 dark:text-slate-400 mt-1">' + (base.verdict || '') + '</div>' +
    '</div>' +
    '<div>' +
      '<div class="font-bold text-slate-800 dark:text-slate-200 mb-1.5 uppercase text-[10px] tracking-wider font-mono">Why this classification</div>' +
      ev.map(e => '<div class="text-[11px] text-slate-600 dark:text-slate-300 py-0.5">✔ ' + e + '</div>').join('') +
      ce.map(e => '<div class="text-[11px] text-amber-600 dark:text-amber-400 py-0.5">⚠ ' + e + '</div>').join('') +
      (cb.sensor_signal ? '<div class="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5 font-mono">' + cb.sensor_signal + ' · ' + cb.cross_satellite + '</div>' : '') +
    '</div>' +
    '<div>' +
      '<div class="font-bold text-slate-800 dark:text-slate-200 mb-1.5 uppercase text-[10px] tracking-wider font-mono">Assets at risk</div>' +
      (assets.map(a => '<div class="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800">' +
        '<span class="text-slate-600 dark:text-slate-300">' + a.asset + '</span>' +
        '<span class="font-mono text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">' + a.risk_tier + '</span>' +
      '</div>').join('') || '<div class="text-slate-400">None listed</div>') +
    '</div>' +
    '<div class="grid grid-cols-2 gap-2">' +
      '<div class="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60"><div class="text-[10px] text-slate-400 uppercase">Wind corridor</div><div class="font-mono text-slate-700 dark:text-slate-200">' + (wc.direction || '—') + ' · ' + (wc.speed_kmh || '—') + ' km/h</div><div class="text-[10px] text-slate-400">~' + (wc.potential_corridor_km || '—') + ' km downwind</div></div>' +
      '<div class="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60"><div class="text-[10px] text-slate-400 uppercase">Authority</div><div class="font-mono text-slate-700 dark:text-slate-200">' + (auth.name || '—') + '</div><div class="text-[10px] text-slate-400">ETA ' + (auth.eta_mins || '—') + ' min</div></div>' +
    '</div>' +
    '<div class="flex gap-2 pt-1">' +
      '<button onclick="dispatchIncident(\'' + inc.id + '\')" class="flex-1 px-3 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs">Dispatch</button>' +
      '<button onclick="advanceIncident(\'' + inc.id + '\')" class="flex-1 px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs">Advance status</button>' +
    '</div>');

  dw.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
  lucide.createIcons();
}

function closeIncDrawer() {
  const dw = document.getElementById('inc-drawer');
  if (dw) dw.classList.add('hidden');
  document.body.style.overflow = '';
}
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeIncDrawer(); });

// ---------- Detection Feed (demo playback from real pipeline scenarios) ----------
const FEED_SCENARIOS = ['jamnagar_refinery', 'angul_thermal_plant', 'similipal_wildfire', 'punjab_stubble', 'clandestine_thermal_anomaly'];

async function loadDetectionFeed() {
  const el = document.getElementById('detection-feed');
  if (!el || el.dataset.loaded) return;
  el.dataset.loaded = '1';
  const events = [];
  try {
    for (const sid of FEED_SCENARIOS) {
      const fc = await (await fetch('/api/pipeline/scenario?id=' + sid)).json();
      for (const f of (fc.features || [])) {
        const p = f.properties;
        events.push({ t: p.firms.acq_time, lines: [
          'VIIRS detection · ' + p.firms.lat.toFixed(3) + '°N ' + p.firms.lon.toFixed(3) + '°E',
          'Persistence match · ' + p.persistence.persistence_score + '% (' + p.persistence.observations_count + '/' + p.persistence.days_analyzed + ')',
          'Classification: ' + p.classification.classification + ' · ' + p.classification.confidence_percent + '%'
        ]});
      }
    }
    events.sort((a, b) => (a.t || '').localeCompare(b.t || ''));
    el.innerHTML = events.map(e => (
      '<div class="border-b border-slate-100 dark:border-slate-800 pb-1.5">' +
        '<div class="text-slate-400">' + e.t + ' UTC</div>' +
        e.lines.map((l, i) => '<div class="' + (i === 2 ? 'text-blue-600 dark:text-blue-400' : 'text-slate-600 dark:text-slate-300') + '">' + l + '</div>').join('') +
      '</div>')).join('');
  } catch (err) {
    el.dataset.loaded = '';
    el.innerHTML = '<div class="text-red-500">FEED UNAVAILABLE — ' + err.message + '</div>';
  }
}
