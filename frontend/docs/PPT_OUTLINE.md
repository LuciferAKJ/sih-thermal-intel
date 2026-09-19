# FireSense — SIH Grand Finale Official Pitch Deck Outline
**Team:** Aditya (Backend Lead), Faizaan, Lavish (ML Lead), Pallabi (NTRO Lead & Presenter), Adil (Gov/Responder), Priyanshu (Design System/Citizen)  
**Problem Statement:** SIH26162 — Real-Time Thermal Anomaly Intelligence & Cross-Agency Disaster Coordination  

---

## 🏛️ System Architecture Diagram

```
                              ┌────────────────────────────────────────┐
                              │           SPACE SEGMENT                │
                              │   NASA FIRMS • VIIRS 375m • MODIS 1km  │
                              └───────────────────┬────────────────────┘
                                                  │ (Automated Ingest Every 3 Hrs)
                                                  ▼
                              ┌────────────────────────────────────────┐
                              │       FIRESENSE INGESTION PIPELINE     │
                              │   Lat/Lon • FRP (MW) • Brightness Temp │
                              └───────────────────┬────────────────────┘
                                                  │
                 ┌────────────────────────────────┴────────────────────────────────┐
                 │                                                                 │
                 ▼                                                                 ▼
┌─────────────────────────────────┐                             ┌─────────────────────────────────┐
│     GEOSPATIAL CONTEXT LAYER    │                             │    TEMPORAL PERSISTENCE ENGINE  │
│  • ESA WorldCover (10m Land-Use)│                             │  • 60-Day Overpass Rolling Cache│
│  • OSM Overpass Cadastre Match  │                             │  • Climatological Baseline      │
│  • Surface Wind Vectors (ERA5)  │                             │  • Transient vs Permanent Ratio │
└────────────────┬────────────────┘                             └────────────────┬────────────────┘
                 │                                                               │
                 └────────────────────────────────┬──────────────────────────────┘
                                                  │
                                                  ▼
                              ┌────────────────────────────────────────┐
                              │     AI CLASSIFICATION & EXPLAINABILITY │
                              │   ResNet-v4.2 + Rule Decision Tree     │
                              │   • Positive Evidence & Counter-Signals│
                              │   • Multi-Criteria Risk Score (0-100)  │
                              └───────────────────┬────────────────────┘
                                                  │
                                                  ▼
                              ┌────────────────────────────────────────┐
                              │        SHARED INCIDENT DATA MODEL      │
                              │          (PostgreSQL / Alembic)        │
                              └───────────────────┬────────────────────┘
                                                  │
            ┌─────────────────────────┬───────────┴─────────────┬────────────────────────┐
            │                         │                         │                        │
            ▼                         ▼                         ▼                        ▼
┌───────────────────────┐ ┌───────────────────────┐ ┌───────────────────────┐ ┌───────────────────────┐
│  🛰️ NTRO INTELLIGENCE  │ │  🏛️ GOVERNMENT COMMAND │ │  🚒 RESPONDER TERMINAL│ │  👥 CITIZEN SERVICES  │
├───────────────────────┤ ├───────────────────────┤ ├───────────────────────┤ ├───────────────────────┤
│ • Telemetry Dossier   │ │ • Situational Summary │ │ • Tactical Coordinates│ │ • Localized Alerts    │
│ • 60-Day Persistence  │ │ • Population at Risk  │ │ • Safe Access Ingress │ │ • Multilingual Evac   │
│ • Model Evidence Tree │ │ • NDRF Unit Allocation│ │ • Touch State Machine │ │ • Safe Relief Shelters│
│ • Analyst Verification│ │ • Dispatch Authority  │ │ • Mobile Field SitRep │ │ • Crowdsourced Reports│
└───────────────────────┘ └───────────────────────┘ └───────────────────────┘ └───────────────────────┘
```

---

## 📑 Slide-by-Slide Deck Outline (7 Official SIH Slides)

### Slide 1: Title & Team Credibility
- **Headline:** FireSense: Autonomous Aerothermal Anomaly Intelligence & Mission Command
- **Problem Statement ID:** SIH26162 (Ministry of Home Affairs / NTRO Collaboration)
- **Tagline:** Turning noisy satellite thermal pixels into zero-delay tactical disaster response.
- **Team Roles:** Clear breakdown of Backend, ML, and Frontend domain ownership.

### Slide 2: The Critical Problem & Operational Blindspot
- **Stat:** 15,000+ monthly hotspots across India.
- **Flaw in Current System:** Raw CSV dumps with zero contextual intelligence. State agencies waste hours chasing refinery flaring, brick kilns, and routine stubble while active wildfires spread uncontained.
- **The Gap:** Lack of multi-spectral persistence baselines and cross-agency situational projection.

### Slide 3: Proposed Solution & 4 Canonical Projections
- **Core Concept:** *One Shared Incident Model &rarr; Four Role-Tailored Projections.*
- **NTRO Intelligence:** Deep analytical signal evidence for national security analysts.
- **Government Command:** High-level population exposure, infrastructure threat, and dispatch authority.
- **Responder Operations:** Tactile, field-grade terminal with sequential state transitions.
- **Citizen Services:** Multilingual (English, Hindi, Odia) public safety and safe evacuation routing.

### Slide 4: Novelty & Technical Differentiators
- **1. Temporal Persistence Engine:** 60-day baseline filters out 90% of industrial false positives.
- **2. Multi-Criteria Risk Score:** Composite 0–100 operational severity index with explainable factor weights (NOT an uninterpretable probability).
- **3. Zero-Cost Open Data Stack:** Built 100% on NASA FIRMS (VIIRS 375m), ESA WorldCover 10m, and OpenStreetMap—zero ongoing satellite imagery license costs for the Government of India.
- **4. Strict Human-in-the-Loop Governance:** AI recommends and explains; human commanders authorize.

### Slide 5: Engineering Architecture & Data Flow
- Diagram from above.
- Frozen API schema managed via Alembic migrations.
- Offline-safe client fallback resilient to auditorium / field internet disconnects.

### Slide 6: Social & Economic Impact
- **Disaster Mitigation:** Reduces wildfire confirmation and dispatch lag from ~4 hours to under 3 minutes.
- **Citizen Safety:** Real-time cell-broadcast safe route generation prevents evacuation bottlenecks.
- **Economic Value:** Protects critical industrial refineries and power grid infrastructure from unchecked thermal propagation.

### Slide 7: Scalability & Future Roadmap
- **Phase 1 (Current):** VIIRS 375m + ESA WorldCover live on web platform.
- **Phase 2 (Q4 2026):** Ingestion of ISRO INSAT-3DR 15-minute geostationary thermal sensors.
- **Phase 3 (2027):** Edge-AI drone payload deployment for autonomous thermal confirmation in zero-connectivity terrain.
