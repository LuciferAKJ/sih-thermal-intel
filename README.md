# 🔥 FireSense (AeroThermal) | SIH26162 (NTRO)
### Spaceborne Thermal Intelligence & Autonomous Industrial Disaster Response

[![Production Live](https://img.shields.io/badge/Production-Live-emerald?style=flat-square&logo=vercel)](https://sih-thermal-intel.vercel.app)
[![Problem Statement](https://img.shields.io/badge/SIH-SIH26162-orange?style=flat-square)](https://sih-thermal-intel.vercel.app)
[![Agency](https://img.shields.io/badge/Agency-NTRO-blue?style=flat-square)](https://sih-thermal-intel.vercel.app)
[![Data Source](https://img.shields.io/badge/Satellite-NASA%20FIRMS%20VIIRS%20375m-red?style=flat-square)](https://firms.modaps.eosdis.nasa.gov/)
[![Python](https://img.shields.io/badge/Backend-Python%203.10+-3776ab?style=flat-square&logo=python)](https://python.org)

> **Live Production Platform:** [https://sih-thermal-intel.vercel.app](https://sih-thermal-intel.vercel.app)  
> **Tactical Operations Dashboard:** [https://sih-thermal-intel.vercel.app/app](https://sih-thermal-intel.vercel.app/app)  
> **Problem Statement ID:** SIH26162  
> **Ministry / Organization:** National Technical Research Organisation (NTRO)  
> **Domain:** Geospatial Intelligence, Defense, & Industrial Disaster Response  

---

## 🛰️ Executive Overview

NASA earth-observation satellites (**Suomi NPP / NOAA-20 VIIRS 375m** and **Terra/Aqua MODIS 1km**) register thousands of thermal infrared anomalies across the Indian subcontinent daily. However, spaceborne sensors only transmit raw thermal flux pixels (brightness temperature and Fire Radiative Power in MW). 

**The Challenge:** Spaceborne sensors cannot inherently tell whether a thermal spike is a scheduled, safe gas flare in an oil refinery (burning at 600°C–1000°C), an uncontrolled catastrophic explosion, agricultural crop burning, or an **unregistered clandestine thermal anomaly** operating outside regulatory oversight.

**FireSense bridges this gap:**
> **SATELLITE SIGNAL ⟶ MULTI-MODEL CLASSIFICATION ⟶ ASSETS AT RISK ⟶ EMERGENCY DISPATCH**

FireSense correlates raw satellite thermal pixels with **OpenStreetMap (OSM) vector boundaries**, **ESA WorldCover land-cover matrices**, and a **60-day historical overpass persistence baseline**. It computes composite danger scores, simulates physical blast/evacuation perimeters, routes automated Common Alerting Protocol (CAP) dispatches to nearest fire stations, and coordinates civilian evacuation routes.

---

## 🏛️ System Architecture & Data Pipeline

```text
                                  [DATA SOURCES]
                 NASA FIRMS (VIIRS 375m / MODIS)  +  OSM Overpass API
                                         │
                                         ▼
                             [INGESTION & SPATIAL ENGINE]
                 • Coordinate Projection & Bounding Box Filtering
                 • 60-Day Temporal Cell Persistence Engine
                 • ESA WorldCover 10m Land-Cover Masking
                                         │
                                         ▼
                             [AI CLASSIFICATION ENGINE]
                 • Multi-Feature Thermal Classifier (FRP, Temp, Day/Night)
                 • Facility Geofence Intersection (Refineries, Plants, Mines)
                 • Classifies: Flare vs Runaway Fire vs Stubble vs Wildfire vs Clandestine
                                         │
                                         ▼
                            [RISK & INCIDENT STATE MACHINE]
                 • Composite Danger Score (0 - 100)
                 • Blast Radius & Evacuation Perimeters (500m / 1.5km / 3km)
                 • Incident Lifecycle: NEW → VERIFIED → DISPATCHED → CONTAINED → RESOLVED
                                         │
                 ┌───────────────────────┴───────────────────────┐
                 ▼                                               ▼
    [TACTICAL COMMAND CONSOLE]                      [PUBLIC SAFETY & ADVISORY]
    (Control Room & First Responders)               (Civilian Transparency)
    • High-Density Interactive Map                  • Real-Time Incident Bulletins
    • Telemetry Dossiers & FRP Charts               • Geofenced Evacuation Routes
    • One-Click Emergency Station Dispatch          • Crowdsourced Smoke Verification
    • PDF Executive & GeoJSON GIS Export            • Designated Emergency Shelters
```

---

## 🧱 The 6-Module Operational Breakdown

| Module | Name | Function & Deliverables |
| :--- | :--- | :--- |
| **01** | **DETECT** | Ingests NASA FIRMS VIIRS 375m active fire telemetry (Fire Radiative Power, Brightness Temperature, Acquisition Timestamp, Scan Angle). |
| **02** | **CLASSIFY** | Multi-feature heuristics distinguish Industrial Gas Flares, Thermal Plants, Coal Stockyard Fires, Stubble Burns, Wildfires, and Unregistered Clandestine Operations with an explicit explainability evidence panel. |
| **03** | **CONTEXTUALIZE** | Cross-references spatial coordinates with OpenStreetMap vector boundaries and computes a 60-day historical recurrence baseline for that specific 375m cell. |
| **04** | **ASSESS** | Calculates a 0–100 Composite Danger Score, generates Assets-at-Risk dossiers (population centers, highways, hospitals), and simulates wind-driven smoke/evacuation plumes. |
| **05** | **RESPOND** | Generates authoritative Incident Tickets (`#INC-2026-0042`) and triggers simulated encrypted dispatches to nearest emergency authorities (e.g., Jamnagar Disaster Control, Baripada Fire Station). |
| **06** | **TRACK & FEEDBACK** | Dual-view operations: Control Room Commander overview and First Responder Mobile Field Terminal (`Acknowledge` → `En Route` → `Arrived` → `Contained` → `Resolved`). |

---

## ⚡ Pre-Cached Operational Indian Scenarios

FireSense includes pre-cached real-world operational scenarios for live demonstrations without requiring active satellite flyover timing:

1. **Jamnagar Refinery Complex (Gujarat):** Normal high-FRP industrial flare stack verified against licensed petrochemical polygon vs runaway storage tank fire.
2. **Similipal Biosphere Reserve (Odisha):** Rapidly expanding forest canopy wildfire encroaching on tribal settlements and wildlife corridors.
3. **Angul Super Thermal Power Plant (Odisha):** Coal stockyard spontaneous combustion event adjacent to residential worker quarters.
4. **Sangrur Agricultural Belt (Punjab):** Post-monsoon seasonal stubble burning cluster with air quality impact modeling.
5. **Clandestine Thermal Anomaly (Mineral Belt):** High-heat anomaly with zero industrial registration in dense forest cover, flagged for tactical investigation.

---

## 🚀 Quick Start (Running Locally)

### Prerequisites:
- Python 3.10 or higher
- Any modern web browser (Edge, Chrome, Firefox, Safari)

### 1. Clone the repository:
```bash
git clone https://github.com/PaliiiXRAY/sih-thermal-intel.git
cd sih-thermal-intel
```

### 2. Launch the server:
```bash
python app.py
```

### 3. Open in Browser:
- **Cinematic Landing Page:** [http://localhost:5002](http://localhost:5002)
- **Tactical Control Room Dashboard:** [http://localhost:5002/app](http://localhost:5002/app)

---

## 📡 REST API Endpoints

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/pipeline/scenario?id={scenario_id}` | `GET` | Runs end-to-end pipeline on selected operational scenario (`&live_osm=1` enables live Overpass query). |
| `/api/live?map_key={KEY}&bbox={BBOX}` | `GET` | Ingests live NASA FIRMS NRT data for a specified bounding box. |
| `/api/stats` | `GET` | Returns aggregated metrics (active hotspots, critical alerts, resolved incidents). |
| `/api/incident/{id}/dispatch` | `POST` | Dispatches emergency responders and transitions incident to `DISPATCHED`. |
| `/api/incident/{id}/status` | `POST` | Advances incident state (`NEW` → `INVESTIGATING` → `VERIFIED` → `CONTAINED` → `RESOLVED`). |
| `/api/export/geojson` | `GET` | Exports complete incident layers as GIS-ready GeoJSON FeatureCollection. |

---

## 📁 Repository Structure

```text
sih-thermal-intel/
├── app.py                     # Core server & REST API router (Port 5002)
├── backend/
│   ├── firms_loader.py        # NASA FIRMS Active Fire ingestion & parser
│   ├── firms_api.py           # Live NASA FIRMS client (firms.modaps.eosdis.nasa.gov)
│   ├── landcover.py           # ESA WorldCover 10m land-cover classification
│   ├── pipeline.py            # End-to-end processing: FIRMS → OSM → Persistence → Classifier
│   ├── osm_correlator.py      # OpenStreetMap vector facility correlator
│   ├── persistence_engine.py  # 60-day temporal cell recurrence calculator
│   ├── classifier.py          # AI classification heuristics & agency routing logic
│   ├── incident_engine.py     # Incident state machine & Assets-at-Risk exposure database
│   └── samples.py             # Pre-cached operational Indian geographic scenarios
├── static/
│   ├── landing.html           # Cinematic Apple/Samsung-inspired landing page
│   ├── index.html             # High-density Tactical Command Console & Citizen Portal
│   ├── app.js                 # Leaflet map engine, telemetry graphs, and state transitions
│   ├── portal-modules.js      # Control room & responder interactive workflow modules
│   └── style.css              # Theme styling & thermal signature animations
├── presentation/
│   ├── SIH_SLIDES.md          # 7 official PowerPoint slides content
│   └── DEMO_SCRIPT.md         # 3-minute stage pitch script with judge defense Q&A
├── tests/
│   └── run_tests.py           # 27 automated test assertions
├── requirements.txt           # Python dependencies (for serverless deployments)
└── vercel.json                # Vercel production edge deployment configuration
```

---

## 🧪 Automated Testing

Run the built-in test suite covering classification heuristics, persistence calculations, parser integrity, and API schemas:
```bash
python tests/run_tests.py
```
*(All 27 test assertions validate zero-regression behavior).*

---

## 👥 Team & Hackathon Information

- **Event:** Tekathon Final 24-Hour Hackathon (September 2026) / Smart India Hackathon
- **Team:** FireSense Intel Team
- **Deployment:** Vercel Edge Serverless ([sih-thermal-intel.vercel.app](https://sih-thermal-intel.vercel.app))
