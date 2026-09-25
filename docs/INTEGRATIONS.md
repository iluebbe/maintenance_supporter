# Supported integrations — Suggested setups catalog

<!-- GENERATED FILE — do not edit. Regenerate with:
     py -X utf8 scripts/generate_integrations_doc.py
     A tripwire test keeps this file in sync with the catalog. -->

Devices of these integrations are discovered by **Suggested setups**
and adopt with their sensor triggers pre-wired. Every entry is
verified against the integration's source code and re-checked weekly
by the upstream drift watchdog. Intervals marked *editorial* are
sensible defaults — every adopted task remains fully editable.

**Trigger styles:** *countdown* (time/percent remaining reported by
the device), *device counter* (usage counted by the device, reset on
service), *counter delta* (lifetime counter; counts from adoption or
a [start value](https://github.com/iluebbe/maintenance_supporter/issues/102)),
*engine runtime* (this integration accumulates active time itself),
*measurement* (plain threshold, auto-resolving), *event latch*
(appliance-reported maintenance event), *cycle count*.

## Beyond this list: problem-sensor adoption

The tables below cover the *signature catalog* — integration-specific
wear and consumable sensors. A second, **integration-agnostic**
surface exists alongside it: **Adopt problem sensors** turns any
binary sensor of device class `problem`, `safety` or `tamper` into a
triggered maintenance task that auto-resolves when the alert clears.

Known adoptable sensors (source-verified 2026-07-19 by sweeping the
upstream code of every catalogued integration; every entry names
the sensor the integration actually ships and the duty it becomes):

**Vehicles** — the warning-lamp families pair naturally with the
odometer/countdown duties above:

| Integration | Problem sensor(s) | Adopts as |
|---|---|---|
| **Hyundai / Kia** (HACS kia_uvo) | washer fluid, brake fluid, oil level, aux-battery, tire pressure (all + per tire) | Top-up / tire-check duties per warning |
| **Volvo** (core) | 28 warning binaries: oil, coolant and brake-fluid levels, washer fluid, per-lamp bulb failures, per-tire pressure | Fluid top-ups, bulb replacement, tire checks |
| **Mercedes-Benz** (HACS mbapi2020) | brake fluid, wash water, coolant level, aux battery, tire warnings | Same family |
| **Audi Connect** (HACS) | oil-level warning (`problem`), parking-light/braking status (`safety`) | Oil top-up, light check |
| **Tesla Fleet / Teslemetry / Tessie** (core) | per-tire TPMS soft warnings | Tire checks |
| **RDW** (core, NL) | `pending_recall` — the official Dutch vehicle-recall register | Book the recall fix |
| **Subaru** (core, 2026.9+) | `health_istrouble` (overall vehicle health) + one warning-lamp binary per reported system (`mil_*`: engine-oil level `mil_eol`, oil pressure `mil_opl`, check engine `mil_cel`, washer fluid `mil_wash`, tire pressure `mil_tpms`, ABS/EBD/airbag/brake lamps …) | Oil top-up, washer fluid, tire check, workshop visit per lamp |

**Appliances & home:**

| Integration | Problem sensor(s) | Adopts as |
|---|---|---|
| **Haier hOn** (HACS) | dishwasher **salt**, **rinse aid**, filter-replacement | Refill salt / rinse aid, change filter |
| **LG ThinQ** (HACS smartthinq_sensors) | detergent low, softener low, appliance error state | Refill detergent / softener |
| **Miele** (core) | appliance failure + active-notification (carries salt / rinse-aid / service warnings) | One catch-all fault task per appliance |
| **Synology DSM** (core) | `safety`-class disk status, bad-sector threshold exceeded, SSD remaining-life below threshold | Disk inspection / replacement per drive |
| **OpenTherm Gateway** (core) | boiler **service required**, low water pressure, gas fault, air-pressure fault, water overtemperature — any OpenTherm boiler | Boiler service / fault duties |
| **Intergas InComfort** (core) | boiler fault | Boiler service |
| **Viessmann ViCare** (core) | device error | Boiler service |
| **PetKit** (HACS) | replace-filter, waste-tank full, sand/food/water-level alerts, deodorizer presence | The matching feeder/litter/fountain duty each |
| **Litter-Robot** (core) | drawer removed, bonnet removed, **laser dirty** | Empty drawer / clean sensor |
| **La Marzocco** (core) | water tank empty | Refill water tank |
| **Roborock** (core) | dock water shortage, dirty-water box full | Refill dock water / empty dirty-water box |
| **ROMY** (core) | water tank empty | Refill mop tank |
| **Dyson** (HACS hass_dyson) | filter-replacement binary, per-fault sensors (incl. humidifier tank) | Filter change / fault triage |
| **Dreo** (HACS) | humidifier water empty | Refill tank |
| **Sensibo** (core) | filter-clean alert (device-computed) | AC filter cleaning |
| **VeSync / Levoit** (core) | humidifier water-lacks, water-tank-lifted | Refill / reseat the tank |
| **Blueair** (HACS) / **Winix** (HACS) | filter-expired resp. filter-replace binaries (alongside the % sensors in the catalog) | Filter change |
| **SmartTub** (core) | spa reminders — one binary per reminder (filter, water care) | The matching spa duty each |
| **Bambu Lab** (HACS) | HMS errors, print error | Printer fault triage |
| **Tedee** (core) | lock uncalibrated | Recalibrate lock |
| **Schlage** (core) | keypad disabled | Lock service check |
| **SwitchBot** (core) | lock/door unclosed + unlocked alarms, `tamper` alarm | Door/lock checks |
| **Yale Smart Alarm** (core) | lock jam, tamper, AC-fail | Lock/panel service |
| **CoolMaster** (core) | `clean_filter` per AC unit | AC filter cleaning |
| **Fjäråskupan** (core) | hood carbon-filter + grease-filter alerts | Replace/clean hood filters |
| **Flexit Nordic** (core) | `air_filter_polluted` (alongside the catalog's operating-time duty) | Filter change |
| **IntelliFire** (core) | fireplace maintenance / fan / flame / accessory errors | Fireplace service |
| **LetPot** (core) | hydroponics low-water, low-nutrients, pump error | Refill / pump check |
| **Shelly** (core) | TRV `calibration`, relay `overheating` | Recalibrate valve / inspect load |
| **UniFi Protect** (core) | `disk_health`, `tampering` | Replace recorder disk |
| **Hikvision** (core) | disk error/full, `tamper_detection` | Replace/clear recorder disk |
| **Samsung SyncThru** (core) | printer `problem` state | Printer fault triage |
| **Rehlko / Kohler** (core) | generator `oil_pressure` (alongside the catalog's 100-h oil service) | Immediate oil check |
| **myUplink** (core) | `has_alarm` — the heat pump's generic alarm flag | Heat-pump service check |
| **Midea dehumidifiers** (HACS midea_dehumidifier_lan) | tank full, tank removed, **filter replacement** | Empty tank / change filter |
| **Nest Protect** (HACS) | a dozen fault binaries (smoke/CO/heat sensor faults, battery); the device end-of-life date ships as a separate sensor | Detector service / replacement |
| **Deye dehumidifiers** (HACS) | water tank full | Empty tank |
| **Pit Boss grills** (HACS) | error states (default problem class) | Grill fault triage |
| **Bosch Smart Home** (HACS bosch_shc) | shutter `calibration required`, outdoor-siren faults (AC/DC error, battery defect, battery-temp abnormal, power outage), siren + motion-detector `tamper` | Recalibrate shutter / siren service / tamper checks |
| **ZHA / Z-Wave JS / deCONZ / MQTT** | device-dependent `tamper` + smoke-detector fault binaries | Detector service / tamper checks |
| **KNX** | any binary object the user maps with device class `problem`/`safety`/`tamper` (KNX entities are fully user-configured — set the class on your fault/maintenance group addresses and they become adoptable) | Whatever the object signals |
| **Midea** (core) | dishwasher **salt** + **rinse aid** (E1 / sink dishwasher), AC dust-full, dehumidifier / fresh-air filter-cleaning reminder, dehumidifier tank full (alongside the catalog's filter-life and softener-salt duties) | Refill salt / rinse aid, clean filter, empty tank |
| **Midea Dishwasher** (HACS midea_dishwasher) | **salt**, **rinse aid** | Refill salt / rinse aid |
| **ConnectLife** (HACS connectlife) | dishwasher salt- and rinse-aid-refill alarms, clean-the-filters alarm; oven descaling-needed alarm; hood grease- and recirculation-filter alarms | Refill salt / rinse aid, clean filters, descale oven, clean/replace hood filters |
| **Haier hOn — addhOn** (HACS addhon) | washer drum-clean / filter-clean / dry-clean needed, hood filter-cleaning alarm, AC filter change | Clean drum or filter, change AC filter |
| **Home Connect Local** (HACS homeconnect_ws) | dishwasher machine-care, machine-care + filter-cleaning, smart filter-cleaning and water-heater-calcified reminders; washer drum-clean reminder and i-Dos 1/2 fill level poor; dryer lint filter full and maintenance reminder (alongside the catalog's salt/rinse-aid latches) | Machine care, filter cleaning, refill i-Dos, clean lint filter |
| **GE Home** (HACS ge_home, custom repository) | built-in AC filter status, dehumidifier clean-filter, Opal ice-maker filter status | Clean / replace the filter |
| **Actron Air** (core, 2026.9) | `clean_filter` | AC filter cleaning |
| **IntelliClima** (core, 2026.9) | `filter_cleaning` (ECOCOMFORT ventilation units) | Filter cleaning |
| **Duco** (core, dev) | `diagnostic_filter` (alongside the catalog's filter countdown) | Filter change |
| **Flexit Modbus** (core, dev) | `filter_alarm` (alongside the catalog's filter-timer duty) | Filter change |
| **Aprilaire RS-485** (HACS aprilaire_rs485) | `alarm_filter`, `alarm_water_panel`, `alarm_dehumidifier`, `alarm_system` | Filter change / humidifier water-panel change / service check |
| **Daikin Madoka** (HACS daikin_madoka) | `clean_filter` indicator | AC filter cleaning |
| **BWT AQA Perla BLE** (HACS) | `salt_alarm` (alongside the catalog's salt %) | Refill softener salt |
| **EnergyTrak** (HACS) | generator `fault`, `malfunction` (alongside the catalog's engine-hours oil service) | Generator fault triage |
| **NeoPool / Sugar Valley** (core, 2026.10+) | hydrolysis production problem (`hidro_low`), ionizer production problem (`ion_low`), ionizer program time exceeded, chlorine flow sensor (`chlorine_flow_sensor_problem`) | Salt/cell check, ionizer electrode check, flow-sensor cleaning |
| **Sofar inverters** (core, 2026.10+) | one `problem` binary per fault category (`fault_fan`, `fault_insulation`, `fault_grid`, `fault_pv`, `fault_battery`, `fault_internal` …; arc-fault and fuse categories disabled by default) | Inverter service / fault triage |
| **Bestway Lay-Z-Spa / Flowclear** (HACS) | `Spa Errors` resp. `Pool Filter Errors` (problem class; the pump's filter-change binary is a catalog duty instead) | Spa / pump fault triage |

(QNAP, despite the family resemblance to Synology, ships no binary
sensors at all — its disk data is plain sensors, covered by the
catalog entry above.)

If a device reports a maintenance condition as a problem-class
binary sensor, it does not need a catalog entry here — the adoption
dialog picks it up automatically, whether or not it appears in this
table.

## Reviewed — no usable signals (use a template instead)

Integrations we source-dived that expose NEITHER consumable/wear
sensors NOR adoptable problem binaries. Their devices still need
maintenance — a static template covers them, and because these
devices run on fixed rhythms, calendar intervals track real usage
closely.

| Integration | What it exposes | Use instead |
|---|---|---|
| **ResMed myAir** (HACS resmed_myair_sensors) | therapy metrics only — per-night usage minutes, AHI, mask leak, myAir score; no consumable data, no cumulative counter, no live running state | The **CPAP Machine** template (nightly use ⇒ calendar ≈ usage; ResMed-guideline intervals for mask cushion, filter, tubing, humidifier tub, headgear) |

Adopted tasks are created *at adoption* (not when a problem first
fires) and are fully configurable from day one — responsible user,
priority, notes, documents, part links. See the
[adopted-task lifecycle](FEATURES.md#adopt-problem-sensors) for how
due/auto-complete and un-adopt/re-adopt behave.

## Cleaning robots — vacuums, mops and the Dolphin pool robot

| Integration | Domain | Task | Default | Notes |
|---|---|---|---|---|
| Roborock | `roborock` | Replace Main Brush | below 24 h remaining |  |
|  |  | Replace Side Brush | below 24 h remaining |  |
|  |  | Replace Filter | below 24 h remaining |  |
|  |  | Clean Sensors | below 24 h remaining |  |
|  |  | Replace Mop Pads | below 24 h remaining |  |
|  |  | Replace Dock Strainer | below 24 h remaining |  |
|  |  | Replace Maintenance Brush | below 24 h remaining |  |
|  |  | Clean Tub | at 30 h counted by the device |  |
| Xiaomi Miio | `xiaomi_miio` | Replace Main Brush | below 24 h remaining |  |
|  |  | Replace Side Brush | below 24 h remaining |  |
|  |  | Replace Filter | below 24 h remaining |  |
|  |  | Clean Sensors | below 24 h remaining |  |
| Dreame Vacuum | `dreame_vacuum` | Replace Main Brush | below the household consumable floor (default 10 %) |  |
|  |  | Replace Side Brush | below the household consumable floor (default 10 %) |  |
|  |  | Replace Filter | below the household consumable floor (default 10 %) |  |
|  |  | Clean Sensors | below the household consumable floor (default 10 %) |  |
|  |  | Replace Mop Pads | below the household consumable floor (default 10 %) |  |
|  |  | Refill Detergent | below the household consumable floor (default 10 %) |  |
|  |  | Replace Secondary Filter | below the household consumable floor (default 10 %) |  |
|  |  | Replace Silver-ion Module | below the household consumable floor (default 10 %) |  |
| Ecovacs | `ecovacs` | Replace Main Brush | below the household consumable floor (default 10 %) |  |
|  |  | Replace Side Brush | below the household consumable floor (default 10 %) |  |
|  |  | Replace Filter | below the household consumable floor (default 10 %) | one task per entity |
|  |  | Replace Secondary Filter | below the household consumable floor (default 10 %) |  |
|  |  | Replace Dust Bag | below the household consumable floor (default 10 %) |  |
|  |  | Replace Mop Pads | below the household consumable floor (default 10 %) |  |
|  |  | Refill Detergent | below the household consumable floor (default 10 %) |  |
|  |  | Empty Dirty Water Tank | below the household consumable floor (default 10 %) |  |
|  |  | Clean Mop Tray | below the household consumable floor (default 10 %) |  |
|  |  | Replace Air Freshener | below the household consumable floor (default 10 %) |  |
|  |  | Replace UV Lamp | below the household consumable floor (default 10 %) |  |
|  |  | Replace Blades | below the household consumable floor (default 10 %) |  |
|  |  | Replace Lens Brush | below the household consumable floor (default 10 %) |  |
|  |  | Replace Trimmer Brush | below the household consumable floor (default 10 %) |  |
|  |  | Replace Trimmer Line | below the household consumable floor (default 10 %) |  |
|  |  | Clean Undercarriage | every 25 units (counter delta) |  |
| WeBack Vacuum | `weback_vacuum` | Filter Cleaning | every 15 h counted by the engine | vacuum entity; active: cleaning |
|  |  | Clean Main Brush | every 30 h counted by the engine | vacuum entity; active: cleaning |
| iRobot Roomba | `roomba` | Filter Cleaning | every 15 h counted by the engine | vacuum entity; active: cleaning |
|  |  | Clean Main Brush | every 30 h counted by the engine | vacuum entity; active: cleaning |
|  |  | Empty Dustbin | while the appliance reports 'on' | binary_sensor entity |
| Neato Botvac | `neato` | Filter Cleaning | every 15 h counted by the engine | vacuum entity; active: cleaning |
|  |  | Clean Main Brush | every 30 h counted by the engine | vacuum entity; active: cleaning |
| ROMY Vacuum | `romy` | Filter Cleaning | every 15 h counted by the engine | vacuum entity; active: cleaning |
|  |  | Clean Main Brush | every 30 h counted by the engine | vacuum entity; active: cleaning |
| Tuya vacuum | `tuya` | Replace Main Brush | below the household consumable floor (default 10 %) |  |
|  |  | Replace Side Brush | below the household consumable floor (default 10 %) |  |
|  |  | Replace Filter | below the household consumable floor (default 10 %) |  |
|  |  | Replace Mop Pads | below the household consumable floor (default 10 %) |  |
|  |  | Filter Cleaning | every 15 h counted by the engine | vacuum entity; active: cleaning |
|  |  | Clean Main Brush | every 30 h counted by the engine | vacuum entity; active: cleaning |
| SwitchBot vacuum | `switchbot_cloud` | Filter Cleaning | every 15 h counted by the engine | vacuum entity; active: cleaning |
|  |  | Clean Main Brush | every 30 h counted by the engine | vacuum entity; active: cleaning |
| SmartThings | `smartthings` | Filter Cleaning | every 15 h counted by the engine | vacuum entity; active: cleaning |
|  |  | Clean Main Brush | every 30 h counted by the engine | vacuum entity; active: cleaning |
|  |  | Replace Water Filter | above 90 |  |
|  |  | Clean Grease Filter | above 90 |  |
| Shark IQ | `sharkiq` | Filter Cleaning | every 15 h counted by the engine | vacuum entity; active: cleaning |
|  |  | Clean Main Brush | every 30 h counted by the engine | vacuum entity; active: cleaning |
| TP-Link Tapo vacuum | `tplink` | Filter Cleaning | every 15 h counted by the engine | vacuum entity; active: cleaning |
|  |  | Clean Main Brush | every 30 h counted by the engine | vacuum entity; active: cleaning |
| Maytronics Dolphin | `mydolphin_plus` | Filter Cleaning | while the appliance reports 'full' |  |
| Eufy Clean | `robovac_mqtt` | Replace Filter | below 24 h remaining |  |
|  |  | Replace Main Brush | below 24 h remaining |  |
|  |  | Replace Side Brush | below 24 h remaining |  |
|  |  | Replace Mop Pads | below 24 h remaining |  |
|  |  | Clean Sensors | below 6 h remaining |  |
|  |  | Clean Mop Tray | below 6 h remaining |  |
| Eufy RoboVac | `robovac` | Filter Cleaning | every 15 h counted by the engine | vacuum entity; active: cleaning |
|  |  | Clean Main Brush | every 30 h counted by the engine | vacuum entity; active: cleaning |
|  |  | Replace Filter | at 360 h counted by the device |  |
|  |  | Replace Main Brush | at 360 h counted by the device |  |
|  |  | Replace Side Brush | at 180 h counted by the device |  |
|  |  | Replace Mop Pads | at 180 h counted by the device |  |
|  |  | Clean Sensors | at 60 h counted by the device |  |
|  |  | Clean Mop Tray | at 30 h counted by the device |  |
| Tineco | `tineco` | Clean Main Brush | while the appliance reports 'needs_cleaning' |  |
| Xiaomi Vacuum (cloud) | `xiaomi_vacuum` | Replace Main Brush | below the household consumable floor (default 10 %) |  |
|  |  | Replace Side Brush | below the household consumable floor (default 10 %) |  |
|  |  | Replace Filter | below the household consumable floor (default 10 %) |  |
|  |  | Replace Mop Pads | below the household consumable floor (default 10 %) |  |
| ILIFE | `ilife` | Replace Main Brush | below the household consumable floor (default 10 %) | device-type gated |
|  |  | Replace Side Brush | below the household consumable floor (default 10 %) | device-type gated |
|  |  | Replace Filter | below the household consumable floor (default 10 %) | device-type gated |

## Robot lawn mowers, irrigation and pool/spa water care

| Integration | Domain | Task | Default | Notes |
|---|---|---|---|---|
| Husqvarna Automower | `husqvarna_automower` | Replace Blades | at 100 h counted by the device |  |
|  |  | Clean Undercarriage | every 25 units (counter delta) |  |
|  |  | Clean Charging Contacts | every 100 units (counter delta) |  |
| Worx Landroid | `landroid_cloud` | Replace Blades | at 100 h counted by the device |  |
|  |  | Clean Undercarriage | every 25 units (counter delta) |  |
| Gardena Smart System | `gardena_smart_system` | Replace Blades | every 100 units (counter delta) |  |
|  |  | Clean Undercarriage | every 25 units (counter delta) |  |
| Segway Navimow | `navimow` | Replace Blades | every 100 h counted by the engine | lawn_mower entity; active: mowing |
|  |  | Clean Undercarriage | every 25 h counted by the engine | lawn_mower entity; active: mowing |
| Sunseeker mowers | `sunseeker` | Replace Blades | below 24 h remaining |  |
|  |  | Replace Blades | below the household consumable floor (default 10 %) |  |
| Husqvarna Automower BLE | `husqvarna_automower_ble` | Replace Blades | every 100 h counted by the engine | lawn_mower entity; active: mowing |
|  |  | Clean Undercarriage | every 25 h counted by the engine | lawn_mower entity; active: mowing |
| Rain Bird irrigation | `rainbird` | Clean Sprinkler Heads | every 30 h counted by the engine | switch entity; active: on |
| Pentair ScreenLogic | `screenlogic` | Refill Pool Salt | below 2700 |  |
| Ondilo ICO | `ondilo_ico` | Refill Pool Salt | below 2700 |  |
| Mammotion (Luba) | `mammotion` | Replace Blades | at 100 h counted by the device |  |
|  |  | Clean Undercarriage | every 25 units (counter delta) |  |
| Dreame Mower | `dreame_mower` | Replace Blades | below the household consumable floor (default 10 %) |  |
| Worx Landroid Vision | `worx_vision_cloud` | Replace Blades | at 100 h counted by the device |  |
|  |  | Clean Undercarriage | every 25 units (counter delta) |  |
| Pentair IntelliCenter | `intellicenter` | Refill Pool Salt | below 2700 |  |
| Hot Spring spas | `hotspring` | Replace Salt Cartridge | at 2880 h counted by the device |  |
| Sugar Valley NeoPool | `neopool` | Replace UV Lamp | every 8000 h counted by the engine | binary_sensor entity; active: on |
| Bestway (Lay-Z-Spa / Flowclear) | `bestway` | Replace Filter | while the appliance reports 'on' | binary_sensor entity |

## Cars and EVs — odometer-driven service duties

| Integration | Domain | Task | Default | Notes |
|---|---|---|---|---|
| Hyundai / Kia Connect | `kia_uvo` | Annual Service | every 15000 units (counter delta) |  |
|  |  | Tire Rotation | every 10000 units (counter delta) |  |
| Tesla (custom) | `tesla_custom` | Annual Service | every 15000 units (counter delta) |  |
|  |  | Tire Rotation | every 10000 units (counter delta) |  |
| Renault | `renault` | Annual Service | every 15000 units (counter delta) |  |
|  |  | Tire Rotation | every 10000 units (counter delta) |  |
| Mercedes-Benz | `mbapi2020` | Annual Service | every 15000 units (counter delta) |  |
|  |  | Tire Rotation | every 10000 units (counter delta) |  |
| VW Group (EU Data Act) | `vw_eu_data_act` | Annual Service | every 15000 units (counter delta) |  |
|  |  | Tire Rotation | every 10000 units (counter delta) |  |
| Subaru | `subaru` | Annual Service | every 15000 units (counter delta) |  |
|  |  | Tire Rotation | every 10000 units (counter delta) |  |
| Volvo | `volvo` | Annual Service | every 15000 units (counter delta) |  |
|  |  | Tire Rotation | every 10000 units (counter delta) |  |
| Polestar | `polestar_api` | Annual Service | every 15000 units (counter delta) |  |
|  |  | Tire Rotation | every 10000 units (counter delta) |  |
| Ford (FordPass) | `fordpass` | Annual Service | every 15000 units (counter delta) |  |
|  |  | Tire Rotation | every 10000 units (counter delta) |  |
| Toyota Connected | `toyota` | Annual Service | every 15000 units (counter delta) |  |
|  |  | Tire Rotation | every 10000 units (counter delta) |  |
| MG/SAIC iSMART | `mg_saic` | Annual Service | every 15000 units (counter delta) |  |
|  |  | Tire Rotation | every 10000 units (counter delta) |  |
| Škoda (MySkoda) | `myskoda` | Tire Rotation | every 10000 units (counter delta) |  |
|  |  | Annual Service | below 14 days remaining |  |
|  |  | Annual Service | below 1000 |  |
|  |  | Oil Service | below 14 days remaining |  |
|  |  | Oil Service | below 1000 |  |
| Audi Connect | `audiconnect` | Tire Rotation | every 10000 units (counter delta) |  |
|  |  | Annual Service | below 14 days remaining |  |
|  |  | Annual Service | below 1000 |  |
|  |  | Oil Service | below 14 days remaining |  |
|  |  | Oil Service | below 1000 |  |
| Tesla Fleet | `tesla_fleet` | Annual Service | every 15000 units (counter delta) |  |
|  |  | Tire Rotation | every 10000 units (counter delta) |  |
| Teslemetry | `teslemetry` | Annual Service | every 15000 units (counter delta) |  |
|  |  | Tire Rotation | every 10000 units (counter delta) |  |
| Tessie | `tessie` | Annual Service | every 15000 units (counter delta) |  |
|  |  | Tire Rotation | every 10000 units (counter delta) |  |
| Ituran | `ituran` | Annual Service | every 15000 units (counter delta) |  |
|  |  | Tire Rotation | every 10000 units (counter delta) |  |
| StarLine | `starline` | Annual Service | every 15000 units (counter delta) |  |
|  |  | Tire Rotation | every 10000 units (counter delta) |  |
| Bosch eBike | `bosch_ebike` | Lubricate Chain | every 250 units (counter delta) |  |
|  |  | Bike Service | every 2000 units (counter delta) |  |
| Stromer eBike | `stromer` | Lubricate Chain | every 250 units (counter delta) |  |
|  |  | Bike Service | every 2000 units (counter delta) |  |
| Stellantis (Peugeot/Citroën/DS/Opel/Fiat…) | `stellantis_vehicles` | Tire Rotation | every 10000 units (counter delta) |  |
|  |  | Annual Service | below 14 days remaining |  |
|  |  | Annual Service | below 1000 |  |
| BMW CarData (bmw-cardata-ha) | `cardata` | Annual Service | every 15000 units (counter delta) |  |
|  |  | Tire Rotation | every 10000 units (counter delta) |  |
| BavarianData (BMW CarData) | `bavariandata` | Annual Service | every 15000 units (counter delta) |  |
|  |  | Tire Rotation | every 10000 units (counter delta) |  |
| Uconnect (Jeep/Fiat/Chrysler/Dodge/Ram/Alfa Romeo) | `uconnect` | Tire Rotation | every 10000 units (counter delta) |  |
|  |  | Annual Service | below 14 days remaining |  |
|  |  | Annual Service | below 1000 |  |
|  |  | Oil Service | below the household consumable floor (default 10 %) |  |
| Porsche Connect | `porscheconnect` | Tire Rotation | every 10000 units (counter delta) |  |
|  |  | Annual Service | below 14 days remaining |  |
|  |  | Annual Service | below 1000 |  |
|  |  | Oil Service | below 14 days remaining |  |
|  |  | Oil Service | below 1000 |  |
| Nissan Connect | `nissan_connect` | Annual Service | every 15000 units (counter delta) |  |
|  |  | Tire Rotation | every 10000 units (counter delta) |  |
| Smartcar | `smartcar` | Annual Service | every 15000 units (counter delta) |  |
|  |  | Tire Rotation | every 10000 units (counter delta) |  |
| Lucid Motors | `lucidmotors` | Annual Service | every 15000 units (counter delta) |  |
|  |  | Tire Rotation | every 10000 units (counter delta) |  |
| ABRP (A Better Routeplanner) | `abrp` | Annual Service | every 15000 units (counter delta) |  |
|  |  | Tire Rotation | every 10000 units (counter delta) |  |
| Unofficial Polestar | `polestar` | Tire Rotation | every 10000 units (counter delta) |  |
|  |  | Annual Service | below 14 days remaining |  |
|  |  | Annual Service | below 1000 |  |
| Specialized Turbo eBike | `specialized_turbo` | Lubricate Chain | every 250 units (counter delta) |  |
|  |  | Bike Service | every 2000 units (counter delta) |  |
| Cowboy eBike | `cowboy` | Bike Service | every 2000 units (counter delta) |  |
| Bosch eBike (Smart System & eBike System 2) | `ha_bosch_ebike` | Bike Service | below 14 days remaining |  |
|  |  | Bike Service | below 100 |  |
|  |  | Lubricate Chain | every 250 units (counter delta) |  |

## EV chargers — cable/plug inspection by delivered energy

| Integration | Domain | Task | Default | Notes |
|---|---|---|---|---|
| Easee Wallbox | `easee` | Inspect Cable and Plug | every 5000 units (counter delta) |  |
| KEBA Wallbox | `keba` | Inspect Cable and Plug | every 5000 units (counter delta) |  |
| go-e Charger | `goecharger_api2` | Inspect Cable and Plug | every 5000 units (counter delta) |  |
| OpenEVSE | `openevse` | Inspect Cable and Plug | every 5000 units (counter delta) |  |
| Tesla Wall Connector | `tesla_wall_connector` | Inspect Cable and Plug | every 5000 units (counter delta) |  |
| NexBlue | `nexblue` | Inspect Cable and Plug | every 5000 units (counter delta) |  |
| Silla Prism | `silla_prism` | Inspect Cable and Plug | every 5000 units (counter delta) |  |
| Besen EV charger | `besen` | Inspect Cable and Plug | every 5000 units (counter delta) |  |
| Peblar | `peblar` | Inspect Cable and Plug | every 5000 units (counter delta) |  |
| Zaptec EV charger | `zaptec` | Inspect Cable and Plug | every 5000 units (counter delta) |  |
| go-eCharger (MQTT) | `goecharger_mqtt` | Inspect Cable and Plug | every 5000 units (counter delta) |  |

## Boilers, heating & water treatment

| Integration | Domain | Task | Default | Notes |
|---|---|---|---|---|
| Viessmann ViCare | `vicare` | Replace Filter | below 24 h remaining |  |
|  |  | Annual Inspection | every 2000 units (counter delta) |  |
| Bosch/Buderus heating | `bosch` | Refill Heating Water | below 1 |  |
| OpenTherm Gateway | `opentherm_gw` | Refill Heating Water | below 1 |  |
| Plugwise (Anna/Adam) | `plugwise` | Refill Heating Water | below 1 |  |
| Intergas InComfort | `incomfort` | Refill Heating Water | below 1 |  |
| ATAG One | `atag` | Refill Heating Water | below 1 |  |
| BWT Perla | `bwt_perla` | Refill Softener Salt | below the household consumable floor (default 10 %) |  |
|  |  | Refill Softener Salt | below 7 days remaining |  |
| EcoWater softener | `ecowater_softener` | Refill Softener Salt | below the household consumable floor (default 10 %) |  |
|  |  | Refill Softener Salt | below 7 days remaining |  |
| Wolf SmartSet | `wolflink` | Refill Heating Water | below 1 |  |
| Palazzetti pellet stove | `palazzetti` | Empty Ash Pan | every 100 units (counter delta) |  |
| Vaillant (myVAILLANT) | `mypyllant` | Refill Heating Water | below 1 |  |
| Grohe Blue | `grohe_smarthome` | Replace Water Filter | below the household consumable floor (default 10 %) |  |
|  |  | Replace CO2 Bottle | below the household consumable floor (default 10 %) |  |
| iQua softener | `iqua_softener` | Refill Softener Salt | below the household consumable floor (default 10 %) |  |
| Fumis (pellet stoves) | `fumis` | Annual Service | below 24 h remaining |  |
| Rehlko / Kohler generators | `rehlko` | Oil Service | at 100 h counted by the device |  |
| AquaCell softener | `aquacell` | Refill Softener Salt | below the household consumable floor (default 10 %) |  |
| De Dietrich (Diematic) | `de_dietrich` | Refill Heating Water | below 1 |  |
| Remeha Home | `remeha_home` | Refill Heating Water | below 1 |  |
| SYR Connect (softeners) | `syr_connect` | Refill Softener Salt | below 2 |  |
| Salt Sentry | `salt_sentry` | Refill Softener Salt | below the household consumable floor (default 10 %) |  |
| Unique Waterontharder | `unique_waterontharder` | Refill Softener Salt | below the household consumable floor (default 10 %) |  |
| BWT AQA Perla (BLE) | `bwt_aqa_perla_ble` | Refill Softener Salt | below the household consumable floor (default 10 %) |  |
| Generac (Mobile Link) | `generac` | Oil Service | every 200 units (counter delta) |  |
| EnergyTrak (generators) | `energytrak` | Oil Service | every 200 units (counter delta) |  |
| Himoinsa C4LAN generators | `himoinsa_c4lan` | Oil Service | every 250 units (counter delta) |  |

## Air treatment — purifiers, ACs and HRV/ventilation filters

| Integration | Domain | Task | Default | Notes |
|---|---|---|---|---|
| Dyson | `hass_dyson` | Replace Filter | below the household consumable floor (default 10 %) |  |
| Dreo | `dreo` | Replace Filter | below the household consumable floor (default 10 %) |  |
| VeSync (Levoit) | `vesync` | Replace Filter | below the household consumable floor (default 10 %) |  |
| Daikin AC | `daikin` | Filter Cleaning | every 100 h counted by the engine | climate entity; active: cool/dry/fan_only/heat/heat_cool |
| Gree AC | `gree` | Filter Cleaning | every 100 h counted by the engine | climate entity; active: auto/cool/dry/fan_only/heat |
| Zehnder ComfoAirQ | `comfoconnect` | Replace Ventilation Filter | below 7 days remaining |  |
| Renson Endura Delta | `renson` | Replace Ventilation Filter | below 7 days remaining |  |
| Philips AirPurifier (CoAP) | `philips_airpurifier_coap` | Filter Cleaning | below the household consumable floor (default 10 %) |  |
|  |  | Filter Cleaning | below 3 days remaining |  |
|  |  | Replace Filter | below the household consumable floor (default 10 %) |  |
|  |  | Replace Filter | below 3 days remaining |  |
|  |  | Replace Wick | below the household consumable floor (default 10 %) |  |
|  |  | Replace Wick | below 3 days remaining |  |
| IKEA DIRIGERA (STARKVIND) | `dirigera_platform` | Replace Filter | at 4320 h counted by the device |  |
| Blueair | `ha_blueair` | Replace Filter | below the household consumable floor (default 10 %) |  |
|  |  | Replace Wick | below the household consumable floor (default 10 %) |  |
|  |  | Replace Water Refresher | below the household consumable floor (default 10 %) |  |
| Coway IoCare | `coway` | Filter Cleaning | below the household consumable floor (default 10 %) |  |
|  |  | Replace Filter | below the household consumable floor (default 10 %) |  |
| Winix | `winix` | Replace Filter | below the household consumable floor (default 10 %) |  |
| Duco ventilation | `duco` | Replace Ventilation Filter | below 7 days remaining |  |
| Flexit Nordic | `flexit_bacnet` | Replace Ventilation Filter | at 4380 h counted by the device |  |
| IKEA Trådfri (STARKVIND) | `tradfri` | Replace Filter | below 3 days remaining |  |
| Dyson (local) | `dyson_local` | Replace Filter | below the household consumable floor (default 10 %) |  |
|  |  | Replace Filter | below 3 days remaining |  |
| Venstar thermostat | `venstar` | Replace Filter | at 300 h counted by the device |  |
| Meross LAN (MAP100 purifier) | `meross_lan` | Replace Filter | below the household consumable floor (default 10 %) |  |
| Tuya Local | `tuya_local` | Replace Filter | below the household consumable floor (default 10 %) |  |
| Govee (purifiers) | `govee` | Replace Filter | below the household consumable floor (default 10 %) |  |
| Duux | `duux` | Replace Filter | below the household consumable floor (default 10 %) |  |
| Komfovent ventilation | `komfovent` | Replace Ventilation Filter | above 90 |  |
| Pluggit ventilation | `pluggit` | Replace Ventilation Filter | below 7 days remaining |  |
| Dantherm ventilation | `dantherm` | Replace Ventilation Filter | below 7 days remaining |  |
| Carrier Infinity | `ha_carrier` | Replace Filter | below the household consumable floor (default 10 %) |  |
| Samsung (Local Things) | `localthings` | Filter Cleaning | above 90 | device-type gated |
|  |  | Replace Filter | above 90 |  |
|  |  | Clean Grease Filter | above 90 |  |
| Flexit (Modbus) | `flexit` | Replace Ventilation Filter | at 4380 h counted by the device |  |

## Kitchen & household appliances incl. espresso machines

| Integration | Domain | Task | Default | Notes |
|---|---|---|---|---|
| LG ThinQ | `lg_thinq` | Replace Filter | below the household consumable floor (default 10 %) |  |
|  |  | Replace Filter | below 24 h remaining |  |
|  |  | Replace Water Filter | below the household consumable floor (default 10 %) |  |
| LG ThinQ (SmartThinQ) | `smartthinq_sensors` | Replace Filter | below the household consumable floor (default 10 %) |  |
|  |  | Replace Water Filter | below the household consumable floor (default 10 %) |  |
|  |  | Clean Tub | at 30 h counted by the device |  |
|  |  | Refill Rinse Aid | while the appliance reports 'on' | binary_sensor entity |
|  |  | Refill Salt | while the appliance reports 'on' | binary_sensor entity |
| Home Connect | `home_connect` | Refill Salt | while the appliance reports 'present' |  |
|  |  | Refill Rinse Aid | while the appliance reports 'present' |  |
|  |  | Descale Appliance | while the appliance reports 'present' |  |
|  |  | Clean Appliance | while the appliance reports 'present' |  |
|  |  | Filter Cleaning | while the appliance reports 'present' |  |
|  |  | Clean Grease Filter | while the appliance reports 'present' |  |
|  |  | Refill Detergent | while the appliance reports 'present' | one task per entity |
|  |  | Empty Dustbin | while the appliance reports 'present' |  |
| Home Connect Local | `homeconnect_ws` | Refill Salt | while the appliance reports 'present' |  |
|  |  | Refill Rinse Aid | while the appliance reports 'present' |  |
|  |  | Clean Grease Filter | above 90 |  |
|  |  | Replace Filter | above 90 |  |
|  |  | Descale Appliance | below 10 |  |
|  |  | Clean Appliance | below 10 |  |
|  |  | Replace Water Filter | below 10 |  |
| Miele | `miele` | Refill Salt | below the household consumable floor (default 10 %) |  |
|  |  | Refill Rinse Aid | below the household consumable floor (default 10 %) |  |
|  |  | Refill Detergent | below the household consumable floor (default 10 %) |  |
|  |  | Clean Tub | every 60 h counted by the engine | active: in_use; device-type gated |
| Electrolux / AEG | `electrolux_status` | Replace Filter | below the household consumable floor (default 10 %) |  |
| Midea (LAN) | `midea_ac_lan` | Replace Water Filter | below the household consumable floor (default 10 %) | except Air Purifier |
|  |  | Replace Filter | below the household consumable floor (default 10 %) | models: Toilet/Air Purifier |
| Midea (core) | `midea` | Refill Softener Salt | below the household consumable floor (default 10 %) |  |
|  |  | Replace Water Filter | below the household consumable floor (default 10 %) | models: Water Drinking Appliance |
|  |  | Replace Filter | below the household consumable floor (default 10 %) | models: Air Purifier/Toilet |
| La Marzocco | `lamarzocco` | Backflush Espresso Group | every 100 units (counter delta) |  |
|  |  | Replace Water Filter | every 1000 units (counter delta) |  |
| Haier hOn (Haier/Candy/Hoover) | `hon` | Replace Filter | below the household consumable floor (default 10 %) |  |
|  |  | Filter Cleaning | below the household consumable floor (default 10 %) |  |
|  |  | Clean Tub | every 30 units (counter delta) |  |
| Whirlpool | `whirlpool` | Clean Tub | every 60 h counted by the engine | active: running_maincycle |
| WashData (smart-plug cycles) | `ha_washdata` | Descaling | every 30 units (counter delta) |  |
|  |  | Filter Cleaning | every 50 units (counter delta) |  |
|  |  | Clean Tub | every 100 units (counter delta) |  |
| Traeger grill | `traeger` | Clean Grease Trap | every 5 units (counter delta) |  |
|  |  | Clean Appliance | every 20 units (counter delta) |  |
| Electrolux (OCP API) | `electrolux` | Replace Filter | below the household consumable floor (default 10 %) | one task per entity |
| GE Home (SmartHQ) | `ge_home` | Replace Water Filter | below the household consumable floor (default 10 %) |  |
| Candy Simply-Fi | `candy` | Clean Tub | every 30 units (counter delta) |  |
|  |  | Descaling | below 1 |  |
|  |  | Filter Cleaning | below 1 |  |

## 2D and 3D printers incl. Klipper via Moonraker

| Integration | Domain | Task | Default | Notes |
|---|---|---|---|---|
| Bambu Lab | `bambu_lab` | Lubricate Rails and Rods | every 500 units (counter delta) |  |
|  |  | Replace Filter | every 300 units (counter delta) | models: X1C/X1E/P1S/H2 |
|  |  | Clean Carbon Rods | every 100 units (counter delta) | models: X1/P1S/P1P |
|  |  | Replace Purge Wiper | every 300 units (counter delta) | models: A1 |
|  |  | Replace Desiccant | above 40 | models: AMS; except AMS Lite |
| OctoPrint | `octoprint` | Lubricate Rails and Rods | every 200 h counted by the engine | binary_sensor entity; active: on |
| PrusaLink | `prusalink` | Lubricate Rails and Rods | every 200 h counted by the engine | active: printing |
| Moonraker (Klipper) | `moonraker` | Replace Nozzle | every 1000 units (counter delta) |  |
| Creality (WebSocket) | `ha_creality_ws` | Lubricate Rails and Rods | every 200 h counted by the engine | active: printing |
| Elegoo printer | `elegoo_printer` | Lubricate Rails and Rods | every 200 h counted by the engine | active: printing; device-type gated |
| Anycubic Cloud | `anycubic_cloud` | Lubricate Rails and Rods | every 200 units (counter delta) | device-type gated |
| IPP printer | `ipp` | Replace Ink or Toner | below the household consumable floor (default 10 %) | one task per entity |
| Brother printer | `brother` | Replace Ink or Toner | below the household consumable floor (default 10 %) | one task per entity |
|  |  | Replace Maintenance Box | below the household consumable floor (default 10 %) |  |
|  |  | Replace Laser Unit | below the household consumable floor (default 10 %) |  |
|  |  | Replace Paper Feed Kit | below the household consumable floor (default 10 %) | one task per entity |
|  |  | Replace Toner | below the household consumable floor (default 10 %) | one task per entity |
|  |  | Replace Drum Unit | below the household consumable floor (default 10 %) | one task per entity |
|  |  | Replace Belt Unit | below the household consumable floor (default 10 %) |  |
|  |  | Replace Fuser | below the household consumable floor (default 10 %) |  |
| HP printer | `hpprinter` | Replace Ink or Toner | below the household consumable floor (default 10 %) | one task per entity |
| Epson WorkForce | `epson_workforce` | Replace Ink or Toner | below the household consumable floor (default 10 %) | one task per entity |

## Smart locks — cycle-count lubrication duties

| Integration | Domain | Task | Default | Notes |
|---|---|---|---|---|
| Nuki Smart Lock | `nuki` | Lubricate Cylinder | every 2000 cycles | lock entity; active: locked |
| Tedee Smart Lock | `tedee` | Lubricate Cylinder | every 2000 cycles | lock entity; active: locked |
| August lock | `august` | Lubricate Cylinder | every 2000 cycles | lock entity; active: locked |
| Yale lock | `yale` | Lubricate Cylinder | every 2000 cycles | lock entity; active: locked |
| SwitchBot Lock | `switchbot` | Lubricate Cylinder | every 2000 cycles | lock entity; active: locked |
| LOQED Smart Lock | `loqed` | Lubricate Cylinder | every 2000 cycles | lock entity; active: locked |
| Homematic IP lock | `homematicip_cloud` | Lubricate Cylinder | every 2000 cycles | lock entity; active: locked |
| Schlage lock | `schlage` | Lubricate Cylinder | every 2000 cycles | lock entity; active: locked |
| Sesame lock | `sesame` | Lubricate Cylinder | every 2000 cycles | lock entity; active: locked |
| Yale/August BLE lock | `yalexs_ble` | Lubricate Cylinder | every 2000 cycles | lock entity; active: locked |
| dormakaba dKey lock | `dormakaba_dkey` | Lubricate Cylinder | every 2000 cycles | lock entity; active: locked |
| Homematic KeyMatic | `homematic` | Lubricate Cylinder | every 2000 cycles | lock entity; active: locked |
| Wyze Lock | `wyzeapi` | Lubricate Cylinder | every 2000 cycles | lock entity; active: locked |
| TTLock | `ttlock` | Lubricate Cylinder | every 2000 cycles | lock entity; active: locked |
| Kwikset Smart Locks | `kwikset` | Lubricate Cylinder | every 2000 cycles | lock entity; active: locked |
| Nuki Web | `nuki_web` | Lubricate Cylinder | every 2000 cycles | lock entity; active: locked; except Opener |

## Protocol/hub transports whose duties are entity-domain-gated

| Integration | Domain | Task | Default | Notes |
|---|---|---|---|---|
| Matter lock | `matter` | Lubricate Cylinder | every 2000 cycles | lock entity; active: locked |
| Z-Wave lock | `zwave_js` | Lubricate Cylinder | every 2000 cycles | lock entity; active: locked |
| Zigbee (ZHA) lock | `zha` | Lubricate Cylinder | every 2000 cycles | lock entity; active: locked |
| MQTT lock (Zigbee2MQTT etc.) | `mqtt` | Lubricate Cylinder | every 2000 cycles | lock entity; active: locked |
|  |  | Filter Cleaning | every 15 h counted by the engine | vacuum entity; active: cleaning |
|  |  | Clean Main Brush | every 30 h counted by the engine | vacuum entity; active: cleaning |
|  |  | Replace Blades | every 100 h counted by the engine | lawn_mower entity; active: mowing |
|  |  | Clean Undercarriage | every 25 h counted by the engine | lawn_mower entity; active: mowing |
| HomeKit lock | `homekit_controller` | Lubricate Cylinder | every 2000 cycles | lock entity; active: locked |
| deCONZ (Zigbee) lock | `deconz` | Lubricate Cylinder | every 2000 cycles | lock entity; active: locked |

## NAS & home IT

| Integration | Domain | Task | Default | Notes |
|---|---|---|---|---|
| Synology NAS | `synology_dsm` | Storage Cleanup | above 85 |  |
| QNAP NAS | `qnap` | Storage Cleanup | above 85 |  |
| Unraid | `unraid` | Storage Cleanup | above 85 |  |
| Unraid API | `unraid_api` | Storage Cleanup | above 85 |  |
| Unraid Management Agent | `unraid_management_agent` | Storage Cleanup | above 85 |  |
| UniFi UNAS (REST) | `unifi_unas_rest` | Storage Cleanup | above 85 |  |
| UniFi UNAS (MQTT) | `unifi_unas` | Storage Cleanup | above 85 |  |
| MOS NAS | `mos` | Storage Cleanup | above 85 |  |

## Pet tech — feeders, fountains, litter boxes

| Integration | Domain | Task | Default | Notes |
|---|---|---|---|---|
| PetKit | `petkit` | Replace Desiccant | below 2 days remaining |  |
|  |  | Replace Water Filter | below the household consumable floor (default 10 %) |  |
| Litter-Robot | `litterrobot` | Empty Waste Drawer | above 90 |  |
|  |  | Refill Litter | below the household consumable floor (default 10 %) |  |
|  |  | Wash Litter Box | every 150 units (counter delta) |  |
| PETLIBRO | `petlibro` | Replace Desiccant | below 2 days remaining |  |
|  |  | Replace Water Filter | below 2 days remaining |  |
|  |  | Clean Appliance | below 2 days remaining |  |
|  |  | Replace Filter | below 2 days remaining |  |
| EHEIM Digital (aquarium) | `eheimdigital` | Filter Cleaning | below 24 h remaining |  |

## Personal-care devices

| Integration | Domain | Task | Default | Notes |
|---|---|---|---|---|
| Oral-B toothbrush | `oralb` | Replace Brush Head | every 6 h counted by the engine | active: running |
| Oral-B (live BLE) | `oralb_live` | Replace Brush Head | below 2 days remaining |  |
| Philips shaver | `philips_shaver` | Replace Shaver Head | below the household consumable floor (default 10 %) |  |

## Xiaomi ecosystem integrations (MIoT / Xiaomi Home) — multi-category

| Integration | Domain | Task | Default | Notes |
|---|---|---|---|---|
| Xiaomi MIoT | `xiaomi_miot` | Replace Filter | below the household consumable floor (default 10 %) |  |
|  |  | Replace Main Brush | below the household consumable floor (default 10 %) |  |
| Xiaomi Home | `xiaomi_home` | Replace Filter | below the household consumable floor (default 10 %) |  |
|  |  | Replace Main Brush | below the household consumable floor (default 10 %) |  |

---

**197 integrations / 388 verified signatures.**
Missing yours? Suggest it in
[discussion #101](https://github.com/iluebbe/maintenance_supporter/discussions/101).
