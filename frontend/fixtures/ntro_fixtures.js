/**
 * Aditya's Frozen API Contract Mock Fixtures for NTRO Intelligence
 * Schema Owner: Aditya | Consumer: Pallabi (NTRO Frontend)
 * 
 * IMPORTANT CONSTRAINTS:
 * 1. Risk score is an operational severity index (0-100 scale), NEVER a probability.
 * 2. AI provides evidence and counter-evidence; human authorities authorize actions.
 */

export const NTRO_OVERVIEW_METRICS = {
  hotspots_today: 247,
  delta_yesterday: 12,
  auto_classified: 238,
  classification_rate_pct: 96.3,
  critical_alerts: 3,
  pending_review: 6,
  satellite_pass_time_utc: "04:30 UTC",
  coverage_region: "India & Maritime Exclusive Economic Zone",
  sensor_fleet: ["NASA VIIRS (375m)", "MODIS Aqua/Terra (1km)"],
  is_demo_mode: true
};

export const NTRO_INCIDENTS_FIXTURE = [
  {
    id: "INC-2026-0044",
    title: "Angul Thermal Power & Coal Storage Yard",
    location_name: "Angul Industrial Belt, Odisha",
    state: "Odisha",
    district: "Angul",
    coordinates: { lat: 20.8420, lon: 85.1020 },
    timestamp_utc: "2026-09-19T04:30:00Z",
    satellite_source: "VIIRS S-NPP (375m)",
    
    // Block 1: Satellite Fields
    satellite: {
      frp_mw: 710.0,
      brightness_temp_k: 368.5,
      brightness_temp_c: 95.3,
      track_m: 375,
      scan_m: 375,
      satellite_name: "Suomi NPP",
      instrument: "VIIRS",
      pass_type: "Night-time Overpass",
      detection_confidence_pct: 96
    },

    // Block 2: Classification + Evidence
    classification: {
      category: "industrial",
      label: "Thermal Power Plant / Coal-Handling Fire",
      confidence_pct: 94,
      model_version: "FireSense-ResNet-v4.2",
      evidence: [
        "Corroborates licensed coal power generation footprint in National Industrial Cadastre",
        "Persistent high-intensity thermal signature (FRP 710 MW exceeds routine stack flare baseline)",
        "VIIRS I-band (375m) centroid co-located within 45m of bulk coal storage hopper #4",
        "Shortwave infrared (SWIR) reflectance anomaly matches active smoldering fuel pile"
      ],
      counter_evidence: [
        "Surface wind vector (NE at 20 km/h) carrying dense particulate plume across NH-55 corridor",
        "No planned maintenance flaring registered in Odisha State Pollution Control Board registry"
      ]
    },

    // Block 3: Persistence Baseline (60-Day History)
    persistence: {
      observations_in_window: 52,
      window_days: 60,
      persistence_score_pct: 86.7,
      normal_seasonal_range: "35-45 observations",
      anomaly_ratio: "1.28x baseline",
      dot_history: [
        true, true, true, true, false, true, true, true, true, true,
        true, true, false, true, true, true, true, true, true, true
      ],
      verdict: "High permanent thermal footprint with sudden 3.4x FRP spike above 30-day moving average"
    },

    // Block 4: Geospatial Context
    geospatial: {
      land_cover_class: "Industrial / Built-up Infrastructure (ESA WorldCover 2021 Class 50)",
      facility_name: "NTPC / Jindal Power Utility Complex Gate 4",
      facility_type: "Coal-Fired Thermal Power Station",
      distance_to_facility_m: 42,
      nearest_transport: "NH-55 National Highway (1.8 km downwind)",
      surface_wind: {
        speed_kmh: 20,
        direction: "NE",
        threat_corridor_km: 3.4,
        impact_zone: "NH-55 Highway & Sector 4 Settlement"
      }
    },

    // Block 5: Risk Score & Contributing Factors
    risk: {
      score: 96,
      tier: "CRITICAL", // CRITICAL, HIGH, MODERATE, ROUTINE
      contributing_factors: [
        { factor: "Extreme Fire Radiative Power (710 MW)", weight_pct: 35, impact: "+34 pts" },
        { factor: "High-Density Industrial Infrastructure & Coal Reserve", weight_pct: 25, impact: "+26 pts" },
        { factor: "Downwind Plume Crossing Primary Arterial Highway (NH-55)", weight_pct: 20, impact: "+21 pts" },
        { factor: "Proximity to Populated Buffer Zone (82K residents within 5km)", weight_pct: 20, impact: "+15 pts" }
      ]
    },

    // Analyst Verification Workflow
    analyst_verification: {
      status: "CONFIRMED", // UNVERIFIED, CONFIRMED, FLAGGED
      verified_by: "Analyst NTRO-08 (P. Pandi)",
      verified_at: "2026-09-19T04:42:00Z",
      notes: "Satellite FRP spike confirmed against OSM coal handling infrastructure. Forwarded to Odisha Command for NDRF mobilization."
    }
  },

  {
    id: "INC-2026-0042",
    title: "Similipal Tiger Reserve Forest Wildfire",
    location_name: "Mayurbhanj District, Odisha",
    state: "Odisha",
    district: "Mayurbhanj",
    coordinates: { lat: 21.8200, lon: 86.4200 },
    timestamp_utc: "2026-09-19T03:55:00Z",
    satellite_source: "VIIRS NOAA-20 (375m)",
    
    satellite: {
      frp_mw: 142.6,
      brightness_temp_k: 345.2,
      brightness_temp_c: 72.0,
      track_m: 375,
      scan_m: 375,
      satellite_name: "NOAA-20",
      instrument: "VIIRS",
      pass_type: "Ascending Overpass",
      detection_confidence_pct: 91
    },

    classification: {
      category: "wildfire",
      label: "Episodic Forest Canopy Wildfire",
      confidence_pct: 92,
      model_version: "FireSense-ResNet-v4.2",
      evidence: [
        "Located inside protected biosphere reserve (ESA WorldCover Class 10: Tree Cover)",
        "Rapid lateral expansion rate (>180 m/hr) along ridge elevation line",
        "NDVI vegetation moisture index dropped 42% over past 14 days of dry spell",
        "Absence of industrial facilities within 28 km radius"
      ],
      counter_evidence: [
        "Light cloud fringe at 12,000 ft partially obscuring eastern perimeter"
      ]
    },

    persistence: {
      observations_in_window: 4,
      window_days: 60,
      persistence_score_pct: 6.7,
      normal_seasonal_range: "0-2 observations",
      anomaly_ratio: "Transient Episodic Outbreak",
      dot_history: [
        false, false, false, false, false, false, false, false, false, false,
        false, false, false, false, false, false, true, true, true, true
      ],
      verdict: "Classic transient episodic outbreak — typical of uncontained canopy forest fire"
    },

    geospatial: {
      land_cover_class: "Dense Deciduous Forest (ESA WorldCover 2021 Class 10)",
      facility_name: "Similipal National Park Core Wildlife Zone",
      facility_type: "Biosphere Reserve / Protected Forest",
      distance_to_facility_m: 0,
      nearest_transport: "Forest Patrol Track #3 (4.2 km)",
      surface_wind: {
        speed_kmh: 18,
        direction: "NE",
        threat_corridor_km: 2.8,
        impact_zone: "Tiger Corridor & West Range Beat"
      }
    },

    risk: {
      score: 87,
      tier: "CRITICAL",
      contributing_factors: [
        { factor: "Ecological Sensitivity (National Biosphere & Tiger Habitat)", weight_pct: 40, impact: "+38 pts" },
        { factor: "High Rate of Lateral Canopy Spread (18 km/h Wind)", weight_pct: 30, impact: "+27 pts" },
        { factor: "Thermal Radiation & Heavy Smoke Plume", weight_pct: 20, impact: "+16 pts" },
        { factor: "Inaccessible Terrain (Delayed Ground Ingress)", weight_pct: 10, impact: "+6 pts" }
      ]
    },

    analyst_verification: {
      status: "CONFIRMED",
      verified_by: "Analyst NTRO-04 (K. Nair)",
      verified_at: "2026-09-19T04:10:00Z",
      notes: "Confirmed episodic wildfire in core tiger habitat. Priority alert dispatched to Principal Chief Conservator of Forests."
    }
  },

  {
    id: "INC-2026-0043",
    title: "Jamnagar Petrochemical Refining Flare",
    location_name: "Jamnagar Industrial Estate, Gujarat",
    state: "Gujarat",
    district: "Jamnagar",
    coordinates: { lat: 22.3580, lon: 69.8310 },
    timestamp_utc: "2026-09-19T04:15:00Z",
    satellite_source: "VIIRS S-NPP (375m)",

    satellite: {
      frp_mw: 88.4,
      brightness_temp_k: 358.1,
      brightness_temp_c: 84.9,
      track_m: 375,
      scan_m: 375,
      satellite_name: "Suomi NPP",
      instrument: "VIIRS",
      pass_type: "Night-time Overpass",
      detection_confidence_pct: 94
    },

    classification: {
      category: "gas-flare",
      label: "Licensed Industrial Gas Flare / Elevated Stack",
      confidence_pct: 98,
      model_version: "FireSense-ResNet-v4.2",
      evidence: [
        "Matches registered elevated flare stack #2 in Reliance Jamnagar Refinery cadastre",
        "Continuous 365-day thermal persistence profile across all nighttime satellite passes",
        "Zero footprint expansion beyond licensed concrete flare containment bund",
        "Combustion efficiency indices consistent with high-temperature hydrocarbon flaring"
      ],
      counter_evidence: []
    },

    persistence: {
      observations_in_window: 59,
      window_days: 60,
      persistence_score_pct: 98.3,
      normal_seasonal_range: "55-60 observations",
      anomaly_ratio: "1.02x (Normal Operating Range)",
      dot_history: [
        true, true, true, true, true, true, true, true, true, true,
        true, true, true, true, true, true, true, true, true, true
      ],
      verdict: "Permanent operational facility — thermal signature normal and fully compliant"
    },

    geospatial: {
      land_cover_class: "Heavy Industrial Petrochemical Complex (ESA WorldCover Class 50)",
      facility_name: "Jamnagar Export Refinery Flaring Unit 2",
      facility_type: "Petroleum Refinery & Flare Stack",
      distance_to_facility_m: 15,
      nearest_transport: "State Highway 26 (Enclosed 1.2 km perimeter)",
      surface_wind: {
        speed_kmh: 9,
        direction: "W",
        threat_corridor_km: 0.2,
        impact_zone: "Contained Facility Perimeter"
      }
    },

    risk: {
      score: 38,
      tier: "ROUTINE",
      contributing_factors: [
        { factor: "Licensed Gas Flare Stack (Known Registered Facility)", weight_pct: 50, impact: "-40 pts" },
        { factor: "Enclosed Industrial Buffer & Bunding", weight_pct: 30, impact: "-20 pts" },
        { factor: "Moderate Thermal Intensity (88 MW)", weight_pct: 20, impact: "+18 pts" }
      ]
    },

    analyst_verification: {
      status: "CONFIRMED",
      verified_by: "Analyst NTRO-12 (M. Sharma)",
      verified_at: "2026-09-19T04:20:00Z",
      notes: "Routine flaring confirmed within normal emissions license. No emergency dispatch required."
    }
  },

  {
    id: "INC-2026-0045",
    title: "Clandestine Scrubland Anomaly",
    location_name: "Singrauli Buffer Zone, MP/UP Border",
    state: "Madhya Pradesh",
    district: "Singrauli",
    coordinates: { lat: 24.1840, lon: 82.6530 },
    timestamp_utc: "2026-09-19T03:10:00Z",
    satellite_source: "VIIRS S-NPP (375m)",

    satellite: {
      frp_mw: 52.3,
      brightness_temp_k: 339.4,
      brightness_temp_c: 66.2,
      track_m: 375,
      scan_m: 375,
      satellite_name: "Suomi NPP",
      instrument: "VIIRS",
      pass_type: "Night-time Overpass",
      detection_confidence_pct: 78
    },

    classification: {
      category: "illegal",
      label: "Unregistered Clandestine Thermal Source",
      confidence_pct: 81,
      model_version: "FireSense-ResNet-v4.2",
      evidence: [
        "Unregistered recurring thermal anomaly in designated forest buffer scrubland",
        "Persistent intermittent night-time activations (34 of 60 passes) with zero registered lease",
        "Matches pattern of illegal brick kiln / unauthorized biomass processing kiln",
        "No authorized facility within 1.4 km radius on State Cadastral GIS"
      ],
      counter_evidence: [
        "Moderate FRP (52 MW) below major commercial metallurgical smelter scale"
      ]
    },

    persistence: {
      observations_in_window: 34,
      window_days: 60,
      persistence_score_pct: 56.7,
      normal_seasonal_range: "0-2 observations",
      anomaly_ratio: "Clandestine Repetitive Signal",
      dot_history: [
        false, true, false, true, true, false, true, true, false, true,
        true, false, true, false, true, true, false, true, true, false
      ],
      verdict: "Suspicious intermittent nocturnal frequency — requires field environmental inspection"
    },

    geospatial: {
      land_cover_class: "Open Scrub & Degraded Forest (ESA WorldCover Class 20)",
      facility_name: "None (Unregistered Forest Buffer)",
      facility_type: "Unauthorized Encroachment Site",
      distance_to_facility_m: 1420,
      nearest_transport: "Rural Dirt Track (800m)",
      surface_wind: {
        speed_kmh: 11,
        direction: "E",
        threat_corridor_km: 0.9,
        impact_zone: "Adjacent Reserved Forest Compartment 14"
      }
    },

    risk: {
      score: 79,
      tier: "HIGH",
      contributing_factors: [
        { factor: "Unregistered / Clandestine Nocturnal Activity", weight_pct: 40, impact: "+35 pts" },
        { factor: "Location Inside Vulnerable Forest Buffer Compartment", weight_pct: 30, impact: "+25 pts" },
        { factor: "Recurrent Nighttime Heat Signal (56% Persistence)", weight_pct: 20, impact: "+14 pts" },
        { factor: "Uncontrolled Emissions Potential", weight_pct: 10, impact: "+5 pts" }
      ]
    },

    analyst_verification: {
      status: "UNVERIFIED",
      verified_by: null,
      verified_at: null,
      notes: "Pending analyst on-duty review. Recommended for ground drone reconnaissance."
    }
  },

  {
    id: "INC-2026-0041",
    title: "Sangrur Agricultural Crop Residue",
    location_name: "Sangrur Agricultural District, Punjab",
    state: "Punjab",
    district: "Sangrur",
    coordinates: { lat: 30.2480, lon: 75.8390 },
    timestamp_utc: "2026-09-19T02:40:00Z",
    satellite_source: "MODIS Terra (1km)",

    satellite: {
      frp_mw: 24.5,
      brightness_temp_k: 328.0,
      brightness_temp_c: 54.8,
      track_m: 1000,
      scan_m: 1000,
      satellite_name: "Terra",
      instrument: "MODIS",
      pass_type: "Daytime Overpass",
      detection_confidence_pct: 89
    },

    classification: {
      category: "crop-burning",
      label: "Agricultural Crop Residue / Stubble Burning",
      confidence_pct: 89,
      model_version: "FireSense-ResNet-v4.2",
      evidence: [
        "ESA WorldCover Class 40: Cropland verified on Punjab Remote Sensing Centre baseline",
        "Spatial clustering matches seasonal post-harvest paddy clearing cycle",
        "Short thermal lifetime (<3 hours) typical of open field stubble burning",
        "Low-to-moderate FRP (24.5 MW) characteristic of surface vegetative burns"
      ],
      counter_evidence: [
        "Smoke dispersion plume crossing State Highway 11 at 14 km/h"
      ]
    },

    persistence: {
      observations_in_window: 1,
      window_days: 60,
      persistence_score_pct: 1.7,
      normal_seasonal_range: "0-3 observations",
      anomaly_ratio: "Transient Field Fire",
      dot_history: [
        false, false, false, false, false, false, false, false, false, false,
        false, false, false, false, false, false, false, false, false, true
      ],
      verdict: "Seasonal transient agricultural clearing event"
    },

    geospatial: {
      land_cover_class: "Intensive Herbaceous Cropland (ESA WorldCover Class 40)",
      facility_name: "Agricultural Farmland Block 12",
      facility_type: "Paddy Farmland Cluster",
      distance_to_facility_m: 0,
      nearest_transport: "State Highway 11 (650m)",
      surface_wind: {
        speed_kmh: 14,
        direction: "NW",
        threat_corridor_km: 1.5,
        impact_zone: "State Highway 11 & Rural Village Airshed"
      }
    },

    risk: {
      score: 62,
      tier: "MODERATE",
      contributing_factors: [
        { factor: "Air Quality / Highway Visibility Degradation", weight_pct: 35, impact: "+24 pts" },
        { factor: "Proximity to Rural Road Transit Corridor", weight_pct: 25, impact: "+18 pts" },
        { factor: "Transient Agricultural Intensity (24.5 MW)", weight_pct: 20, impact: "+12 pts" },
        { factor: "Low Structural Damage Potential", weight_pct: 20, impact: "+8 pts" }
      ]
    },

    analyst_verification: {
      status: "CONFIRMED",
      verified_by: "Analyst NTRO-02 (R. Chawla)",
      verified_at: "2026-09-19T03:15:00Z",
      notes: "Agricultural residue burning confirmed. Automatically mapped into Air Quality Monitoring Network."
    }
  }
];
