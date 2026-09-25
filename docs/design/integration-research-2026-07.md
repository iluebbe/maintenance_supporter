# Integration popularity & maintenance-signal research (2026-07-17)

> Evaluation method: see
> [signature-evaluation-scheme.md](signature-evaluation-scheme.md) — the
> direct→derived trigger ladder every candidate walks before any verdict.

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

## Full catalog re-audit against the evaluation scheme (2026-07-18)

All 22 cataloged integrations re-walked after the ladder gained
`usage_delta` and `runtime_hours` (per the governance rule: scheme grows →
re-audit everything). Authoritative count: **22 integrations / 53
task-signatures** (28 percent, 10 duration, 6 delta, 5 event, 3 above,
1 runtime).

**Confirmed optimal (most-direct signal per duty, no additions):**
- Vacuums (roborock, xiaomi_miio, dreame, ecovacs, xiaomi_miot/home): every
  wear duty (brushes, filter, sensors, dust bag, mop) is covered by a direct
  percent/countdown signal. A runtime-based "empty dustbin" task was
  considered and rejected — it's an after-every-run routine, not a trackable
  maintenance interval.
- Printers (ipp, brother): percent covers every consumable a page counter
  would proxy. bambu_lab: usage_delta on print hours is the direct signal.
- Kitchen (lg_thinq, smartthinq, midea, miele, home_connect): fill levels /
  percent / events all direct; LG `used_time` and Home Connect coffee
  counters remain correctly excluded as duplicates of more direct signals.
- Heating (vicare): countdown for the filter, delta for burner/compressor —
  both rungs used correctly.
- Cars (kia_uvo, tesla_custom, renault): odometer delta is the only
  wear-proportional signal exposed; service-distance sensors stay unverified.
- Mowers (husqvarna, landroid, gardena, navimow): blade duty covered by the
  most direct counter each integration has (device wear counter > lifetime
  hours > engine runtime, in that order).

**Structural finding (new ROADMAP candidate): one source entity can only
feed ONE signature.** The matcher `break`s after the first signature an
entity matches, and adopted entities are excluded from re-discovery
(`already_watched`). That's correct for consumables, but it blocks
*multi-duty* proposals from a single usage source — e.g. "Clean
Undercarriage every 25 mowing-hours" **alongside** "Replace Blades every
100 h" from the same `operating_hours`/state entity. Husqvarna's separate
cumulative-runtime sensors could carry a second duty today; Gardena/Navimow
could not. Needs a matcher/exclusion rework (per-duty entity claims instead
of per-entity) before per-usage-source task bundles can ship.

## Re-audit round 2 — NEW duties from derived triggers (2026-07-18)

Second pass with the opposite question: which NEW tasks do the derived
directions make possible? Prerequisite shipped first: the matcher's
one-signature-per-entity `break` was removed — **one source entity may now
back several duties**. (Since 2026-07-26 the exclusion is per duty too: a
deselected duty stays adoptable on later discovery runs; only a watcher
renamed away from its catalog name claims the whole entity.)

**Added (8 signatures, all names already localized):**
- **Clean Undercarriage by mowing time** on all four mower integrations:
  husqvarna `total_cutting_time` (separate lifetime stat, s→h), landroid
  `mower_runtime_total` (min→h), gardena `operating_hours` (2nd duty on the
  same entity), navimow lawn_mower runtime (2nd runtime duty) — usage_delta/
  runtime 25 h.
- **Clean Charging Contacts** on husqvarna via `number_of_charging_cycles`
  (unitless lifetime counter → usage_delta every 100 docking cycles).
- **Tire Rotation every 10,000 km** on kia_uvo / tesla_custom / renault —
  second odometer duty next to the 15,000 km Annual Service (miles converted:
  6,213.7 mi).

**Verified and REJECTED:**
- ~~Miele "Clean Tub" via status runtime~~ — **UNBLOCKED and shipped** after
  the device-type gates landed (user-directed): the signature is
  sibling-gated to washers via `require_sibling_keys`
  (`twin_dos_1/2_level`/`spin_speed` — all washer-only per core sensor.py
  `types=` gating), so the identical `status` key on dishwashers/ovens no
  longer mis-proposes. Runtime 60 wash-hours, `in_use` state (verified).
  Bambu got the second gate: `models` (registry model = device_type enum
  X1C/P1S/A1…) gates a NEW **chamber-filter duty (Replace Filter every 300
  print-hours) to enclosed printers** — an A1 next to an X1C gets only the
  lubrication task.
- Vacuum runtime duties (dustbin etc.): still rejected — after-every-run
  routine, not a trackable interval; consumable signatures cover the real
  wear duties.
- Bambu second usage duty (belt check): one usage-interval task per printer
  suffices; belts stay on the calendar template.
- ViCare water pressure (bar) — would need a raw value-below direction
  (the hour-canonical threshold conversion doesn't apply); parked.

## Candidate wave 3 — shortlist worked off (2026-07-18)

- ✅ **hass_dyson** — DysonFilterLifeSensor, translation_key `filter_life` for
  BOTH hepa and carbon instances, PERCENTAGE → one any-low "Replace Filter".
- ✅ **dreo** — translation_key `filter_life`, unit `%` (humidifiers with
  FILTERTIME support) → percent_left.
- ✅ **weback_vacuum** — NO sensors at all (only vacuum.py/camera.py); all
  clean modes map to STATE_CLEANING → engine-runtime duties on the vacuum
  entity: Filter Cleaning 15 h + Clean Main Brush 30 h.
- ✅ **electrolux_status** — catalog `FilterLife` (PERCENTAGE); entity_id is
  assigned raw as `..._{entity_attr}` and HA slugifies the tail, so both slug
  forms (`filterlife`/`filter_life`) are matched.
- ✅ **mbapi2020 (Mercedes)** — SENSORS `odometer` (name → suffix; attributes
  carry serviceintervaldays/distance) → Annual Service 15,000 km + Tire
  Rotation 10,000 km.
- ❌ **daikin_onecta** — verified negative: no filter/dirty indicator in
  const.py/binary_sensor.py (the air-filter icon belongs to `streamerMode`,
  a mode setting). Re-check if upstream adds one.
- **tuya_local / xtend_tuya** stay parked: consumable keys are per-product
  quirks — a scoped dive must enumerate which quirks carry filter/brush
  percent before anything is cataloged.

## Model-aware Bambu wave (post-v2.30, user-directed)

Roadmap item implemented in the signature layer (model known at adoption):
- `models_exclude` gate added (substring models=("AMS",) would swallow
  "AMS Lite" — the Lite has NO desiccant compartment and must not qualify).
- NEW 7th direction `alert_above`: plain threshold above a MEASUREMENT in the
  entity's own unit + auto_complete_on_recovery — correct here (unlike wear
  counters) because the maintenance genuinely lowers the value.
- New duties: Clean Carbon Rods 100 print-h (X1/P1S/P1P CoreXY), Replace
  Purge Wiper 300 h (A1 series), Replace Desiccant on AMS/AMS 2 Pro/AMS HT
  via measured humidity > 40 % (key "humidity" in definitions.py, verified;
  AMS devices carry their own registry model strings per coordinator.py).
- 3 new task names ×17. Duty intervals are editorial defaults per Bambu's
  maintenance guidance (the wiki is an unfetchable SPA — hardware facts
  grounded on the established model designs; entity keys source-verified).

## Prod-registry gap wave (2026-07-18, user-directed)

The user held their PRODUCTION objects/entities against the catalog — the
strongest possible requirements source. Shipped from it:
- ✅ **synology_dsm** + **qnap** (core, same key): `volume_percentage_used` %
  → "Storage Cleanup" via `alert_above` 85 % (cleanup lowers usage →
  auto-resolve; proof-of-need: the user's manual ">85 % aufräumen" task).
- ✅ **easee**: `lifetime_energy` (kWh, lifetime) → "Inspect Cable and Plug"
  every 5,000 kWh (usage_delta). Core **wallbox verified NEGATIVE**: its
  added_energy is per-session (TOTAL_INCREASING but session-scoped) — a
  lifetime delta would only ever see within-session energy.
- ✅ **bosch** (bosch-thermostat custom component, Buderus via RC300):
  sensors are DYNAMIC (device-named, unprefixed entity ids, no
  translation_keys) → NEW exact-object-id matcher pattern;
  `system_pressure` → "Refill Heating Water" via NEW `value_below` direction
  (below 1 bar, topping up raises it → auto-resolve). numberofstarts /
  working-time counters exist but interval semantics are weak — skipped.
- ✅ **Problem-sensor adoption widened** to device_class `safety` + `tamper`
  (Synology disk-health thresholds ship as safety and previously fell
  through the strict problem filter). Adoption stays opt-in per sensor.
- Parked per user: **mysmartbike** ride_distance (tk `odometry`, m,
  state_class measurement — lifetime vs per-trip semantics unverified).
  esphome devices are un-catalogable by contract (user-defined entities);
  reolink/shelly/fritz/nest correctly out (no wear signals).

### Sibling candidates per device class (user ask — need dives)
- **NAS**: TrueNAS (HACS), OpenMediaVault — volume/disk metrics likely.
- **Wallboxen**: go-e, openWB (MQTT), Keba, myenergi (zappi) — look for
  lifetime energy counters (the easee pattern); session counters don't work.
- **E-Bikes**: mysmartbike (parked), Cowboy (HACS) — odometer semantics
  first. VanMoof effectively dead.
- **Drucker**: generically covered via `ipp` (Epson/HP/most network
  printers) + `brother`. Curiosity: core `epson` (projectors) exposes lamp
  hours → possible "Replace Lamp" usage_delta if demand shows.
- **Kameras**: no wear signals anywhere (reolink/unifi) — template material
  only, no signatures.

## Sibling wave — more wallboxes, NAS, locks incl. Matter (2026-07-18)

User-directed follow-up ("search for comparable integrations"):
- ✅ **keba** (core): 'E total' → suffix `_total_energy` (kWh,
  TOTAL_INCREASING lifetime) → Inspect Cable and Plug every 5,000 kWh.
- ✅ **goecharger_api2** (HACS marq24): Tag.ETO key `eto`, native Wh with
  suggested kWh display → the unit map gained Wh/kWh/MWh (canonical kWh)
  so the 5,000 kWh target converts to the live display unit.
- ✅ **nuki** (core) + ✅ **matter** locks: no wear sensor exists on locks —
  NEW `cycle_count` direction: the ENGINE counts transitions to `locked`
  (state_change, 500 cycles → "Lubricate Cylinder"; completing resets the
  counter). The matter signature is entity_domain-gated to locks, so the
  bridge's other device types are untouched — any Matter lock from any
  vendor qualifies.
- ❌ **truenas** (HACS tomaae) — verified negative for a cleanup signature:
  pools expose `pool_free` in BYTES only, no percent; a byte threshold can't
  default sanely across pool sizes. Re-check if upstream adds a percent.
- Parked for later dives: openWB (MQTT), myenergi/zappi, OpenMediaVault.

## Community-trend sweep — forum + Reddit (2026-07-18, user-directed)

Sources: community.home-assistant.io custom-integrations TOP (quarterly) via
the Discourse JSON API; Reddit r/homeassistant via web search (direct JSON
blocked). Reddit surfaced mostly the known infra set (Mushroom, Browser Mod,
Adaptive Lighting, Powercalc, LocalTuya, Frigate — all non-candidates) plus
Bambu Lab (cataloged).

- ✅ **vw_eu_data_act SHIPPED** (mikrohard/hass-vw-eu-data-act): the hottest
  custom-integrations thread of the quarter (~7.4k views) — official EU Data
  Act portal data for **VW/Audi/Škoda/SEAT/Cupra/Bentley** after upstream
  locked the unofficial WeConnect APIs. Curated sensor
  `CuratedSensor("mileage", "Mileage", "distance", "km", "total_increasing")`
  → the established car pattern (Annual Service 15,000 km + Tire Rotation
  10,000 km, suffix match). Effectively supersedes `volkswagencarnet` (2.4k
  installs, WeConnect-dependent). Competing implementations noted
  (its-me-prash/vwgroup-connect-ha domain `vag_connect`, WulfgarW,
  rafaelhutter) — catalog follows the thread-starter; add others on demand.
- ✅ **mydolphin_plus** (sh00t2kill/dolphin-robot, 76★): FILTER_BAG_STATUS
  enum (empty→full/fault) on the 'Filter Status' entity → event latch on
  'full' ("Filter Cleaning", auto-resolves when the bag is emptied). The
  event_present direction gained a parametrizable latch state (on_states[0],
  default 'present') for it.
- Parked after triage: Silverline/Poolex heat pump + Eveus charger +
  QuietCool fans — tiny star counts (<20), signals unverified; re-check on
  demand.
- Non-candidates: Amazon Price Tracker, Gaming Status, IP Ban Manager,
  calendars/cards/VoIP/police-API etc. (no device wear); Medication
  Reminder + Annuals are adjacent products, not devices.

## Official category sweep — home-assistant.io/integrations (2026-07-18)

User-directed completeness pass over the OFFICIAL category pages (the site
embeds all 1,506 integrations with categories as JS — parsed wholesale and
held against the catalog). Shipped (+11 integrations / +16 signatures):
- **litterrobot** (core): waste_drawer % FULL → alert_above 90 ("Empty Waste
  Drawer" NEW ×17); litter_level % remaining (LR4/5) → percent_left ("Refill
  Litter" NEW ×17); total_cycles lifetime → usage_delta 150 (Wash Litter
  Box). Perfect fit for the new Pets category.
- **husqvarna_automower_ble**: lawn_mower entity, no counters → engine
  runtime (blades 100 h, undercarriage 25 h).
- **subaru** + **volvo** (core): translation_key/key 'odometer' → the car
  pattern. Car lineup now TEN brands.
- **openevse**: 'usage_total' kWh lifetime → cable inspection 5,000 kWh
  (usage_session deliberately unused — per-session).
- Locks +6: **schlage, sesame, yalexs_ble, dormakaba_dkey, deconz,
  homematic** (lock.py verified; ultraloq/aqara have NO core lock platform).
Verdicts without a catalog entry:
- **sensibo** filter_clean is device_class PROBLEM → already covered by
  problem-sensor adoption (no signature needed).
- **nibe_heatpump**: coil-based dynamic entities → un-catalogable by
  contract (like esphome). **smarttub**: reminders lack a clear
  device_class → parked pending a deeper dive. **octoprint/prusalink**: no
  lifetime print-hour sensors (status/job only) → template material.
- Camera/doorbell categories: confirmed zero wear signals anywhere →
  template-only (Security Camera template exists). Irrigation: controllers
  expose no consumables → garden_irrigation template covers it. Climate:
  overwhelmingly thermostats without consumables. Water-heater: statuses
  only (no anode/descale sensors in any core integration). Valve/pump:
  nothing. System-monitor: UPS battery dates (apcupsd/nut) noted as a
  possible future "replace UPS battery" duty (date-based — no direction
  fits today).

## CORRECTION No. 2: state-derived duties across the swept categories

The category sweep's per-category negatives repeated the Navimow mistake at
scale (user-caught, again): "no sensors" is NOT "no signal" — the engine
rungs (runtime_hours / cycle_count / event latch) only need STATE entities.
Re-walked every swept category through the engine rungs:

**Shipped (+8 integrations, mqtt extended, +19 signatures):**
- Sensor-less vacuums get the WeBack pattern (Filter Cleaning 15 h + Clean
  Main Brush 30 h of engine-counted cleaning time): **roomba** (plus an
  event latch on its plain `bin_full` binary — "Empty Dustbin" NEW ×17; NOT
  problem-class, so adoption didn't cover it), **neato, romy, tuya,
  switchbot_cloud, smartthings** (bridges vacuum-domain-gated).
- **mqtt** gains vacuum + lawn_mower runtime duties — this un-parks
  **Valetudo** (MQTT vacuums) and covers **OpenMower**-style DIY mowers at
  the duty level without per-consumable matching.
- **octoprint** (binary 'Printing' → suffix _printing) and **prusalink**
  (ENUM `printer_state` incl. 'printing') flip from negative to
  runtime-based: "Lubricate Rails and Rods" every 500 engine-counted
  print-hours.
- The vacuum-runtime rejection HOLDS for vacuums WITH consumable sensors
  (most-direct-signal rule) — refined, not reversed.

**Refinement round (user-caught, 2026-07-18): most-direct-wins only applies
where a direct signal EXISTS.** Two integrations were wrongly excluded by
over-applying the rule:
- **sharkiq** (core, vacuum.py verified): no consumable/wear sensors at all
  → runtime duties apply (Filter Cleaning 15 h / Clean Main Brush 30 h).
- **tplink** (core, vacuum.py verified — Tapo robovacs): same — vacuum
  entity only, no consumable sensors → runtime duties.

**Still negative, now with the precise reason:**
- ~~climate / humidifier / water-heater: the running state lives in the
  `hvac_action`/`action` ATTRIBUTE, while the runtime trigger accumulates on
  the STATE — mode-time (heat/cool standing by) is a bad usage proxy.~~
  → RESOLVED (2026-07-18, user-prompted "runtime goes via state — we had
  that in the scheme"): the runtime trigger now accepts an optional
  `attribute` — it accumulates while `state.attributes[attribute]` is in
  on_states (availability still judged on the raw state). Cataloged:
  **daikin** (core climate, ~9.7k installs) and **gree** (core climate,
  ~3.5k) — "Filter Cleaning" every 250 h of hvac_action in
  cooling/heating/fan/drying. Humidifier/water-heater stay negative: the
  `action` attribute exists but running-time is a poor proxy for their real
  duties (descale is water-hardness-driven, filter/wick is evaporation-
  driven); revisit if users ask.
- irrigation: per-zone switches would need per-zone runtime modeling
  (multi-entity), and the real duties are seasonal → template stays right.
- valve: "exercise the shutoff valve" is a LACK-of-use duty → template
  candidate ("Water Shutoff Valve", exercise twice a year), not a signature.
- camera/doorbell: always-on, no duty-proportional state. Confirmed.

## Follow-up candidates (parked)

- ✅ **gardena_smart_system** — source dive DONE (2026-07-18, user-prompted
  "delta on mowing time?"): `GardenaMowerOperatingHoursSensor`
  (suffix `_operating_hours`, HOURS, TOTAL_INCREASING lifetime, no reset) →
  cataloged as usage_delta "Replace Blades" every 100 mowing-hours. 3.3k
  installs; covers the Sileno family.
- ✅ **NavimowHA** — CORRECTED verdict (2026-07-18, user-prompted "the engine
  can count itself"): the first negative missed `lawn_mower.py` (one
  LawnMower entity per device, const.py maps status 'mowing' →
  LawnMowerActivity.MOWING). No usage counter exists, but none is needed —
  the NEW `runtime_hours` direction targets the STATE entity and lets the
  ENGINE accumulate mowing time (runtime trigger, on_states=["mowing"], 100 h,
  reset on completion). Cataloged. Lesson recorded twice now: check the FULL
  trigger engine (incl. runtime + state-change counting) AND all entity
  platforms of an integration before a negative verdict.
- **WeBack** (Jezza34000/homeassistant_weback_component, WeBack/Tesvor
  vacuums) — same route; check for consumable sensors.
- **kia_uvo service-distance** — verify remaining-distance vs odometer-target
  semantics before choosing a direction.
- **Valetudo** — MQTT-discovery-name matching (per-consumable minutes or
  percent), harder than translation_key.


## Research round 4 (2026-07-19): unswept categories

Source-verified inline (curl on core/dev + HACS repos), method contract as
always. Focus: categories never swept — ventilation (HRV/ERV filters),
boiler water pressure beyond Bosch, air purifiers, espresso machines,
pet tech, Klipper.

**Catalog-ready (verified positive):** — ✅ ALL TEN SHIPPED 2026-07-19 (impl notes: atag via exact-object-id; moonraker suffix is the NAME slug totals_filament_used; incomfort sensor is disabled-by-default upstream; the pressure quartet reuses the Bosch duty name)

| Integration | Evidence | Direction / duty |
|---|---|---|
| `opentherm_gw` (core) | tk `central_heating_pressure`, bar, MEASUREMENT | value_below 1.0 — "Top Up Heating Water". GENERIC for every OpenTherm boiler — highest leverage of the round. |
| `plugwise` (core, Anna/Adam) | tk `water_pressure`, bar, MEASUREMENT | value_below 1.0, same duty |
| `incomfort` (core, Intergas) | key `cv_pressure`, bar | value_below 1.0 (naming/tk to confirm at impl) |
| `atag` (core) | "CH Water Pressure" -> `ch_water_pres`, bar | value_below 1.0 (legacy naming — verify entity suffix at impl) |
| `vesync` (core, Levoit purifiers) | tk `filter_life`, %, MEASUREMENT | percent_left — "Replace Filter". Large install base. |
| `comfoconnect` (core, Zehnder ComfoAirQ) | key `days_to_replace_filter`, DAYS (name-style, no tk) | duration_left (days) — "Replace Ventilation Filter" (below ~7 d) |
| `renson` (core, Endura Delta) | tk `filter_change`, DURATION/DAYS, MEASUREMENT | duration_left — same duty |
| `lamarzocco` (core) | tk `total_coffees_made`, TOTAL_INCREASING (+ `total_flushes_done`) | usage_delta x2 — "Backflush Espresso Group" (~100 shots), "Replace Water Filter" (~1000 shots; editorial defaults) |
| `petkit` (HACS Jezza34000 — the WeBack author) | tk `desiccant_left_days` (days), `filter_percent` (%) + "Filter left days" | duration_left "Replace Desiccant" (feeder) + percent_left/any-low "Replace Water Filter" (fountain) |
| `moonraker` (HACS, Klipper — huge) | `total_filament_used`, METERS, TOTAL_INCREASING | usage_delta — "Replace Nozzle" (~1000 m, editorial). NOTE: `total_print_time` is a FORMATTED STRING ("Xh Ym Zs") — unusable, documented so nobody re-tries it. |

**Verified negative:**
- `vallox` (core): `remaining_time_for_filter` is device_class TIMESTAMP —
  a date, no numeric direction fits (same class as UPS battery dates).
- `blueair` (core): no sensor.py (404) — nothing to match today.

**Parked (shortlist for a later dive):**
- `philips_airpurifier_coap` (HACS kongo09): filter sensors exist per docs,
  but the source layout needs a deeper dive (const.py has no filter keys).
- IKEA STARKVIND via `dirigera_platform` (HACS): filter alarm/lifetime.
- `wallbox` (core): `added_energy` is TOTAL_INCREASING but per-session
  semantics unclear — do not catalog until lifetime semantics are proven.
- EcoWater / BWT Perla (salt level), Oral-B (runtime-on-brushing idea, but
  BT presence is flaky), winix (not in core), generac.

Projected: +10 integrations / ~13 signatures -> catalog ~80/148. New task
names x17 needed: "Replace Ventilation Filter", "Backflush Espresso
Group", "Replace Nozzle", "Top Up Heating Water" (unless the Bosch
value_below duty name is reused — check at impl); "Replace Desiccant",
"Replace Water Filter", "Replace Filter" already exist.


## Research round 5 (2026-07-19): parked-list dives

- ✅ **philips_airpurifier_coap** (HACS kongo09) — SHIPPED. PhilipsFilterSensor
  reports PERCENT (total known) or HOURS remaining → the LG dual-unit
  pattern, split per direction. tks pre_filter (cleaning) +
  hepa/active_carbon/nanoprotect (replacement, any-low). 'wick' skipped —
  humidifier part needs its own duty name (follow-up).
- ✅ **dirigera_platform / IKEA STARKVIND** (HACS sanjoyg) — SHIPPED.
  'Filter Elapsed Time' (suffix, MINUTES, counts up, resets on IKEA's
  filter reset) → usage_above 4,320 h = exactly IKEA's 259,200-minute
  lifetime. 'Filter Lifetime' sibling is the constant total — unusable.
- ❌ **wallbox** (core) — verified NEGATIVE for usage_delta: added_energy is
  SESSION-scoped (resets each charging session despite TOTAL_INCREASING).
  Our rollover handling would re-baseline every session, so the delta only
  measures the CURRENT session — a 5,000 kWh cable-inspection target would
  never fire. Needs a lifetime counter upstream; none exists today.
- Parked for a later round: BWT Perla / EcoWater salt levels (repo hunt
  needed), Oral-B (runtime-on-brushing idea, BT flakiness), generac,
  smarttub, myenergi/openWB/OMV, tuya_local scoped dive, melcloud.

Catalog after round 5: **82 integrations / 152 signatures**.


## Research round 6 (2026-07-19): rest of the parked list

- ✅ **oralb** (core) — SHIPPED via runtime-on-state: tk 'toothbrush_state'
  (ENUM, name=None → main entity; tk match) with on_states=['running'];
  6 h of brushing = the dentist's 3 months at 2x2 min/day. The 'time'
  sensor is SESSION-scoped (TOTAL_INCREASING but resets) — unusable for
  deltas, same class as wallbox. New name "Replace Brush Head" x17. New
  category module signatures/personal.py.
- ✅ **smarttub** (core) — verified COVERED-BY-ADOPTION: SmartTubReminder is
  BinarySensorDeviceClass.PROBLEM (filter/water reminders) → the
  problem-sensor adoption surface handles it; no signature needed.
  Un-parked with verdict.
- ❌ **myenergi** (HACS CJNE) — verified NEGATIVE: zappi's only per-charger
  counter is 'Charge added session' (session-scoped); the CT
  imported/exported totals are grid-level, not charger wear.
- Still parked (repo identification / scoped dives pending): EcoWater and
  BWT Perla salt levels (HACS repos not located under the tried slugs),
  generac, tuya_local, melcloud, openWB, OMV.

Catalog after round 6: **83 integrations / 153 signatures**.


## Research round 6b (2026-07-19): the salt softeners + wick

- ✅ **bwt_perla** (dkarv/ha-bwt-perla, HACS DEFAULT — the earlier repo hunt
  failed on wrong author guesses; found via the hacs/default list): tk
  'regenerativ_level' (%, salt reserve) + 'regenerativ_days' (DAYS) →
  "Refill Softener Salt" percent_left + duration_left (warn ≤7 days).
- ✅ **ecowater_softener** (barleybobs, HACS DEFAULT): key
  'salt_level_percentage' (PERCENTAGE) + 'out_of_salt_days' (days),
  name-style suffix match → same two duties. The OUT_OF_SALT_ON date
  sensor remains date-class (future date direction).
- ✅ **philips wick** — the humidifier evaporation wick joined the philips
  entry (dual-unit like the filters), new name "Replace Wick" x17.
- ❌ **kia_uvo next_service_distance** — still parked: the API-lib fields
  exist but remaining-vs-odometer-target semantics stayed unresolved after
  two dives; the odometer usage_delta duties cover the practical need.
- LESSON: for HACS repos, check hacs/default's integration list FIRST —
  star counts scatter across forks and author guesses fail.

Catalog after round 6b: **85 integrations / 159 signatures**.


## Interval audit vs manufacturer guidance (2026-07-19)

All 27 distinct editorial defaults cross-checked (device-reported
countdowns are manufacturer values by definition — only OUR intervals and
warning margins audited). Corrected:

| Duty | Was | Now | Manufacturer source |
|---|---|---|---|
| AC Filter Cleaning (daikin/gree) | 250 h | 100 h | Daikin manual/FAQ: clean every 2 weeks (≈100 runtime-h) |
| Lubricate Cylinder (18 lock entries) | 500 cycles | 2,000 | Nuki: annual graphite lubrication (≈2,000 cycles/yr typical door) |
| Lubricate Rails and Rods (octoprint/prusalink) | 500 h | 200 h | Prusa KB: maintenance every 200 print hours |

Validated unchanged (citations added): Husqvarna blades 100 h (official
"every 2 months" + app blade timer), La Marzocco backflush 100 shots
(detergent backflush every 4-6 weeks), sensor-less vacuum 15/30 h
(Roborock official biweekly filter/brush cleaning), Litter-Robot 150
cycles (Whisker: globe clean every 1-3 months), tire rotation 10,000 km
(Tesla: every 6,250 mi), Oral-B 6 h (official 3 months), STARKVIND
4,320 h (IKEA's own budget), Bambu values stay editorial (wiki
unfetchable), wallbox 5,000 kWh editorial (no official figure exists).


## Research round 7 (2026-07-19): fresh sources

- ✅ **hon** (Andre0512, 1.5k stars — closes the OPEN #101 Haier ask):
  purifier tk filter_life (%) + tk filter_cleaning (pre-filter, %) +
  washer tk cycles_total (lifetime counter) -> Clean Tub every 30 cycles
  (reusing LG's manufacturer cadence).
- ✅ **Car wave 2** (now 14 brands): polestar_api (current_odometer,
  native m / display km), fordpass (dict-key odometer, suffix), toyota
  (tk odometer TOTAL_INCREASING), mg_saic (ad-ha, HACS default; 'Mileage'
  suffix — 'Mileage Since Last Charge' cannot clash).
- ✅ **palazzetti** (core): tk pellet_quantity (kg consumed, cumulative)
  -> Empty Ash Pan every 100 kg (editorial ~weekly in season; manuals are
  calendar-based). pellet_level is a CM tank gauge — inventory, skipped.
- ✅ **wolflink** (core): key 'pressure' BAR -> Refill Heating Water.
- Parked for round 8: ebusd (Vaillant via eBus — big DE base, config-
  dependent entities), whirlpool/homewhiz quick checks, bosch_ebike.

Catalog after round 7: **92 integrations / 172 signatures**.


## Research round 8 (2026-07-19): Vaillant + Whirlpool

- ✅ **mypyllant** (signalkraft, 327 stars — the big Vaillant-cloud base):
  system- and device-level water-pressure sensors (BAR), matched any-low
  via both naming variants (suffix system_water_pressure / water_pressure)
  -> Refill Heating Water. Sixth member of the pressure family.
- ✅ **whirlpool** (core): no cycle counter exists — tk 'washer_state' ENUM
  incl. 'running_maincycle' -> the Miele Clean-Tub pattern (engine-counted
  60 h of washing ~= LG's 30-cycle cadence at ~2 h/cycle). The dryer's
  distinct 'dryer_state' tk cannot match (pinned by test).
- Parked round 9: homewhiz (Beko/Grundig — BLE/cloud hybrid, entities
  config-generated), ebusd (config-dependent), bosch_ebike, V-ZUG/Narwal
  (not in HACS default under expected slugs).

Catalog after round 8: **94 integrations / 174 signatures**.


## Threshold audit round 2 (2026-07-19): the trip points

Follow-up to the interval audit — the THRESHOLD-type values verified
against manuals:

- ✅ **Heating pressure value_below 1.0 bar** (7 integrations): Vaillant's
  official guidance — ideal 1.0-1.5 bar cold, "below 1 bar → top up".
  Exactly our trip point.
- ✅ **Clean Tub 30 cycles**: LG's official tCL indicator fires "every 30
  cycles / monthly" — validates smartthinq (30), hOn's reuse (30) and
  Whirlpool's 60-wash-hours derivation (~30 cycles at 2 h).
- ✅ **AMS desiccant >40 % RH**: verified the signature targets the REAL
  percentage sensor (tk 'humidity', PERCENTAGE, hygrometer-AMS only) and
  cannot hit the 1-5 'humidity_index' scale. Bambu has no official RH
  number (color-based desiccant status) → 40 % stays editorial (fresh
  desiccant = ~10-20 % RH).
- Warning MARGINS (below 24 h / 10 % / 72 h / 7 days on device-reported
  countdowns) are by design OUR lead times — the devices themselves alert
  at zero; margins give the user time to order parts.

## Round 9 (2026-07-19): service countdowns, three purifier families, Grohe Blue

All entries source-verified at the repo/branch named; HACS-default
membership checked first.

### Catalog-ready

1. **MySkoda** (`myskoda`, HACS default skodaconnect/homeassistant-myskoda)
   — the richest maintenance surface of any car integration so far:
   - tk `mileage` (key `milage`!, km, TOTAL_INCREASING; self-healing
     against API glitches) → Tire Rotation usage_delta 10 000 km.
   - tk `inspection` (DAYS remaining) + tk `inspection_in_km` (km
     remaining) — the CAR's own inspection countdown → "Book Inspection"
     via duration_left / value_below. No editorial interval needed.
   - tk `oil_service_in_days` + `oil_service_in_km` (fuel vehicles) →
     "Oil Service" the same way.
   Skip the generic odometer Annual Service here — the countdown IS the
   service signal (avoids a duplicate duty).
2. **Audi Connect** (`audiconnect`, HACS default audiconnect/audi_connect_ha)
   — same shape, name-derived entities (no translation_key):
   - "Mileage" (km, TOTAL_INCREASING) → Tire Rotation 10 000 km.
   - "Service inspection time" (days) / "Service inspection distance"
     (km) → Book Inspection. "Oil change time" / "Oil change distance"
     → Oil Service. All four are remaining-until countdowns
     (`inspectionDue_days/km`, `oilServiceDue_days/km` from the VAG API).
3. **Blueair** (`ha_blueair`, HACS default dahlb/ha_blueair) — purifiers
   AND humidifiers:
   - "Filter Life" % (verified: coordinator returns 100 − usage → %
     REMAINING) → Replace Filter percent_left.
   - "Wick Life" % → Replace Wick; "Water Refresher Life" % → Replace
     Water Refresher. Plus a filter_expired problem binary (adoption
     path) as belt-and-braces.
4. **Grohe Smarthome** (`grohe_smarthome`, HACS default
   flo-schilli/ha-grohe_smarthome) — Grohe Blue Home/Prof water systems:
   - "Remaining Filter" % → Replace Filter Cartridge percent_left.
   - "Remaining CO2" % → Replace CO₂ Bottle percent_left.
   Entities are YAML-config-driven (config/config.yaml) with fixed names
   → name-style suffix matching.
5. **Coway IoCare** (`coway`, HACS default robertd502/home-assistant-iocare):
   - "Pre filter" % (odor/charcoal variant on AIRMEGA: "Charcoal
     filter") → Clean Pre-Filter percent_left.
   - "MAX2 filter" % ("HEPA filter" on AP-1512HHS EU/UK models) →
     Replace MAX2/HEPA Filter percent_left. Multiple name variants →
     list all in the signature's tks.
6. **Winix** (`winix`, HACS default iprak/winix): tk `filter_life` % —
   derived device-side from filter hours vs the model's alarm duration
   (verified in sensor.py) → Replace Filter percent_left.

### Verified negatives / parked

- **BMW**: core `bmw_connected_drive` was REMOVED (BMW shut the API);
  the replacement `kvanbiesen/bmw-cardata-ha` is not in the HACS
  default store yet → re-check next round.
- **Mammotion** mowers: not in the HACS default store.
- **Aseko** (core `aseko_pool_live`): water-chemistry measurements only
  (electrolyzer g/h = performance, not wear) — no consumable surface.
- **QNAP**: no binary_sensor platform at all (relevant for the
  problem-sensor table, corrected there).
- **Daikin Onecta** (`daikin_onecta`): GitHub code search returned no
  filter entities; needs a manual source dive next round.
- **HomeWhiz**: entities are generated dynamically from the appliance's
  own API config — no stable keys to sign against; would need a
  state-derived approach like Valetudo. Parked.
- **kia_uvo** `next_service_distance` semantics: still unverified
  (target-vs-remaining) — odometer delta remains our path there.

## Problem-sensor sweep (2026-07-19): all 100 catalogued integrations

Swept the upstream binary_sensor/const/definitions sources of every
catalogued integration (script-driven; transports/hubs skipped as
device-dependent) for `problem`/`safety`/`tamper` device classes:
36 integrations ship such binaries, 51 verified clean, 13 generic.

Maintenance-relevant findings now listed in docs/INTEGRATIONS.md:
vehicle warning-lamp families (kia_uvo 9, volvo 28, mbapi2020 6,
audiconnect 3), hOn dishwasher salt/rinse-aid/filter binaries,
LG detergent/softener-low, OpenTherm service-required + fault family,
PetKit's 24 alerts, Litter-Robot laser-dirty, La Marzocco water tank,
ROMY/Dreo/Dyson tank+filter binaries, lock calibration/tamper alerts
(tedee/schlage/switchbot). Not maintenance-relevant (excluded):
generic connectivity/error states without an actionable duty
(tplink overheated, mg_saic/keba unnamed, husqvarna enum error keys —
those are STRING sensors, not binaries).

## Round 10 (2026-07-20): Miele deep-dive, Samsung filters, Traeger cook cycles

### Miele (deep-dive on request) — current coverage is complete

Full sweep of core miele sensor.py (all ~40 descriptions): beyond the
covered salt / rinse-aid / PowerDisk / TwinDos levels and the washer
tub-clean runtime, the only maintenance-adjacent additions are the
COFFEE_SYSTEM counters `descaling_counter`, `degreasing_counter`,
`milk_cleaning_counter` — all TOTAL_INCREASING tallies of maintenance
already PERFORMED (they increment when you descale), so they cannot
signal due-ness; at best they could someday auto-complete a task.
Miele's own descaling prompt reaches HA as the `problem`-class
active-notification binary → already covered by the adoption path
(and listed in the INTEGRATIONS.md table). Verdict: nothing to add.

### Catalog-ready

1. **SmartThings fridge & hood filters** (core `smartthings`): tk
   `water_filter_usage` (Samsung custom.waterFilter, %, MEASUREMENT —
   usage counts UP, replacement resets to 0) → "Replace Water Filter"
   alert_above 90 %; tk `hood_filter_usage` (SAMSUNG_CE_HOOD_FILTER, %)
   → "Clean Grease Filter" alert_above 90 %. Complements the existing
   engine-runtime vacuum signature on the same domain.
2. **Traeger grills** (HACS default ×2: njobrien1006/hass_traeger and
   the johnvoipguy/Traeger-WiFire fork — same sensor map, same domain):
   "Cook Cycle" sensor (usage;cook_cycles, lifetime counter,
   suffix _cook_cycle, disabled-by-default DIAGNOSTIC) → "Clean Grease
   Trap" usage_delta 5 cooks + deep clean ("Clean Appliance")
   usage_delta 20 cooks — Traeger's official cadence (grease
   management every few cooks, deep clean ~every 20 cooks / twice a
   season). "Pellet Level" (%) is hopper inventory — same skip rationale
   as Palazzetti's pellet_level.

### Verified negatives / parked

- **Daikin Onecta** (`daikin_onecta`): full sensor.py sweep — the cloud
  API exposes no filter or maintenance data at all.
- **Ariston** (fustom v3): no anode/maintenance/filter entities.
- **myUplink** (core): mostly device-dynamic parameter points; the few
  static keys (airflow, rpm, compressor status) carry no consumable
  semantics. Parked like HomeWhiz.
- **BMW CarData**: still not in the HACS default store (re-checked).

## Round 11 (2026-07-20): full core sweep — every HA integration

Method: downloaded the complete core dev tree and script-swept ALL 745
sensor platforms + all binary_sensor platforms of integrations not yet
in the catalog, for consumable/wear/countdown key patterns and
problem/safety/tamper classes. 36 sensor-candidate domains, 76
problem-binary domains; curated below. All semantics verified against
the local tree (units, state_class, value_fn).

### Catalog-ready (13)

**Cars — five more integrations, all core:**
1-3. **tesla_fleet / teslemetry / tessie**: `vehicle_state_odometer`
   (TOTAL_INCREASING, MILES — the unit-aware threshold handles mi) →
   Annual Service 15000 + Tire Rotation 10000. The official/cloud Tesla
   trio complements the HACS tesla_custom already covered. Each also
   ships per-tire TPMS problem binaries (adoption table).
4. **ituran** (`mileage`, km, DISTANCE) — fleet tracker odometer.
5. **starline** (`mileage`, km, TOTAL_INCREASING) — alarm-system odometer.

**Ventilation / air:**
6. **duco** (`filter_remaining`, DURATION DAYS) → Replace Ventilation
   Filter duration_left 168 h (the comfoconnect/renson pattern).
7. **flexit_bacnet** (`air_filter_operating_time`, TOTAL_INCREASING
   HOURS — counts up, reset on filter change) → Replace Ventilation
   Filter usage_above 4380 h (Flexit: change every 6-12 months). Plus
   `air_filter_polluted` problem binary (adoption).
8. **tradfri** (`filter_life_remaining`, MEASUREMENT HOURS) — STARKVIND
   via the NATIVE IKEA gateway (we only covered the dirigera_platform
   path) → Replace Filter duration_left 72 h.
9. **venstar** thermostats (`filterHours`, MEASUREMENT — filter runtime
   counting up, user-reset on change) → Replace Filter usage_above
   300 h (typical 1-3-month furnace-filter guidance).

**New categories:**
10. **eheimdigital** (EHEIM aquarium filters): `service_hours`
    (DURATION HOURS remaining to next filter service) → Filter Cleaning
    duration_left (default 24 h lead).
11. **fumis** (pellet stove controllers): `time_to_service` (DURATION
    HOURS remaining) → Annual Service duration_left.
12. **rehlko** (Kohler generators): `runtime_since_last_maintenance`
    (HOURS since last maintenance, resets at maintenance) → Oil Service
    usage_above 100 h (Kohler: oil change every 100 h / annually). Plus
    `oil_pressure` problem binary.
13. **aquacell** (`salt_left/right_side_percentage`, %) → Refill
    Softener Salt percent_left, any-low across both tanks.

**Pool salt (chlorinators):**
14. **screenlogic** (`salt_ppm`, ppm) and **ondilo_ico** (`salt`, mg/L
    ≡ ppm) → Refill Pool Salt value_below 2700 (Pentair band
    2600-4500 ppm). NOTE: needs a new _T name ("Refill Pool Salt").

### Adoption-table additions (problem binaries, core)

coolmaster `clean_filter`; fjaraskupan hood `carbon_filter` +
`grease_filter`; flexit_bacnet `air_filter_polluted`; tesla trio
per-tire TPMS warnings; **rdw `pending_recall`** (official Dutch
vehicle-recall register!); unifiprotect `disk_health`; intellifire
fireplace `maintenance_error`/fan/flame errors; letpot hydroponics
`low_water`/`low_nutrients`/`pump_error`; shelly `calibration` (TRV) +
`overheating`; yale_smart_alarm `jam`/`tamper`; hikvision
`disk_error`/`tamper_detection`; syncthru printer `problem`;
myuplink `has_alarm` (generic heat-pump alarm).

### Verified negatives / parked

- **smarty** `filter_days_left` and **tami4** filter/UV
  `*_upcoming_replacement`: TIMESTAMP/DATE device classes — parked for
  the date-direction engine idea (with vallox, NUT, seneye).
- **aqualogic** salt: dual-unit (metric g/L vs imperial PPM per config)
  — one raw threshold cannot serve both; skipped with reason.
- **shelly** `lamp_life` (bulb), **tolo/steamist** timers (operational),
  telecom/storage "remaining" sensors (fido, aussie_broadband, onedrive,
  nzbget, forecast_solar, victron, imeon, indevolt): not maintenance.

## Rain Bird + KNX (2026-07-20, user-requested checks)

- **Rain Bird** (core `rainbird`): SHIPPED — no consumable sensors
  (rainsensor binary has NO device_class → not adoptable; raindelay is
  operational), but each irrigation zone is its own device with a single
  zone switch → engine watering-runtime duty "Clean Sprinkler Heads"
  every 30 h (Rain Bird guidance: heads/drip filters at least once a
  season).
- **KNX** (core): a PROTOCOL, not a device integration — every entity is
  user-configured from group addresses (names, types and device classes
  all come from the user's config; verified in sensor.py/binary_sensor.py:
  `config.get(CONF_DEVICE_CLASS)`). There are no stable keys or device
  fingerprints to sign against, so a catalog entry is impossible by
  construction (same class as MQTT/ZHA transports). KNX users are still
  fully served: (1) any KNX binary mapped with device class
  problem/safety/tamper becomes ADOPTABLE — worth doing for fault
  objects of KNX-connected heat pumps/ventilation; (2) every KNX sensor
  works with the manual trigger config (threshold/counter/runtime).
  Documented in the INTEGRATIONS.md adoption table.

## SmartThinQ re-audit (2026-07-20, user-requested)

Deep re-check of ollo69/ha-smartthinq-sensors against master:

- All 8 covered keys verified still present and correctly named (AC +
  5 purifier filter-life variants, fridge fresh-air + water filter,
  tub-clean counter).
- No missed sensor consumables (no lint filter, no dehumidifier/hood
  filters; FILTER_*_USE/MAX are raw components of the LIFE value).
- FOUND + SHIPPED: dishwasher **Rinse refill** / **Salt refill**
  binaries — NO device_class (not adoptable) and disabled-by-default →
  added as event_present latches ("Refill Rinse Aid" / "Refill Salt",
  auto-resolve when the appliance clears them after a refill).
- Washer DETERGENTLOW/SOFTENERLOW remain problem-class → adoption
  table (already listed).

## Round 12 (2026-07-20): HACS-store popularity sweep

Method: joined the HACS store data (2,686 repos, domain↔repo↔stars) with
the REAL active-install counts from HA analytics, ranked every
non-catalogued domain, curated the device-relevant top plus a keyword
pass over all categories, then source-dived ~27 repos.

### Catalog-ready (source-verified)

1. **Dyson (dyson_local)** — libdyson-wg/ha-dyson, **4,685 installs**:
   the maintained fork (more popular than the covered cmgrayb hass_dyson).
   "Filter Life" (HOURS remaining), "Filter Life Percentage" /
   "Carbon Filter Life" / "HEPA Filter Life" / "Combined Filter Life"
   (all % remaining, /4300 h budget) → Replace Filter dual-direction;
   the suffix overlap (_carbon_filter_life endswith _filter_life) is
   resolved by the unit-aware matcher (the lg_thinq pattern).
2. **WashData (ha_washdata)** — 3dg1luk43/ha_washdata, **5,821
   installs**: smart-plug cycle detection for DUMB appliances; tk
   `cycle_count` (unit "cycles", lifetime detected-cycle counter) →
   Clean Tub usage_delta 30 — brings the tub-clean duty to washers with
   no smarts at all.
3. **iQua softener (iqua_softener)** — 198 installs: "Salt level"
   (PERCENTAGE, suffix _salt_level) → Refill Softener Salt percent_left.
   "Out of salt estimated day" is a DATE → date-direction parked.

### Adoption-table additions (verified problem-class binaries)

- **midea_dehumidifier_lan** (2,715 installs): tank full, tank removed,
  **filter replacement** — all PROBLEM.
- **nest_protect** (2,702): a dozen PROBLEM binaries (smoke/CO/heat
  faults, battery); `replace_by_date_utc_secs` (device end-of-life) is a
  timestamp → date-direction parked.
- **deye_dehumidifier**: water_tank PROBLEM.
- **pitboss** grills: error binaries default to PROBLEM.

### Parked with reasons (next-round dive list)

- **home_connect_alt** (3,820!) + **homeconnect_ws** (1,800): entities
  generated dynamically from the appliance's API description —
  homewhiz-class; needs a dedicated dive into their naming scheme.
- **bhyve** (3,409) + **opensprinkler** (1,106): likely the Rain Bird
  zone-switch runtime pattern; device/entity layout dive pending.
- **volkswagencarnet** (2,376): legacy WeConnect; the modern VW-group
  path is already covered via vw_eu_data_act — low priority.
- **panasonic_cc** (3,089) / **midea_ac** (3,528): no filter data and
  climate entities don't report hvac_action → the AC runtime pattern
  doesn't apply as-is.
- **sunseeker** (240): REAL blade_time_left/blade_health sensors —
  naming scheme dive pending. **jura** (254): BLE counters dive.
  **indego**, **zcsmower**, **mila**, **petsafe**, **truenas** service
  binaries, **hikvision_next**, **connectlife** (dynamic properties).
- Not maintenance: waste_collection_schedule (garbage calendars),
  battery_notes (battery meta), pool chemistry testers
  (poollab/poolmath/iopool — dosing is daily ops, not consumables).

## Bosch Smart Home (bosch_shc, 2026-07-20, user-requested)

HACS tschamm/boschshc-hass (~1,925 installs). Full sensor/binary sweep:
- NO catalog signature possible — every sensor is environmental or
  operational (temperature, humidity, Twinguard purity/air-quality
  READING [not a filter], power/energy, illuminance, communication
  quality, shutter calibration-duration). No consumable, filter or
  maintenance-countdown entity exists. It is a smart-home controller
  (shutters/sirens/smoke/motion), not a consumable device.
- ADOPTABLE problem/tamper binaries (added to the table): shutter
  `calibration required` (PROBLEM), outdoor-siren AC/DC error, battery
  defect, battery-temperature abnormal, primary-power outage (all
  PROBLEM), siren TAMPER, motion-detector TAMPER.

## Round 13 (2026-07-20): HACS re-sweep of the parked dive-list

Source-dived the round-12 parked candidates + Bosch neighbours.

### Catalog-ready (shipped)
- **Sunseeker mowers** (Sdahl1234, also Ambrogio/Techline/Wiper via ZCS):
  REAL blade-wear sensors — 'Blade time left'/'Cutterplade time
  left'/'Small blade time left' (HOURS remaining) + matching '*_health'
  (PERCENTAGE). Dual-unit → one Replace Blades duty. (Sunseeker was the
  standout of the round-12 park list — genuine wear telemetry, unlike
  the runtime-only mowers.)
- **Stromer eBike** (CoMPaTech): tk 'total_distance' (km odometer) →
  the Bosch-eBike duties (Lubricate Chain 250 km, Bike Service 2000 km),
  no new task names.

### Verified negatives / re-parked
- **bhyve** (3,409) + **opensprinkler** (1,106): the zone entities are a
  smart-watering MODE toggle (bhyve) resp. a station ENABLE toggle
  (opensprinkler) — NOT a "watering active" signal. A runtime signature
  on them would count mode/enabled time, not watering time. The correct
  entity is the per-station running binary/valve; needs a per-integration
  entity-layout pass. Deliberately not signed to avoid a wrong duty.
- **indego** (Bosch mower), **zcsmower**, **jura** (BLE), **eufy_security**,
  **dahua**, **senec**, **luxtronik**, **astrandb/miele** (HACS Miele —
  same core-Miele semantics, coverage already complete): no
  consumable/wear sensor.
- **garmin_connect**: distance sensors are WORKOUT distance (fitness),
  not a device odometer — not maintenance.
- **anker_solix**: 'runtime' fields are poll intervals, not wear.

Catalog after round 13: **123 integrations / 228 signatures**. The
popular HACS device integrations are now essentially exhausted; what
remains is either protocol/transport, dynamic-entity (home_connect_alt/
homeconnect_ws/homewhiz), date-direction-blocked, or the irrigation
zone-layout dive.

## resmed_myair (2026-07-26, roadmap 3a) — verified, NO signature → CPAP template

Source-dived `prestomation/resmed_myair_sensors` (1,131 installs,
`custom_components/resmed_myair/const.py` SLEEP_RECORD_SENSOR_DESCRIPTIONS +
DEVICE_SENSOR_DESCRIPTIONS): therapy metrics only — `totalUsage` ("CPAP Usage
Minutes", per-NIGHT, state_class MEASUREMENT → the bhyve-class nightly-reset
counter trap), `maskPairCount`, `ahi`, `leakPercentile`, `sleepScore`, date/
sync sensors. No consumable/wear signal, no cumulative lifetime counter, no
live running state (myAir syncs once daily) → nothing for any trigger
direction. Verdict: **verified, no signature**; the `health_cpap` template
covers the real maintenance (nightly use ⇒ calendar ≈ usage). This case
created the template-worthiness lens (roadmap 3b).

## Template-worthiness lens, first pass (2026-07-26, roadmap 3b)

Parked "no wear sensors" list re-walked under the lens — ALL resolved to
existing templates: jura→Espresso Machine, eufy/dahua→Security Camera,
indego/zcsmower→Robot Lawn Mower, bhyve/opensprinkler→Lawn Irrigation
System, astrandb-miele→Washing Machine/Dishwasher, bosch_shc→Smoke & CO
Detectors, garmin→no meaningful upkeep (skip).

Never-walked classes yielded THREE new templates (catalog 42→45):
- **home_fire_safety** "Fire Safety Equipment" — extinguisher self-check
  180 d, professional service 730 d (label/DIN 14406 rhythm), first-aid kit
  180 d. Universal audience, zero smart signals by nature.
- **pets_aquarium** "Aquarium" — partial water change + water tests 14 d,
  filter-media rinse / activated carbon / glass 30 d. eheimdigital's
  runtime signature only covers SMART filters; the class is calendar-run.
- **health_hearing_aids** "Hearing Aids" — weekly deep clean/dry, wax
  guards 30 d, domes 90 d, professional check 365 d. Second entry in the
  new Health category.

Parked as niche for a later pass: e-scooters, musical instruments (piano
tuning), dumb dehumidifiers.

## Dreame station consumables (2026-09-02, #150 user request)

The 2026-07 "confirmed optimal" vacuum verdict above was wrong for Dreame:
`dreame_vacuum` (Tasshack, master ae8422f2) exposes FOUR more `*_left`
percent sensors beyond brushes/filter/sensors — `mop_pad_left`,
`detergent_left`, `secondary_filter_left`, `silver_ion_left` (sensor.py
`property_key=DreameVacuumProperty.*_LEFT`, `UNIT_PERCENT`; translation_key =
`PROPERTY_TO_NAME[...][0]` in dreame/const.py). All eight are
`entity_registry_enabled_default=False`, so discovery only sees the ones the
user enabled — same as the four already shipped. Shipped as *Replace Mop
Pads* / *Refill Detergent* / *Replace Secondary Filter* / *Replace Silver-ion
Module* (percent_left, default below 10 %). The `*_time_left` twins (hours /
days) are deliberately NOT added: same duty, same direction → per-device
dedupe would keep only one anyway, and percent is the scale the app shows.
Catalog: 123 integrations / 235 signatures.

Lesson: "every wear duty is covered" was checked against the four keys we
already had, not against the integration's full `*_LEFT` enum — a re-audit
must diff the ENUM, not our list.

## Round 14 (2026-09-25): core 2026.8 → dev and HACS since July

Sources: HA core diff 2026.7.0 → 2026.8.0 → 2026.9.0 → dev (2026-09-25) over components and entity translation keys, plus analytics `custom_integrations.json` and the hacs/default additions since 2026-07-15; every key below was read in the integration's source. Two catalog bugs surfaced: `gree` counted runtime on `hvac_action`, which the integration never sets, and the `tuya` entry claimed no consumable sensors although the core vacuum category has had life sensors since at least 2026.7.0.

### Vacuums, printers, pets, personal care

Core (read at `origin/dev` 2026-09-25 plus tags 2026.7.0/2026.8.0/2026.9.0):

- **tuya** (FIX): `sensor.py` category SD has had four life sensors since 2026.7.0 — tk `duster_cloth_life`
  (DP `duster_cloth`), `side_brush_life` (DP `edge_brush`), `filter_life` (`DPCode.FILTER_LIFE` = DP `filter`,
  const.py "Filter life (percentage)"), `rolling_brush_life` (DP `roll_brush`). The description sets no unit; the
  entity takes the device's DP unit. Tuya's sd standard status set defines all four as "life", Integer 0-100 %,
  with `reset_*` DPs → added as percent_left (*Replace Mop Pads / Side Brush / Filter / Main Brush*, household
  floor). Devices whose DP reports `min`/`h` do not match (unit gate): real firmware mislabels them (localtuya #811:
  Neatsvor X600 reports `min` on a 0-200 range), so no duration signature. The runtime pair (*Filter Cleaning* 15 h,
  *Clean Main Brush* 30 h) stays — washing is a different duty from end-of-life replacement. Skipped: KJ purifier
  `filter_utilization` (Tuya calls DP `filter` "Filter cartridge utilization", unit `％`; used vs remaining not
  established) and CWYSJ fountain `filter_duration` (DP `filter_life`, "hours", direction not established).
- **ecovacs**: translation_key = `f"lifespan_{component.name.lower()}"` over const.py `SUPPORTED_LIFESPANS`
  (PERCENTAGE = `LifeSpanEvent.percent`, remaining), legacy `f"lifespan_{component}"`. Added (percent_left):
  `lifespan_main_brush` (legacy, joins *Replace Main Brush*), `lifespan_hand_filter` (handheld unit; joins *Replace
  Filter*, now per_entity), `lifespan_station_filter` → *Replace Secondary Filter*, `lifespan_cleaning_solution` →
  *Refill Detergent*, `lifespan_sewage_box` (dirty-water box) → *Empty Dirty Water Tank*, `lifespan_water_sink`
  (the station's cleaning sink) → *Clean Mop Tray*, `lifespan_air_freshener` → *Replace Air Freshener*,
  `lifespan_uv_sanitizer` → *Replace UV Lamp*; GOAT mowers `lifespan_lens_brush` → *Replace Lens Brush*,
  `lifespan_trimmer_brush` → *Replace Trimmer Brush*, `lifespan_weed_rope` (edge-trimmer line) → *Replace Trimmer
  Line*; `total_stats_time_mower` (mower override of `total_stats_time`, s → h, TOTAL_INCREASING) → *Clean
  Undercarriage* usage_delta 25 h. Skipped: `lifespan_unit_care` (which parts it covers is not established from
  source). Note: `lifespan_station_filter` has no name in strings.json upstream (unnamed entity).
- **roborock**: added `strainer_time_left` → *Replace Dock Strainer* and `cleaning_brush_time_left` → *Replace
  Maintenance Brush* (dock, HOURS; python-roborock computes 150 / 300 minus the work count, HA docs "replace your
  dock's strainer/maintenance brush") as duration_left 24 h; Q7 `mop_life_time_left` (min, 10800 − used) →
  *Replace Mop Pads*; Dyad `brush_remaining` ("Roller left", s) joins *Replace Main Brush*; Zeo `times_after_clean`
  (unitless) → *Clean Tub* usage_above 30 washes. Skipped: Q10 `main_brush_life`/`side_brush_life`/`filter_life`/
  `sensor_life` — HA names them "time used", python-roborock's `Q10Consumable` "remaining life"; contradictory.
- **brother**: added `black/cyan/magenta/yellow_ink_remaining` (%) → *Replace Ink or Toner* per_entity,
  `ink_capture_box_remaining_life` (dev only, waste-ink box) → *Replace Maintenance Box*, `laser_remaining_life` →
  *Replace Laser Unit*, `pf_kit_1_remaining_life` + `pf_kit_mp_remaining_life` → *Replace Paper Feed Kit*
  per_entity; all percent_left.

HACS (tarballs of the default branch, 2026-09-25):

- **robovac_mqtt** (jeppesens/eufy-clean, main): has_entity_name names "Filter / Rolling Brush / Side Brush /
  Sensor / Cleaning Tray / Mopping Cloth Remaining" → suffixes `_filter_remaining` …; unit h = max life − usage →
  duration_left (*Replace Filter / Main Brush / Side Brush / Mop Pads* 24 h; *Clean Sensors*, *Clean Mop Tray* 6 h
  because their intervals are 30-60 h).
- **robovac** (damacus/robovac, main): vacuum entity on every model → *Filter Cleaning* 15 h / *Clean Main Brush*
  30 h runtime; proto models (DPS 168) add `RobovacConsumableSensor` "Side Brush / Rolling Brush / Filter / Scraper
  / Sensor / Mop" (hours USED since the last reset) → usage_above with Eufy's lifetimes from eufy-clean
  `ACCESSORY_MAX_LIFE` (filter 360, rolling brush 360, side brush 180, mop 180, sensor 60 → *Clean Sensors*,
  scraper 30 → *Clean Mop Tray*). "Dust Bag" skipped (no lifetime reference).
- **tineco** (wheeller123/Tineco-Integration, main): tk `brush_roller` ENUM normal/tangled/stuck/needs_cleaning →
  *Clean Main Brush* event_present latch on `needs_cleaning`. `waste_water_tank_status` (clean/full) not added —
  emptying after every use is not a maintenance duty.
- **xiaomi_vacuum** (roquerodrigo/ha-xiaomi-vacuum, main): tk `filter_life`, `main_brush_life`, `side_brush_life`,
  `mop_life`, % remaining (MIoT life level) → percent_left.
- **ilife** (maximedeprince/ha-ilife, main): tk `main_brush`, `side_brush`, `filter` (% from PartsStatus; reset
  sets 100) → percent_left, gated on the cloud backend's sibling tk `history` because the Tuya backend names raw DP
  codes (a bare `filter` DP would suffix-match).
- **hpprinter** (elad-bar/ha-hpprinter, master): data_points.json `consumable_percentage_level_remaining` (%,
  printheads excluded), translation_key = property key, one device per cartridge → *Replace Ink or Toner*.
- **epson_workforce** (lymanepp/ha-epson-workforce, master): no tk, names "Ink level Black … Light Magenta" →
  suffixes `_ink_level_<colour>` → *Replace Ink or Toner* per_entity. Skipped: `clean` ("Cleaning level",
  maintenance box) — the parser reads a bar height; used vs left not established.
- **ha_creality_ws** (3dg1luk43/ha_creality_ws, main): tk `print_status` (no unit, state `printing`) → *Lubricate
  Rails and Rods* runtime 200 h (no lifetime counter; K1/K2/Hi are FDM).
- **elegoo_printer** (danielcherubini/elegoo-homeassistant, main): tk `print_status` ENUM shared by resin and FDM →
  runtime 200 h gated on the FDM-only sibling "Nozzle Temperature" (suffix `_nozzle_temperature`). "Total Print
  Time" is per job — not used.
- **anycubic_cloud** (Nino6689/hass-anycubic, main): tk `print_time_total_hrs` (h, TOTAL_INCREASING lifetime) →
  *Lubricate Rails and Rods* usage_delta 200 h, gated on the FDM-only tk `curr_nozzle_temp` (resin printers share
  the counter).
- **petlibro** (jjjonesjr33/petlibro, dev): tk `remaining_desiccant` → *Replace Desiccant*, `remaining_filter_days`
  → *Replace Water Filter*, `remaining_cleaning_days` → *Clean Appliance*, Luma litter box
  `remaining_replacement_days` → *Replace Filter* — all days, duration_left 48 h, reset buttons upstream. Skipped:
  `remaining_mat_days` (minor accessory). Upstream falls back to 0 when the cloud omits a field.
- **philips_shaver** (mtheli/philips_shaver, main): tk `head_remaining` (%) → *Replace Shaver Head*. Skipped:
  `cleaning_cycles_remaining` (integration-side evaporation estimate).
- **oralb_live** (thomasgregg/oralb-ha, main): tk `refill_days` (d, disabled by default) → *Replace Brush Head*
  duration_left 48 h; the hours twin `refill_brushing_time` is the same countdown (one signal per duty).
- Skipped by assignment: `roomba_plus` (integration-estimated values), mowers (garden module).

### Kitchen, NAS and the event-latch engine

**Engine (agent B).** `event_present` gained two shapes. (1) `ok_state` — a from-only latch (`trigger_from_state`, no To-state, #167 predicate) for level enums whose alert is "anything but OK"; unavailable/unknown never fire or recover it (the state-change trigger skips them and uses the last real state as the effective From-state). (2) Several keys in one event signature — the state-change trigger already builds one trigger per `entity_ids` entry and the task sensor aggregates with `entity_logic: any`, so one latch watches all of them (chosen over a compound OR, whose aggregate deactivation never auto-completes, and over "watch only the preferred key"). Caveat documented in `_model.py`: the first recovering entity auto-completes and resets every latch, so only keys that ONE action clears together share a signature; independently serviced parts use `per_entity`. Plus `IntegrationSignature.translation_keys_authoritative` (opt-in): the id-suffix / infix / object-id fallbacks skip entities whose own translation_key differs from the key (bike `odometer` vs `…_next_service_odometer`). Not the default because xiaomi_miot sets a noisy translation_key (`filter-filter_life_level`) and is matched by suffix on purpose.

- **home_connect** (core, 2026.9 events) — extended: "Refill Salt" = `salt_nearly_empty` + `salt_lack` + `program_blocked_salt_lack` (one any-latch on `present`); "Refill Rinse Aid" + `rinse_aid_lack`; "Clean Appliance" + `device_cleaning_overdue`, `machine_care_reminder`, `machine_care_and_filter_cleaning_reminder`, `machine_care_and_low_maintenance_filter_cleaning_reminder` (dishwasher Machine Care = cleaning program without dishes; same name as the coffee duty → one signature); "Filter Cleaning" = `smart_filter_cleaning_reminder` + `machine_care_and_filter_cleaning_reminder` (the combined event backs both duties; the low-maintenance one says filter cleaning is optional → machine care only); "Descale Appliance" + `device_descaling_overdue`/`_blockage` and the Calc'N'Clean trio `device_should_be_calc_n_cleaned`/`device_calc_n_clean_overdue`/`_blockage`; "Refill Detergent" = `poor_i_dos_1_fill_level`/`poor_i_dos_2_fill_level` (per_entity — two tanks); "Empty Dustbin" = `empty_dust_box_and_clean_filter` (Roxxter). All ENUM confirmed/off/present, `HomeConnectEventSensor` disabled by default; semantics per api-docs.home-connect.com/events. Skipped: the "in N cups" pre-warnings and `grease_filter_max_saturation_nearly_reached` (pre-warnings, not the duty).
- **homeconnect_ws** (chris-mc1/homeconnect_local_hass, HACS) — added: tk `sensor_salt` / `sensor_rinse_aid` (ENUM empty/nearly_empty/full; HCEventSensor returns 'full' unless the Lack/NearlyEmpty event is Present/Confirmed) → ok-state latch on `full`, "Refill Salt"/"Refill Rinse Aid"; `sensor_grease_filter_saturation` % → alert_above 90 "Clean Grease Filter"; `sensor_carbon_filter_saturation` % → alert_above 90 "Replace Filter"; coffee `sensor_countdown_descaling`/`_cleaning`/`_water_filter` (beverages left, unitless, disabled by default) → value_below 10 "Descale Appliance"/"Clean Appliance"/"Replace Water Filter". Skipped: `sensor_countdown_calc_n_clean` (relation to the descale countdown undocumented), `sensor_machinecare_remaining_runs`, i-Dos fill-level ENUM (values not in source); the reminder binaries are `problem` class → problem-sensor rows.
- **midea** (core, new 2026.8) — added: tk `salt_available` (key `left_salt`, %) → "Refill Softener Salt" percent_left; tk `filter_life_level` (shared by ED `life1-3` and FC `filter1_life`/`filter2_life`, %) routed by device model (`device_catalog.MIDEA_DEVICE_NAMES`): "Replace Water Filter" `models=("Water Drinking Appliance",)`, "Replace Filter" `models=("Air Purifier", "Toilet")` together with tk `filter_life` (C2, midea-local `100 - body[19]` = remaining). `filter_available_days` describes the same ED filters → not a second duty. Binaries salt/rinse_aid/filter_cleaning_reminder/full_dust/tank_full are `problem` → rows.
- **midea_ac_lan** — fixed: the 0xFC air purifier reuses tk `filter1_life`/`filter2_life` and was offered "Replace Water Filter"; that duty now `models_exclude=("Air Purifier",)`, and "Replace Filter" (tk `filter_life`, `filter1_life`, `filter2_life`) is gated `models=("Toilet", "Air Purifier")` (model string = `"<type name> <model>"`).
- **electrolux** (TTLucian/ha-electrolux, HACS, OCP API; distinct from electrolux_status) — added: tk `filterlife`, `filterlife_1`, `filterlife_2` (catalog_ap.py, %) → "Replace Filter" percent_left, per_entity (UltimateHome 500 has two filter slots). Skipped: AC/fridge/hood filter lifetimes/timers in s/min (maintainer's own "unit is an educated guess"), `filterState` ENUMs (rendered state strings unverified).
- **ge_home** (simbaja/ha_gehome, custom repository) — added by entity-id suffix (no tk; name = `"{serial} {ERD title} {Property}"`): `_water_filter_status_percent_remaining` (fridge, uom %) and `_wh_filter_life_remaining_life_remaining` (whole-home filter, ErdCodeClass.PERCENTAGE) → "Replace Water Filter" percent_left. Skipped: `_wh_softener_low_salt` — gehomesdk `ErdWaterSoftenerSaltLevel.boolify()` returns `self == OK`, so the "low salt" binary is ON while salt is fine (upstream inversion; a latch would fire backwards); `WH_SOFTENER_SALT_LIFE_REMAINING` has no unit. AC/dehumidifier/ice-maker filter binaries are `problem` → rows.
- **candy** (bigmoby/home-assistant-candy, HACS) — added: tk `wash_total_cycles` (TOTAL_INCREASING, sum of the wide Temp* counters) → usage_delta 30 "Clean Tub"; opt-in maintenance countdowns tk `wash_maint_limescale` / `wash_maint_filter` (cycles remaining, 0 when due) → value_below 1 "Descaling" / "Filter Cleaning". Skipped: `wash_maint_full_checkup` (the Simply-Fi "Full Check-up" action is undocumented).
- **unraid** (ruaan-deysel/ha-unraid) — added: tk `array_usage` % → alert_above 85 "Storage Cleanup".
- **unraid_api** (chris-mc1/unraid_api) — added: key/tk `array_usage` % → alert_above 85.
- **unraid_management_agent** (ruaan-deysel/ha-unraid-management-agent) — added: tk `array_usage` % → alert_above 85.
- **unifi_unas_rest** (LayerTM/unifi-unas-ha) — added: tk `storage_usage` (whole NAS, %) → alert_above 85; per-pool `pool_usage` left out (would duplicate on single-pool NASes).
- **unifi_unas** (cardouken/homeassistant-unifi-unas, MQTT) — added by suffix (no tk; `f"Storage Pool {pool_num} {name}"`, pools from 1): `storage_pool_1_usage` … `storage_pool_4_usage` → alert_above 85 (one any-high duty on the NAS device).
- **mos** (anym001/ha-mos) — added: tk `pool_usage` % (one sub-device per pool) → alert_above 85.
- **Problem-sensor rows only:** midea (core) salt/rinse aid/filter-cleaning/dust-full/tank-full; midea_dishwasher salt + rinse_aid; connectlife dishwasher salt/rinse-aid/clean-filters, oven descaling, hood grease/recirculation filter alarms; addhon washer drum/filter/dry clean, hood filter cleaning, AC filter change; homeconnect_ws dishwasher/washer/dryer reminders; ge_home AC/dehumidifier/ice-maker filter — all verified `device_class: problem` in source.
- **Candidates noted, not added:** connectlife hood `GreaseFilterUsedHours` / `RecirculationFilter*UsedHours` (duration, reset semantics not verified); addhon purifier `filter_life`/`filter_cleaning` % and washer `descaling_cycles` (outside this agent's brief).

### Air treatment and heating

### Part C — air treatment & heating (verified 2026-09-25)

**Fix**
- **gree** (core): the `hvac_action`-attribute runtime was dead — `gree/climate.py` never sets `hvac_action` (0 hits at 2026.7.0 and dev). Now runtime on the climate STATE with on_states auto/cool/dry/fan_only/heat (`HVAC_MODES` + `_attr_hvac_modes`), 100 h unchanged.
- **daikin** (core), checked alongside: `hvac_action` IS set, but only for cool/heat/off (`HA_STATE_TO_CURRENT_HVAC`; idle when the compressor frequency is 0) — in fan_only/dry/heat_cool it is None, so the catalog's `fan`/`drying` on_states are unreachable and auto-mode time never counts. Partial, not dead; left unchanged (the existing test pins the attribute shape) — candidate for the same state-based fix.

**Added — air.py**
- **meross_lan** (krahabb): suffix `_filter` (MLFilterMaintenanceSensor, entitykey `filter`, %, payload `life`) → percent_left *Replace Filter*. Remaining established by the emulator (starts 100, counts down) + a real MAP100 push in issue #388 (`life: 100` on a fresh filter).
- **tuya_local** (make-all): tk `filter_life`, unit `%` in 57 device configs → percent_left *Replace Filter*. Duration variants (d/h/min/s) skipped: fresco_hydrateultra_petfountain v1 counts minutes without the `invert` mapping its v2 has.
- **govee** (lasswellt): tk `sensor_filter_life` (%, remaining, `filterLifeTime`) → percent_left *Replace Filter*. LaggAt/hacs-govee (same domain) ships lights only.
- **duux** (SSmale): tk `filter_life` (%, "HEPA Filter remaining lifespan") → percent_left *Replace Filter*.
- **komfovent** (lnagel): tk `filter_clogging` (%, register 917, climbs to 100) → alert_above 90 *Replace Ventilation Filter*.
- **pluggit** / **dantherm** (Tvalley71): tk `filter_remain` (days remaining, register 554) → duration_left 168 h *Replace Ventilation Filter*.
- **ha_carrier** (dahlb): suffix `_filter_remaining` (% = 100 − filter_used) → percent_left *Replace Filter*.
- **localthings** (mbillow, Samsung local): filterUsage is % USED everywhere. `air_filter_usage` (AC/dehumidifier) → alert_above 90 *Filter Cleaning*, gated on the AC-only sibling `air_filter_usage_hours`; `hepa_filter_usage` + `filter_progress` (purifier) → alert_above 90 *Replace Filter*; `hood_filter_usage` → alert_above 90 *Clean Grease Filter*.
- **flexit** (core, Modbus, sensor platform on dev): tk `air_filter_operating_time` (h, TOTAL_INCREASING, `filter_running_hours`) → usage_above 4380 h *Replace Ventilation Filter* (mirrors flexit_bacnet).

**Added — heating.py**
- **de_dietrich** (core, dev): tk `water_pressure` (bar) → value_below 1 *Refill Heating Water*.
- **remeha_home** (msvisser): suffix `_water_pressure` (bar) → value_below 1 *Refill Heating Water*.
- **syr_connect** (alexhass): tk `getss1` (salt supply, WEEKS) → value_below 2 (in weeks) *Refill Softener Salt* — value_below instead of duration_left because the duration conversion has no weeks factor.
- **salt_sentry** (Lemcke-solutions): tk `salt_level` (%, from the tank distance) → percent_left *Refill Softener Salt*.
- **unique_waterontharder** (mirkin-pixel): tk `salt_level` (%, API `zout_niveau`) → percent_left *Refill Softener Salt*.
- **bwt_aqa_perla_ble** (Micka41): tk `salt_pct` (% = remaining salt / capacity) → percent_left *Refill Softener Salt*.
- **generac** (binarydev): suffix `_run_time` = apparatus property 71, labelled "Engine Hours" by the Mobile Link API (issue #202) → usage_delta 200 h *Oil Service* (Generac air-cooled: 200 h / 2 years).
- **energytrak** (brentb2529): tk `engine_hours` (h, monotonic) → usage_delta 200 h *Oil Service*.
- **himoinsa_c4lan** (spiri439; domain is `himoinsa_c4lan`): suffix `_engine_hours` (register 42, total hours) → usage_delta 250 h *Oil Service*.

**Adoption-table rows (problem class verified)**: actron_air `clean_filter`, intelliclima `filter_cleaning`, duco `diagnostic_filter` (dev), flexit `filter_alarm` (dev), aprilaire_rs485 `alarm_filter`/`alarm_water_panel`/`alarm_dehumidifier`/`alarm_system`, daikin_madoka `clean_filter`, bwt_aqa_perla_ble `salt_alarm`, energytrak `fault`/`malfunction`.

**Skipped / parked**
- **guntamatic** (core 2026.9): `operating_time` (h, TOTAL, disabled by default) — no manufacturer burner-hour interval found; the boiler's own service schedule is a day countdown that the integration exposes only as a DATE sensor (`service_days`, tk `service_date`) → waits for a date direction.
- **localthings** water filter `filter_usage`: one key on fridge, dishwasher, water purifier AND the AMF microfiber lint unit (washer registry) — different duties, no gate. Fridge `air_filter_usage`/`deodor_filter_usage` (deodorizing filters, wash-vs-replace unclear, deodor reads −1). AC `filter_time` (legacy option-token boards, 500 h alarm) — could co-exist with `air_filter_usage` on ARTIK051 boards → two Filter Cleaning proposals. `air_filter_pm1_usage` — PM1.0 filter wash-vs-replace not established.
- **ha_carrier** `_humidifier_remaining` / `_uv_lamp_remaining` (% remaining) — valid signals but need new task names (humidifier pad, UV lamp); next round.
- **energytrak** `maintenance_required` binary (local bridge) has no device class → neither adoptable nor signed.
- **syr_connect** `getsrv` ("Next annual maintenance") and **bwt_aqa_perla_ble** `salt_autonomy_date` are dates; bwt `salt_autonomy_days` has no unit (the % sensor covers the duty).

### Cars, e-bikes, wallboxes, locks, mowers, pool/spa

### Group D — cars & e-bikes, wallboxes, locks, mowers, pool/spa

#### Fixed
- **mg_saic**: repository moved ad-ha/mg-saic-ha → townsmcp/mg-saic-ha (hacs/default #9319, code identical);
  `SAICMGMileageSensor` 'Mileage' (field `mileage`, km, total_increasing, suffix `_mileage`) unchanged — source,
  `verified` and the drift probe now point at townsmcp main.

#### Added — wallboxes (Inspect Cable and Plug, usage_delta 5,000 kWh, unit-converted)
- **tesla_wall_connector** (core): tk `energy_kwh` (key `energy_kWh`, 'Lifetime energy', native Wh, suggested kWh,
  TOTAL_INCREASING) — the translation_key exists since 2026.8; `session_energy_wh` ignored.
- **nexblue** (core 2026.9): tk `lifetime_energy` (kWh, TOTAL_INCREASING); `energy` (TOTAL) is the session value.
- **silla_prism** (core 2026.9): tk `total_energy` (pysillaprism `wh_total` topic, "lifetime energy delivered, in
  watt-hours"); `session_energy` (`wh`) ignored.
- **besen** (core; sensor platform only on dev → 2026.10): tk `total_energy` (kWh, TOTAL_INCREASING; library README:
  cumulative consumption); `session_energy` resets per session.
- **peblar** (core): tk `energy_total` ('Lifetime energy', Wh→kWh, diagnostic).
- **zaptec** (custom-components/zaptec): tk `signed_meter_value` ('Energy meter', max OCMF meter reading, kWh,
  TOTAL_INCREASING) — the charger's metering register.
- **goecharger_mqtt** (syssi): key/tk `eto` ('Total energy', Wh, TOTAL_INCREASING; entity.py tk = key.lower(), entity
  id `<topic>_eto`); disabled `etop` ignored.

#### Added — cars (odometer usage_delta Annual Service 15,000 km + Tire Rotation 10,000 km unless the car has its own
countdowns; countdowns = duration_left 336 h / value_below 1,000 km, myskoda precedent)
- **stellantis_vehicles** (andreadegiovine, develop): tk = key — `mileage` → Tire Rotation; `days_before_maintenance`
  (d) + `mileage_before_maintenance` (km) → Annual Service (two directions).
- **porscheconnect** (CJNE): tk `mileage` → Tire Rotation; `main_service_time`/`main_service_range` ('Next service
  in') → Annual Service; `oil_service_time`/`oil_service_range` ('Next oil change in') → Oil Service. Intermediate
  service pair left out (no matching duty).
- **uconnect** (hass-uconnect): name-based suffixes `_odometer` → Tire Rotation; `_days_till_service_needed` (d) +
  `_distance_to_service` → Annual Service; `_oil_life` (key `oil_level`, %, py_uconnect `oilLevel`) → Oil Service
  percent_left (household floor).
- **polestar** (kildahldev fork, domain `polestar` ≠ `polestar_api`): `_odometer` → Tire Rotation; `_days_to_service`
  (unit 'd') + `_distance_to_service` → Annual Service.
- **cardata** (kvanbiesen, not in default): 'Vehicle mileage' (descriptor vehicle.vehicle.travelledDistance, forced
  TOTAL_INCREASING, stream unit normalised km/mi) → suffix `_vehicle_mileage`.
- **bavariandata** (JustChr): tk `vehicle_vehicle_travelleddistance` (catalogue descriptor, km). Cars streaming
  `vehicle.vehicle.mileage` get an uncatalogued, unit-less name sensor → not matched.
- **nissan_connect** (dan-r): tk `odometer` (km, suggested mi for imperial accounts).
- **smartcar** (wbyoung): suffix `_odometer` (km with imperial conversion).
- **lucidmotors** (borski): key `odometer_km`, tk `mileage` (km).
- **abrp** (MichelFR): tk `odometer` (km, TOTAL_INCREASING).

#### Added — e-bikes
- **specialized_turbo** (core 2026.9): tk `odometer` (km) → Lubricate Chain 250 km + Bike Service 2,000 km.
- **cowboy** (elsbrock): tk `total_distance` (km) → Bike Service 2,000 km only (carbon belt drive, no chain).
- **ha_bosch_ebike** (Xunil99, separate domain from bosch_ebike): tk `service_due_in_days` (d, duration_left 336 h)
  + `service_due_in_km` (km remaining to the dealer-set/overridden service odometer, value_below 100 km) → Bike
  Service; both created for every bike (BES2 too).

#### Added — locks (Lubricate Cylinder, cycle_count 2,000 × `locked`)
- **wyzeapi** (SecKatie; WyzeLock + WyzeLockBolt), **ttlock** (jbergler), **kwikset** (explosivo22, not in default),
  **nuki_web** (ArnyminerZ) — Nuki openers (type 2) are lock entities that read `locked` whenever online → excluded
  via `models_exclude=("Opener",)` (entity.py maps type 2 to model "Opener").

#### Added — mowers
- **mammotion** (mikey0000, not in default): tk `blade_used_time` (s→h, since the blade reset; service
  `reset_blade_time`) → Replace Blades usage_above 100 h; tk `maintenance_work_time` (lifetime s) → Clean
  Undercarriage usage_delta 25 h. Luba only — Yuka models ship no blade sensors.
- **dreame_mower** (bhuebschen, unmaintained since 06/2025): tk `blades_left` (%, siid 9 piid 2, created only when
  reported) → Replace Blades percent_left.
- **worx_vision_cloud** (SmartServicePL + ADNPolymerase forks, same domain + keys): tk `blade_runtime_current` (min,
  since reset) → Replace Blades usage_above 100 h; tk `mower_runtime_total` (min, lifetime) → Clean Undercarriage
  usage_delta 25 h. Mirrors landroid_cloud.

#### Added — pool / spa
- **intellicenter** (joyfulhouse): IntelliChlor `SALT_ATTR` sensor '<name> (Salt)' (ppm, no tk → suffix `_salt`) →
  Refill Pool Salt value_below 2,700 ppm (ScreenLogic band).
- **hotspring** (core 2026.9): tk `water_care_120_day_timer` ('Salt cartridge age'; integration docs: "number of days
  the FreshWater Salt System cartridge has been in use" → counts UP; only while a cartridge is installed) → NEW duty
  **Replace Salt Cartridge**, usage_above 2,880 h (120 days; Hot Spring: cartridge lasts up to four months).
- **neopool** (core; binary_sensor platform only on dev → 2026.10): tk `uv_lamp` (RUNNING, UV relay bit, created only
  for a valid UV relay GPIO) → NEW duty **Replace UV Lamp**, runtime_hours 8,000 h (Sugar Valley UVScenic manual:
  lamps last "1 year or 8,000 hours").
- **bestway** (cdpuk): binary `pool_filter_change_required` (no device class → not problem-adoptable; exact object id
  `binary_sensor.pool_filter_change_required`) → Replace Filter, event_present latch on `on`. A second pump gets a
  `_2` suffix and is not matched.

#### Skipped
- **wallbox_gateway** (botts7): `lifetime_energy` is read from the r_dca Power-Boost/MID meter payload (next to
  house power/current, only with that accessory) — whether it counts charger-delivered or house grid energy is not
  established from source.
- **ocpp** (lifetime vs session differs per charger), **emporia_ev**, **eveus**, **hypervolt** (no lifetime counter).
- **smartcar** 'Engine Oil Life': `lifeRemaining` passed through without the ×100 the sibling percent sensors apply —
  scale unverified; odometer only.
- **ha_bosch_ebike** `odometer` (Lubricate Chain): the entity-id suffix fallback would also claim
  `next_service_odometer` (a target odometer) and `last_ride_start_odometer` on the same device, and the counter
  watches the first sorted id → wrong source. Needs the engine to skip the suffix fallback for entities whose own
  translation_key differs.
- **iseo_argo_ble** (core 2026.9): X1R momentary latch release — `locked` is either assumed (no door status: set
  after every HA-initiated release only, card/keypad openings unseen) or mirrors `door_closed`; no bolt-throw cycle
  to count, no cylinder duty.
- **neopool** `cell_runtime_part` (resettable, disabled by default): no documented cleaning interval (cells self-clean
  by polarity reversal); the only figure found is electrode LIFE (> 8,000 h) — a replacement candidate, not signed.
  `measure_cl` is chlorine ppm despite its "Salt level" label — never a salt source.
- **dreame_mower** `blades_time_left` (h): not used — the % sensor covers the duty; the integration's reset writes the
  vacuum main-brush defaults (100 %/300 h), so the hour scale is suspect.
- **hotspring** `problem` binary: `_is_problem` returns False (OK) or None — never True, so it can never fire as an
  adopted problem sensor; no problem-table row.
- **victron_gx** ev_odometer (duplicate risk), **niu** (no e-scooter template), **toyota_na**, **ha_kia_hyundai**
  (unclear service semantics) — per the brief.

Problem-sensor rows (not catalog): Subaru `health_istrouble` + `mil_*` (core 2026.9), NeoPool `hidro_low`/`ion_low`/
`ion_program_time_exceeded`/`chlorine_flow_sensor_problem` (2026.10), Sofar `fault_*` (2026.10), Bestway spa/pool-filter
errors.
