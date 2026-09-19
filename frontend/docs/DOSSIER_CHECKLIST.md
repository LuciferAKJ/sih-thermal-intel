# NTRO Dossier Verification Checklist
**Test Requirement:** Proving "Click one incident &rarr; full dossier renders"  
**Module Owner:** Pallabi (NTRO Frontend)  
**Schema Owner:** Aditya (Backend)  

---

### Step-by-Step Verification Checklist

| # | Step / Action | Expected Result | Verified Status |
|---|---------------|-----------------|-----------------|
| 1 | Load `NTRO.jsx` dashboard | Overview banner displays with **DEMO DATA** badge, 4 stat cards (Hotspots: 247, Auto-Classified: 96.3%, Critical: 3, Pending: 6), and MapLibre/Tactical map. | `[PASS] Verified` |
| 2 | Default selection on mount | Incident `INC-2026-0044` (Angul Thermal Power) is automatically selected and highlighted in the feed. | `[PASS] Verified` |
| 3 | Click `INC-2026-0042` (Similipal Wildfire) in list or on map | Selected incident ID updates; Right column immediately re-renders with Similipal telemetry. | `[PASS] Verified` |
| 4 | Block 1 Verification: Satellite Telemetry | FRP displays **142.6 MW**, Brightness Temp: **345.2 K (72.0°C)**, VIIRS NOAA-20 375m ground track, 91% FIRMS detection confidence. | `[PASS] Verified` |
| 5 | Block 2 Verification: AI Classification & Explainability | Classifies as **Episodic Forest Canopy Wildfire** (92% confidence); Supporting evidence shows protected biosphere reserve, rapid expansion; Counter-evidence notes cloud fringe. | `[PASS] Verified` |
| 6 | Block 3 Verification: Temporal Persistence Baseline | Persistence score: **6.7%** (4 of 60 passes); Dot strip displays mostly empty gray dots with 4 recent orange dots; Anomaly ratio confirms "Transient Episodic Outbreak". | `[PASS] Verified` |
| 7 | Block 4 Verification: Geospatial Context | Land-cover: **Dense Deciduous Forest (ESA WorldCover Class 10)**; Facility match: Similipal Core Wildlife Zone; Wind vector: NE at 18 km/h toward Tiger Corridor. | `[PASS] Verified` |
| 8 | Block 5 Verification: Multi-Criteria Risk Score | Risk Score: **87 / 100 (CRITICAL)**; Shows that score is an operational severity index (NOT a probability); lists weighted contributing factors (+38 pts ecological, +27 pts lateral spread). | `[PASS] Verified` |
| 9 | Analyst Verification Action | Click **[ ✔ Confirm Verification ]** or **[ 🚩 Flag for Review ]** with note; badge updates to `CONFIRMED` and logs to Command Bus without breaking component state. | `[PASS] Verified` |
| 10 | Offline / Fallback Resiliency | If WebGL or tiles fail, tactical radar canvas displays with proportional SVG coordinate dots and allows clicking to open dossier. | `[PASS] Verified` |

---

### Integration Test Contract
- **Event:** `onSelectIncident(incidentId)`
- **State Mutation:** `setSelectedIncidentId(incidentId)`
- **Render Output:** `<NTRODossier incident={selectedIncident} onVerify={handleAnalystVerify} />`
- **Zero Console Errors**: Guaranteed through schema-fallback default objects in `ntro_fixtures.js`.
