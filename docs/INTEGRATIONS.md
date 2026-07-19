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
That covers, among many others:

- **Synology / QNAP disk health** — SMART/bad-sector alerts are
  `safety`-class binaries,
- **SmartTub spa reminders** (filter, water care),
- **Sensibo** filter-clean alerts, **Bambu Lab** HMS errors,
- smoke-detector faults, leak sensors, tamper alarms.

If a device reports a maintenance condition as a problem-class
binary sensor, it does not need a catalog entry here — the adoption
dialog picks it up automatically.

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
| SmartThings vacuum | `smartthings` | Filter Cleaning | every 15 h counted by the engine | vacuum entity; active: cleaning |
|  |  | Clean Main Brush | every 30 h counted by the engine | vacuum entity; active: cleaning |
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

## Kitchen & household appliances incl. espresso machines

| Integration | Domain | Task | Default | Notes |
|---|---|---|---|---|
| LG ThinQ | `lg_thinq` | Replace Filter | below 10 % remaining |  |
|  |  | Replace Filter | below 24 h remaining |  |
|  |  | Replace Water Filter | below 10 % remaining |  |
| LG ThinQ (SmartThinQ) | `smartthinq_sensors` | Replace Filter | below 10 % remaining |  |
|  |  | Replace Water Filter | below 10 % remaining |  |
|  |  | Clean Tub | at 30 h counted by the device |  |
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

**92 integrations / 172 verified signatures.**
Missing yours? Suggest it in
[discussion #101](https://github.com/iluebbe/maintenance_supporter/discussions/101).
