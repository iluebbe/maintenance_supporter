# Integration popularity & maintenance-signal research (2026-07-17)

Grounding for the next template + suggested-setup waves: which integrations
are popular (core **and** HACS), and which expose *real* consumable/wear
sensors vs. mere status. Install counts verified directly against
[analytics.home-assistant.io](https://analytics.home-assistant.io)
(`current_data.json` + `custom_integrations.json`, fetched 2026-07-17 —
opt-in analytics, so absolute numbers undercount; relative ranking is the
signal). Entity claims cite the integration docs/repos; **every signature we
ship must still be verified against the integration source code** (catalog
method contract).

## Verified install counts (2026-07-17)

| Category | Integration | Where | Installs |
|---|---|---|---|
| Printers | `ipp` | core | 151,670 |
| Printers | `brother` | core | 44,871 |
| Vacuums | `roborock` | core | 47,655 |
| Vacuums | `dreame_vacuum` | HACS | 13,830 |
| Vacuums | `xiaomi_miio` | core | 12,046 |
| Vacuums | `ecovacs` | core | 11,649 |
| Vacuums | `sharkiq` | core | 1,148 |
| Vacuums | `valetudo` (native MQTT) | HACS | 250 (undercounts — most run via core MQTT) |
| Kitchen | `home_connect` (Bosch/Siemens) | core | 25,732 |
| Kitchen | `lg_thinq` | core | 23,137 |
| Kitchen | `smartthinq_sensors` | HACS | 10,153 |
| Kitchen | `miele` | core | 9,351 |
| Heating | `tado` | core | 11,381 |
| Heating | `vicare` (Viessmann) | core | 5,722 |
| Mowers | `landroid_cloud` (Worx) | HACS | 4,517 |
| Mowers | `mammotion` | HACS | 3,382 |
| Mowers | `gardena_smart_system` | HACS | 3,323 |
| Mowers | `husqvarna_automower` | core | 2,343 |
| Cars | `kia_uvo` (Hyundai/Kia) | HACS | 5,270 |
| Cars | `tesla_custom` | HACS | 4,578 |
| Cars | `tesla_fleet` / `tessie` / `teslemetry` | core | 3,944 / 1,748 / 940 |
| Cars | `renault` | core | 3,871 |
| Cars | `volkswagencarnet` | HACS | 2,445 |
| Cars | `bmw_connected_drive` | core | 745 — **REMOVED** (BMW blocked 3rd-party access 2025-09-29; do NOT catalog) |

## Signal quality per candidate (docs/repo-sourced, to be code-verified)

**Real consumable/wear sensors (signature-ready):**
- **Ecovacs (core)** — per-consumable *remaining lifespan %* entity + a
  matching reset button per consumable; also covers the **GOAT robotic
  mowers**. Same shape as our existing percent signatures → cheapest, most
  impactful next catalog entry.
- **Husqvarna Automower (core)** — dedicated *cutting blade usage time*
  sensor (+ reset button), cumulative cutting/running/charging time, charging
  cycles, collisions. Counts **up** → needs an `usage_above` signature
  direction (threshold trigger_above N hours), which the trigger engine
  already supports.
- **Landroid Cloud (HACS)** — blade runtime total / since-reset sensors
  (counts up → same `usage_above` direction).
- **Valetudo (MQTT)** — ConsumableMonitoringCapability publishes per-consumable
  minutes **or** percent depending on robot model; matching is
  MQTT-discovery-name based, harder than translation_key → later.
- **kia_uvo (HACS)** — *Last/Next Service Distance* sensors (genuinely
  maintenance-native) + odometer; tire/fluid signals are boolean warnings
  (problem-sensor adoption covers those, not signatures).
- **tesla_custom (HACS)** — odometer + TPMS pressures; odometer-based service
  = our **counter/delta trigger** (every N km), not threshold. Note: Owner
  API is being phased out by Tesla; core trio combined (6.6k) ≈ tesla_custom.

**Needs a source dive before cataloging (installs justify it):**
- **Home Connect** — dishwasher salt/rinse-aid signals appear event/binary
  flavoured rather than % levels; verify entity keys in core source first.
- **LG ThinQ (core + HACS)** — same: verify what maintenance signals exist.
- **ViCare / Tado** — burner starts/operating hours (counts up) resp. mostly
  status; verify before promising anything.

## Priorities derived

1. **Signature catalog v2** (suggested setups): `ecovacs` (percent_left, incl.
   GOAT mowers) → `husqvarna_automower` + `landroid_cloud` (NEW `usage_above`
   direction) → `kia_uvo` (service-distance). Skip BMW (dead), defer Valetudo.
2. **New template: Robot Lawn Mower** (blade replacement, undercarriage
   cleaning, charging-contact cleaning, winter storage w/ frost note) — three
   popular mower integrations and no matching template today.
3. **Source dives** for Home Connect / LG ThinQ / ViCare before any promise.
4. Cars: rely on counter/delta triggers (odometer) + problem-sensor adoption
   (warning binaries); a signature entry only for kia_uvo's service-distance.
