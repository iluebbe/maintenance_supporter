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

1. **Signature catalog v2** (suggested setups): ✅ `ecovacs` (percent_left,
   incl. GOAT mowers), ✅ `husqvarna_automower` + `landroid_cloud`
   (`usage_above` direction, 100 usage-hours default) — both shipped.
   `kia_uvo` deferred: the next_service_distance entity is verified to exist,
   but whether it reports *remaining* distance or an odometer *target* needs
   a deeper source dive before a direction can be chosen. Skip BMW (dead),
   defer Valetudo.
2. ✅ **New template: Robot Lawn Mower** (shipped) (blade replacement, undercarriage
   cleaning, charging-contact cleaning, winter storage w/ frost note) — three
   popular mower integrations and no matching template today.
3. **Source dives** for Home Connect / LG ThinQ / ViCare — **done 2026-07-17**:
   - ✅ **LG ThinQ (core `lg_thinq`)** — filter sensors cataloged: AC filter
     (hours → duration_left), air-purifier/RAC + refrigerator water filters
     (percent). Gotcha handled: `translation_key="filter_lifetime"` is shared by
     an hours AND a percent description → the matcher is now **unit-aware**
     (percent_left claims `%` entities, duration/usage claim the rest).
   - ✅ **LG ThinQ (HACS `smartthinq_sensors`)** — same filters (matched by
     entity-id suffix; the integration sets no translation_key) plus the washer
     **tub-clean counter** (`tub_clean_counter`, unitless wash-cycle count →
     `usage_above`, resets on a tub-clean course).
   - ✅ **ViCare** — ventilation `filter_remaining_hours` (duration_left). Burner
     & compressor hours are lifetime counters with no reset → **not** cataloged;
     boiler service stays a yearly calendar template.
   - ✅ **Home Connect** — cataloged via a NEW `event_present` direction. Its
     maintenance signals are `sensor` ENUM *event* entities (`present`/`off`/
     `confirmed`), not percent/countdown — so a numeric threshold doesn't fit.
     They now adopt as a **state_change latch on `present`** (salt/rinse-aid,
     coffee descale/clean, hood grease filter). This first required fixing the
     `state_change` trigger, whose `auto_complete_on_recovery` never fired for
     single-shot state alarms (it only counted transitions up) — the same
     latent gap affected adopted problem sensors; both now auto-resolve when the
     alert state clears. Coffee lifetime counters stay uncataloged (no reset).
   - ❌ **Tado** — nothing counts/depletes/resets; only a battery-LOW binary
     (device_class BATTERY). Dropped from the candidate list.
4. Cars: rely on counter/delta triggers (odometer) + problem-sensor adoption
   (warning binaries); a signature entry only for kia_uvo's service-distance.

## HACS custom-integration triage (2026-07-17)

Ranked by `analytics.home-assistant.io/custom_integrations.json` `total`
(opt-in → undercounts; use as a RANKING proxy). Entity claims are triage-level
(READMEs/docs), NOT source-verified — every catalog entry still needs a source
dive. Infra/frontend/utility integrations with the largest installs (hacs,
sonoff, localtuya, alexa_media, webrtc, frigate, browser_mod, spook, alarmo,
adaptive_lighting, powercalc, battery_notes, waste_collection_schedule, ble_
monitor, pyscript, camera integrations, virtual thermostats) have **no
wear/consumable surface** — not candidates.

Source-dive shortlist (device integrations with real maintenance signals):

| Priority | HACS slug | ~Installs | Signal → direction |
|---|---|---|---|
| 1 | **xiaomi_miot** (al-one) | 21,009 | air-purifier/humidifier/water-purifier `filter_life_remaining` % → percent_left; `filter_left_time` days → duration_left; `filter_used_time` h → usage_above; vacuum brush/filter/sensor life. Exercises all 4 directions in one family. |
| 2 | **bambu_lab** (greghesp) | 19,141 | NEW category (3D printer): AMS tray filament remaining % → percent_left; AMS-2-Pro dry-cycle countdown → duration_left. Nozzle wear is NOT a sensor — verify before promising usage_above. |
| 3 | **xiaomi_home** (al-one) | 17,230 | same Xiaomi MIoT consumable classes; dive alongside #1 (likely shared spec keys); confirm it doesn't just duplicate core `xiaomi_miio` (already covered). |
| 4 | **midea_ac_lan** (wuwentao) | 11,621 | AC "Clean Filter" alert state → event_present; washers/water heaters — check maintenance flags. |
| 5 | **hass_dyson** (cmgrayb) | 1,361 | cleanest signal: `hepa_filter_life` + `carbon_filter_life` both % → percent_left (created only when filter present). Low base, low risk. |
| 6 | **dreo** (JeffSteinbok) | 4,864 | air-purifier `filter_life_remaining` % → percent_left. |
| 7 | **tuya_local** (make-all) + **xtend_tuya** | 14,498 + 3,121 | vacuum roller/side-brush/filter life % + purifier filter as standardized quirks (unlike raw localtuya) → percent_left. Scoped dive: enumerate which device quirks carry consumable %. |
| 8 | **daikin_onecta** | 6,164 | HVAC filter-cleaning indicator → event_present (verify entity exists). |

Also noted: electrolux_status (1,841; AEG/Electrolux washer/dryer/purifier filter
% + rinse-aid states), mbatt/mercedes mbapi2020 (2,436; next-service due). Absent
from analytics (tiny/no opt-in base → deprioritize despite category fit): pool
(Hayward/Pentair/AquaPure), water softeners, xiaomi_miot_raw, dyson_local fork.

**Highest-yield next dive: xiaomi_miot** (single family, all four directions,
~38k combined opt-in installs with xiaomi_home).

### xiaomi_miot — source dive DONE, ✅ cataloged
Generic MIoT-spec integration: entity_id suffix = the spec property name
(`core/miot_spec.py` `format_name` + `eid = f'{model}_{mac[-4:]}_{desc_name}'`);
translation_key is the noisier `<service>-<prop>` form. Cataloged the **percent**
consumables, matched by entity_id suffix:
- `filter_life_level` (%) → "Replace Filter" — air purifiers/humidifiers/water
  purifiers/vacuums all share it.
- `brush_life_level` (%) → "Replace Main Brush" — vacuums.

Deliberately **percent-only**: the same filter also exposes `filter_left_time`
(days, countdown) and `filter_used_time` (hours, counts up) — cataloging those
would create two or three *duplicate* "Replace Filter" tasks on one device. The
side-brush shares the `brush_life_level` name and collides to a `_2` entity_id
suffix, so only the main brush is matched (acceptable — brushes are replaced
together). No new i18n (both task names already exist).

**xiaomi_home** (official XiaoMi/ha_xiaomi_home) — ✅ cataloged after extending
the matcher with a third pattern: the `_<key>_p_` infix (its entity_id is
`..._filter_life_level_p_{siid}_{piid}`, property mid-string, no
translation_key). Same filter/brush percent signatures as xiaomi_miot; matching
stays scoped per integration so the infix cannot bleed.

### bambu_lab — source dive DONE → 3D Printer template + usage_delta signature
`definitions.py`: filament remaining is only an ATTRIBUTE of the tray sensor
(no entity — an attribute trigger would be possible but tracks spool
consumption, not device wear, and resets on every spool swap → deliberately
skipped as noisy); `remaining_drying_time` is an operational cycle countdown;
no filter-lifetime entity. Its `hms`/`print_error` binaries are device_class
problem → already covered by problem-sensor adoption. Shipped: **"3D Printer"
calendar template** (catalog 33) **plus** a `total_usage_hours` signature via
the NEW `usage_delta` direction (see below) — "Lubricate Rails and Rods" every
500 print-hours.

### CORRECTION: lifetime counters ARE usable → `usage_delta` direction
Earlier verdicts rejected lifetime counters ("no reset → fails the usage_above
contract"). That was wrong: the trigger engine has a **counter trigger with
delta mode** (`trigger_delta_mode` — fires when value − baseline ≥ target;
completing the task re-baselines; rollover and unavailable-at-completion are
handled) and **attribute triggers** (`trigger_config.attribute`). The 5th
signature direction `usage_delta` now wires exactly that. Re-verdicted:
- ✅ bambu_lab `total_usage_hours` → Lubricate Rails and Rods / 500 h delta.
- ✅ vicare `burner_hours`/`compressor_hours` → Annual Inspection / 2000 h
  delta (boiler & heat-pump service by operating hours).
- Home Connect coffee lifetime counters stay uncataloged — a deliberate call,
  not a limitation: the integration's own descale/clean EVENT sensors are the
  appliance's calibrated signal, and a second counter-based "Descale Appliance"
  row on the same device would duplicate them.
- ✅ Cars SHIPPED via `usage_delta`: **kia_uvo** (translation_key `odometer`,
  dynamic km/mi), **tesla_custom** (entity-id suffix `_odometer`, native mi, no
  translation_key), **renault** (translation_key `mileage`, km) — "Annual
  Service" every 15,000 km, unit-aware (mi target = km × 0.62137). The
  kia_uvo `next_service_distance` stays unused (target-vs-remaining semantics
  still unverified; the odometer delta needs no such guess). Core Tesla trio
  (teslemetry/tessie/tesla_fleet) NOT cataloged: odometer translation_key not
  verifiable from the description (and entity is default-disabled) — needs its
  own dive before entry.

### Full re-audit under the usage_delta/attribute insight (2026-07-18)

Every earlier verdict re-checked against the complete trigger engine
(threshold, state latch, counter delta, attribute):
- **Flipped → shipped**: bambu_lab usage hours, vicare burner/compressor
  hours, kia_uvo/tesla_custom/renault odometers (above).
- **Deliberately unchanged**: Home Connect coffee counters (descale/clean
  EVENTS are the appliance's calibrated signal — a counter twin would
  duplicate the task); LG ThinQ `used_time` (same filters as the percent
  signatures — duplicate); Bambu filament `remain` attribute (spool
  consumption, not wear; resets on swap); husqvarna/roborock cumulative
  runtimes (their consumable signatures already cover the real maintenance;
  a second "service by runtime" row per vacuum adds noise, and the mower
  template has Winter Storage for the annual service); brother page counters
  (drum/toner/belt/fuser percent already cover every consumable the pages
  would proxy).
- **Still not usable**: Tado (nothing counts or depletes — unchanged).

### midea_ac_lan — source dive DONE, ✅ cataloged
`midea_devices.py` + `midea_entity.py` (translation_key set per attribute;
entity_id = `{device_id}_{entity_key}`): 0xED water purifier `filter1/2/3_life`
(%) → ONE any-low "Replace Water Filter" task (the `filterN_days` countdowns
describe the same filters — percent only, no duplicates); 0xC2 `filter_life`
(%) → "Replace Filter". The A1/CE filter-cleaning/change reminders and the AC
`full_dust` alert are device_class problem binaries → already covered by
problem-sensor adoption (verified verbatim in source).

### miele — source dive DONE (2026-07-18), ✅ cataloged (user-suggested)
Core `miele/sensor.py`: REAL percent fill levels (better than Home Connect's
events) — dishwasher `salt_level` / `rinse_aid_level` / `power_disk_level`
(PowerDisk AutoDos), washer `twin_dos_1_level` / `twin_dos_2_level` (TwinDos).
Cataloged as percent_left: Refill Salt / Refill Rinse Aid / Refill Detergent
(PowerDisk + TwinDos collapse to one any-low task). Coffee
descaling/degreasing/milk-cleaning counters are TOTAL_INCREASING tallies of
*performed* maintenance — unclear delta semantics, skipped.

## Follow-up candidates (parked)

- ~~**NavimowHA**~~ — source dive DONE (2026-07-18 @ pgoutsos/NavimowHA main):
  sensor.py defines ONLY battery/position/heading/zone/mow-progress — **no
  blade or maintenance sensors exist**. Nothing to catalog; Navimow owners are
  served by the Robot Lawn Mower calendar template. Re-check if the upstream
  integration grows blade sensors.
- **WeBack** (Jezza34000/homeassistant_weback_component, WeBack/Tesvor
  vacuums) — same route; check for consumable sensors.
- **kia_uvo service-distance** — verify remaining-distance vs odometer-target
  semantics before choosing a direction.
- **Valetudo** — MQTT-discovery-name matching (per-consumable minutes or
  percent), harder than translation_key.
