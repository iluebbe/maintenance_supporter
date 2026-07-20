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

(QNAP, despite the family resemblance to Synology, ships no binary
sensors at all — its disk data is plain sensors, covered by the
catalog entry above.)

If a device reports a maintenance condition as a problem-class
binary sensor, it does not need a catalog entry here — the adoption
dialog picks it up automatically, whether or not it appears in this
table.

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
| Xiaomi Miio | `xiaomi_miio` | Replace Main Brush | below 24 h remaining |  |
|  |  | Replace Side Brush | below 24 h remaining |  |
|  |  | Replace Filter | below 24 h remaining |  |
|  |  | Clean Sensors | below 24 h remaining |  |
| Dreame Vacuum | `dreame_vacuum` | Replace Main Brush | below 10 % remaining |  |
|  |  | Replace Side Brush | below 10 % remaining |  |
|  |  | Replace Filter | below 10 % remaining |  |
|  |  | Clean Sensors | below 10 % remaining |  |
| Ecovacs | `ecovacs` | Replace Main Brush | below 10 % remaining |  |
|  |  | Replace Side Brush | below 10 % remaining |  |
|  |  | Replace Filter | below 10 % remaining |  |
|  |  | Replace Dust Bag | below 10 % remaining |  |
|  |  | Replace Mop Pads | below 10 % remaining |  |
|  |  | Replace Blades | below 10 % remaining |  |
| WeBack Vacuum | `weback_vacuum` | Filter Cleaning | every 15 h counted by the engine | vacuum entity; active: cleaning |
|  |  | Clean Main Brush | every 30 h counted by the engine | vacuum entity; active: cleaning |
| iRobot Roomba | `roomba` | Filter Cleaning | every 15 h counted by the engine | vacuum entity; active: cleaning |
|  |  | Clean Main Brush | every 30 h counted by the engine | vacuum entity; active: cleaning |
|  |  | Empty Dustbin | while the appliance reports 'on' | binary_sensor entity |
| Neato Botvac | `neato` | Filter Cleaning | every 15 h counted by the engine | vacuum entity; active: cleaning |
|  |  | Clean Main Brush | every 30 h counted by the engine | vacuum entity; active: cleaning |
| ROMY Vacuum | `romy` | Filter Cleaning | every 15 h counted by the engine | vacuum entity; active: cleaning |
|  |  | Clean Main Brush | every 30 h counted by the engine | vacuum entity; active: cleaning |
| Tuya vacuum | `tuya` | Filter Cleaning | every 15 h counted by the engine | vacuum entity; active: cleaning |
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

## Robot lawn mowers

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
| Husqvarna Automower BLE | `husqvarna_automower_ble` | Replace Blades | every 100 h counted by the engine | lawn_mower entity; active: mowing |
|  |  | Clean Undercarriage | every 25 h counted by the engine | lawn_mower entity; active: mowing |
| Rain Bird irrigation | `rainbird` | Clean Sprinkler Heads | every 30 h counted by the engine | switch entity; active: on |
| Pentair ScreenLogic | `screenlogic` | Refill Pool Salt | below 2700 |  |
| Ondilo ICO | `ondilo_ico` | Refill Pool Salt | below 2700 |  |

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

## EV chargers — cable/plug inspection by delivered energy

| Integration | Domain | Task | Default | Notes |
|---|---|---|---|---|
| Easee Wallbox | `easee` | Inspect Cable and Plug | every 5000 units (counter delta) |  |
| KEBA Wallbox | `keba` | Inspect Cable and Plug | every 5000 units (counter delta) |  |
| go-e Charger | `goecharger_api2` | Inspect Cable and Plug | every 5000 units (counter delta) |  |
| OpenEVSE | `openevse` | Inspect Cable and Plug | every 5000 units (counter delta) |  |

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
| BWT Perla | `bwt_perla` | Refill Softener Salt | below 10 % remaining |  |
|  |  | Refill Softener Salt | below 7 days remaining |  |
| EcoWater softener | `ecowater_softener` | Refill Softener Salt | below 10 % remaining |  |
|  |  | Refill Softener Salt | below 7 days remaining |  |
| Wolf SmartSet | `wolflink` | Refill Heating Water | below 1 |  |
| Palazzetti pellet stove | `palazzetti` | Empty Ash Pan | every 100 units (counter delta) |  |
| Vaillant (myVAILLANT) | `mypyllant` | Refill Heating Water | below 1 |  |
| Grohe Blue | `grohe_smarthome` | Replace Water Filter | below 10 % remaining |  |
|  |  | Replace CO2 Bottle | below 10 % remaining |  |
| iQua softener | `iqua_softener` | Refill Softener Salt | below 10 % remaining |  |
| Fumis (pellet stoves) | `fumis` | Annual Service | below 24 h remaining |  |
| Rehlko / Kohler generators | `rehlko` | Oil Service | at 100 h counted by the device |  |
| AquaCell softener | `aquacell` | Refill Softener Salt | below 10 % remaining |  |

## Air treatment — purifiers, ACs and HRV/ventilation filters

| Integration | Domain | Task | Default | Notes |
|---|---|---|---|---|
| Dyson | `hass_dyson` | Replace Filter | below 10 % remaining |  |
| Dreo | `dreo` | Replace Filter | below 10 % remaining |  |
| VeSync (Levoit) | `vesync` | Replace Filter | below 10 % remaining |  |
| Daikin AC | `daikin` | Filter Cleaning | every 100 h counted by the engine | climate entity; attribute `hvac_action`; active: cooling/heating/fan/drying |
| Gree AC | `gree` | Filter Cleaning | every 100 h counted by the engine | climate entity; attribute `hvac_action`; active: cooling/heating/fan/drying |
| Zehnder ComfoAirQ | `comfoconnect` | Replace Ventilation Filter | below 7 days remaining |  |
| Renson Endura Delta | `renson` | Replace Ventilation Filter | below 7 days remaining |  |
| Philips AirPurifier (CoAP) | `philips_airpurifier_coap` | Filter Cleaning | below 10 % remaining |  |
|  |  | Filter Cleaning | below 3 days remaining |  |
|  |  | Replace Filter | below 10 % remaining |  |
|  |  | Replace Filter | below 3 days remaining |  |
|  |  | Replace Wick | below 10 % remaining |  |
|  |  | Replace Wick | below 3 days remaining |  |
| IKEA DIRIGERA (STARKVIND) | `dirigera_platform` | Replace Filter | at 4320 h counted by the device |  |
| Blueair | `ha_blueair` | Replace Filter | below 10 % remaining |  |
|  |  | Replace Wick | below 10 % remaining |  |
|  |  | Replace Water Refresher | below 10 % remaining |  |
| Coway IoCare | `coway` | Filter Cleaning | below 10 % remaining |  |
|  |  | Replace Filter | below 10 % remaining |  |
| Winix | `winix` | Replace Filter | below 10 % remaining |  |
| Duco ventilation | `duco` | Replace Ventilation Filter | below 7 days remaining |  |
| Flexit Nordic | `flexit_bacnet` | Replace Ventilation Filter | at 4380 h counted by the device |  |
| IKEA Trådfri (STARKVIND) | `tradfri` | Replace Filter | below 3 days remaining |  |
| Dyson (local) | `dyson_local` | Replace Filter | below 10 % remaining |  |
|  |  | Replace Filter | below 3 days remaining |  |
| Venstar thermostat | `venstar` | Replace Filter | at 300 h counted by the device |  |

## Kitchen & household appliances incl. espresso machines

| Integration | Domain | Task | Default | Notes |
|---|---|---|---|---|
| LG ThinQ | `lg_thinq` | Replace Filter | below 10 % remaining |  |
|  |  | Replace Filter | below 24 h remaining |  |
|  |  | Replace Water Filter | below 10 % remaining |  |
| LG ThinQ (SmartThinQ) | `smartthinq_sensors` | Replace Filter | below 10 % remaining |  |
|  |  | Replace Water Filter | below 10 % remaining |  |
|  |  | Clean Tub | at 30 h counted by the device |  |
|  |  | Refill Rinse Aid | while the appliance reports 'on' | binary_sensor entity |
|  |  | Refill Salt | while the appliance reports 'on' | binary_sensor entity |
| Home Connect | `home_connect` | Refill Salt | while the appliance reports 'present' |  |
|  |  | Refill Rinse Aid | while the appliance reports 'present' |  |
|  |  | Descale Appliance | while the appliance reports 'present' |  |
|  |  | Clean Appliance | while the appliance reports 'present' |  |
|  |  | Clean Grease Filter | while the appliance reports 'present' |  |
| Miele | `miele` | Refill Salt | below 10 % remaining |  |
|  |  | Refill Rinse Aid | below 10 % remaining |  |
|  |  | Refill Detergent | below 10 % remaining |  |
|  |  | Clean Tub | every 60 h counted by the engine | active: in_use; device-type gated |
| Electrolux / AEG | `electrolux_status` | Replace Filter | below 10 % remaining |  |
| Midea (LAN) | `midea_ac_lan` | Replace Water Filter | below 10 % remaining |  |
|  |  | Replace Filter | below 10 % remaining |  |
| La Marzocco | `lamarzocco` | Backflush Espresso Group | every 100 units (counter delta) |  |
|  |  | Replace Water Filter | every 1000 units (counter delta) |  |
| Haier hOn (Haier/Candy/Hoover) | `hon` | Replace Filter | below 10 % remaining |  |
|  |  | Filter Cleaning | below 10 % remaining |  |
|  |  | Clean Tub | every 30 units (counter delta) |  |
| Whirlpool | `whirlpool` | Clean Tub | every 60 h counted by the engine | active: running_maincycle |
| WashData (smart-plug cycles) | `ha_washdata` | Clean Tub | every 30 units (counter delta) |  |
| Traeger grill | `traeger` | Clean Grease Trap | every 5 units (counter delta) |  |
|  |  | Clean Appliance | every 20 units (counter delta) |  |

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
| IPP printer | `ipp` | Replace Ink or Toner | below 10 % remaining |  |
| Brother printer | `brother` | Replace Toner | below 10 % remaining |  |
|  |  | Replace Drum Unit | below 10 % remaining |  |
|  |  | Replace Belt Unit | below 10 % remaining |  |
|  |  | Replace Fuser | below 10 % remaining |  |

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

## Pet tech — feeders, fountains, litter boxes

| Integration | Domain | Task | Default | Notes |
|---|---|---|---|---|
| PetKit | `petkit` | Replace Desiccant | below 2 days remaining |  |
|  |  | Replace Water Filter | below 10 % remaining |  |
| Litter-Robot | `litterrobot` | Empty Waste Drawer | above 90 |  |
|  |  | Refill Litter | below 10 % remaining |  |
|  |  | Wash Litter Box | every 150 units (counter delta) |  |
| EHEIM Digital (aquarium) | `eheimdigital` | Filter Cleaning | below 24 h remaining |  |

## Personal-care devices

| Integration | Domain | Task | Default | Notes |
|---|---|---|---|---|
| Oral-B toothbrush | `oralb` | Replace Brush Head | every 6 h counted by the engine | active: running |

## Xiaomi ecosystem integrations (MIoT / Xiaomi Home) — multi-category

| Integration | Domain | Task | Default | Notes |
|---|---|---|---|---|
| Xiaomi MIoT | `xiaomi_miot` | Replace Filter | below 10 % remaining |  |
|  |  | Replace Main Brush | below 10 % remaining |  |
| Xiaomi Home | `xiaomi_home` | Replace Filter | below 10 % remaining |  |
|  |  | Replace Main Brush | below 10 % remaining |  |

---

**121 integrations / 225 verified signatures.**
Missing yours? Suggest it in
[discussion #101](https://github.com/iluebbe/maintenance_supporter/discussions/101).
