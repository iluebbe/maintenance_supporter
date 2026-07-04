# Discovery heuristics — finding maintenance candidates

How to turn a Home Assistant instance into a ranked list of maintenance objects
and tasks. All discovery is **read-only**. You propose; the user decides.

## What to read (core HA WS commands)

- `config/area_registry/list` → areas → object grouping + `area_id`.
- `config/device_registry/list` → devices: `name`, `manufacturer`, `model`,
  `area_id`, `identifiers`. A device is the natural unit for a maintenance object.
- `config/entity_registry/list` → entities: `entity_id`, `device_id`,
  `original_device_class`, `disabled_by`. Skip `disabled_by != null`.
- `get_states` → live state: `state`, `attributes.unit_of_measurement`,
  `attributes.device_class`, `attributes.friendly_name`, and wear attributes
  (e.g. `attributes.hours`, `filter_life`, `battery_level`).

Join entities → device → area to describe each candidate in human terms.

## Signal → trigger mapping

Rank each candidate by how directly its signal maps to wear. Prefer a **sensor
trigger** when a usable signal exists; fall back to a **time interval** otherwise.

### Strong candidates (clear wear signal)

| Detected | Example entities | Propose | Trigger |
|---|---|---|---|
| Odometer / distance meter | `sensor.*`, `device_class: distance`, unit km/mi, monotonically rising | Vehicle service (oil, brakes, tyres) | `counter` **delta** (`trigger_delta_mode:true`), `trigger_target_value` = service km |
| Runtime / operating-hours | `sensor.*_hours`, `device_class: duration`, unit h | Pump/compressor/generator service | `counter` absolute, or track the on/off entity with `runtime` |
| On/off actuator that runs | `switch.*`, `binary_sensor.* device_class: running/power`, fan/pump | Wear by run-time | `runtime` `trigger_runtime_hours` |
| Pressure / flow | `sensor.*`, `device_class: pressure`, unit bar/psi; water flow | Check/refill/clean when out of band | `threshold` `trigger_above`/`trigger_below` |
| Filter / consumable life | `sensor.*_filter_life`, `%` remaining, cycle counters | Replace filter / consumable | `threshold` `trigger_below` (%), or `counter` (cycles) |
| Battery level | `device_class: battery`, `%` | Replace battery | `threshold` `trigger_below` (e.g. 20) |
| Cleaning/self-clean cycles | robot vac, dishwasher, washer states | Clean/descale after N cycles | `state_change` `trigger_target_changes`, or `counter` |
| Water hardness / TDS | `sensor.*`, ppm/°dH | Regenerate softener / replace cartridge | `threshold` `trigger_above` |
| Air quality / dust | `device_class: pm25`, VOC | Clean/replace HVAC or purifier filter | `threshold` `trigger_above` |

### Compound cases
When two conditions together define "needs service" (e.g. pump *and* it ran a
lot *and* pressure dropped), propose a `compound` trigger with `compound_logic`
and ≥2 `conditions`. Keep it to what the user confirms — don't over-engineer.

## Default intervals — propose, never assert

You may propose a default interval, but **always label its confidence**:
- **manufacturer** — only when you actually looked it up (Phase 3, cited).
- **rule-of-thumb** — a widely-accepted common figure (below).
- **guess** — you're unsure; the user must confirm or edit.

Common rules-of-thumb (state them as such, invite correction):
- HVAC / furnace filter: every 1–3 months (usage/pets dependent).
- Smoke/CO detector: test monthly, battery yearly, replace unit ~10 years.
- Water softener salt: check monthly; regeneration is usually automatic.
- Car: oil ~10–15k km or 12 months; check the service book (manufacturer).
- Water filter cartridge: 2–6 months by throughput/hardness.

If you can't justify a number, say "interval unknown — please set one" and leave
the user to fill it. Do not silently pick a value.

## Grouping & naming

- One **object per physical thing** (a device, a vehicle, an appliance). Name it
  the way the user would (`"Family Car"`, `"Kitchen range hood"`), not the raw
  entity id. Names must be unique after slugification.
- Attach the object's `manufacturer`/`model`/`serial_number` from the device
  registry when available — it powers the Phase 3 manual lookup later.
- Put the **wear-mapped tasks** on that object. Add a safety **calendar interval**
  alongside a sensor trigger when age matters even without usage (e.g. brake
  fluid ages regardless of km).

## Ranking the proposal

Sort candidates so the user sees the most valuable first:
1. Devices with a **direct wear signal** (odometer, runtime, filter-life).
2. Devices with an **indirect signal** (on/off runtime, power draw).
3. **Non-smart** high-value items from the catalog (safety first: detectors).
4. Speculative items (low confidence) — clearly flagged, easy to drop.

Present as an editable table: `object | task | trigger/interval | source |
confidence`. Then move to Phase 4 (dry-run) only on the user's go-ahead.
