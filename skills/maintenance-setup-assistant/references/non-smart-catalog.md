# Non-smart maintenance catalog + derived-usage recipes

Most household maintenance never shows up in a device registry. Offer these
common items as **time-based tasks** the user can accept or skip. Where a smart
signal *can* stand in for usage, upgrade the task with a **derived-usage sensor**
(next section) so a "dumb" appliance still gets a usage-based trigger.

Confidence on every interval below is **rule-of-thumb** — present them that way
and invite the user to adjust for their household. Safety items first.

## Curated catalog

| Object / area | Task | Typical interval | Notes |
|---|---|---|---|
| Smoke / CO detectors | Test alarm | 1 month | Safety. `custom_icon: mdi:smoke-detector` |
| Smoke / CO detectors | Replace battery | 12 months | Replace whole unit ~10 years |
| Fire extinguisher | Check pressure gauge | 12 months | Service per local rules |
| HVAC / furnace | Replace air filter | 1–3 months | Shorter with pets/allergies |
| Range hood | Clean/replace grease filter | 1–3 months | Metal filters: dishwasher-clean |
| Dishwasher | Clean filter + run cleaner | 1 month | Descale by water hardness |
| Washing machine | Clean drum / run maintenance wash | 1 month | Leave door ajar between uses |
| Tumble dryer | Clean lint filter | every use | Clean vent duct 12 months (fire risk) |
| Refrigerator | Clean condenser coils | 6 months | Vacuum dust; improves efficiency |
| Refrigerator/freezer | Replace water filter | 6 months | If plumbed |
| Kettle / coffee machine | Descale | 1–3 months | By water hardness + use |
| Shower heads / taps | Descale / clean aerators | 3 months | Hard-water areas |
| Water softener | Refill salt | 1–2 months | Check level; regen usually auto |
| Vacuum cleaner | Empty/clean, wash filter | 1–3 months | Replace bags as needed |
| Robot vacuum | Replace brushes/filter | 2–6 months | Often has cycle sensors → `counter` |
| Gutters | Clean | 6 months | Spring + autumn (`nth_weekday`/seasonal) |
| Boiler / heating | Annual service | 12 months | Often a legal/insurance requirement |
| Chimney / flue | Sweep | 12 months | Per local regulation |
| Windows/doors | Lubricate hinges, check seals | 12 months | |
| Garden mower / power tools | Blade sharpen, oil change | seasonal | `nth_weekday` in spring |
| Car (non-connected) | Oil, tyres, brakes, inspection | see book | Manufacturer interval — Phase 3 lookup |
| Bicycle / e-bike | Chain, brakes, tyre pressure | 1–3 months | e-bike battery care |
| Mattress | Rotate/flip | 3–6 months | |
| Aquarium / pond | Water change, filter clean | 1–4 weeks | |
| Houseplants | Fertilize | seasonal | Low stakes, offer opt-in |

Adapt to what the user actually owns — ask a couple of clarifying questions
(pets? hard water? which appliances?) rather than dumping the whole list.

## Derived-usage sensors — turn "dumb" into usage-based

A pure calendar task doesn't know if the appliance was used twice or fifty times.
When a **smart plug** or **presence sensor** can observe usage, derive a signal
and point a Maintenance Supporter trigger at it. Two levels:

### A. Smart-plug power draw → cycle count or run-time (preferred)
The user plugs the appliance into a smart plug that reports power (W) or energy
(kWh). Then either:

1. **Run-time trigger (simplest).** Create an HA **Threshold** helper
   (Settings → Devices & Services → Helpers → *Threshold*) on the plug's power
   sensor, e.g. "on when power > 10 W". That yields a `binary_sensor` that's
   `on` while the appliance runs. Point a **`runtime`** trigger at it:
   ```json
   {"type":"runtime","entity_ids":["binary_sensor.washer_running"],
    "trigger_runtime_hours":50}
   ```
   Good for: things that wear by hours of operation (pumps, fans, motors).

2. **Cycle count via state changes.** The same threshold `binary_sensor` flips
   `off → on` once per cycle. Use a **`state_change`** trigger counting
   transitions:
   ```json
   {"type":"state_change","entity_ids":["binary_sensor.dishwasher_running"],
    "trigger_from_state":"off","trigger_to_state":"on","trigger_target_changes":30}
   ```
   → "clean the dishwasher every 30 cycles". Good for: dishwasher/washer
   maintenance wash, robot-vac brush replacement, coffee-machine descale.

3. **Cumulative energy → counter.** If the plug exposes a rising kWh sensor,
   a **`counter`** (absolute or delta) fires at an energy target — a rough
   proxy for total work done. Delta mode is best for an ever-rising meter.

Pick the recipe that matches how the thing wears: **hours → runtime**,
**cycles → state_change**, **total work → counter**.

### B. Presence / occupancy → usage (coarse fallback)
When there's no plug but a room has an occupancy/presence sensor, on-time in that
room loosely tracks usage of a fixed appliance there (home gym treadmill, sauna,
workshop tool). Use a `runtime` trigger on the presence `binary_sensor`. Call
out that this is **approximate** — presence ≠ the appliance actually running —
and prefer a smart plug when accuracy matters.

### Guidance when proposing a derived sensor
- The **HA Threshold helper is a one-time manual step** the *user* does in the
  HA UI (you can't create helpers over this API). Give exact click-path and the
  wattage cutoff to use, then wait for them to confirm the new `binary_sensor`
  exists before you create the trigger against it.
- Always offer the plain **time-based** version too, in case they don't want the
  extra hardware/helper. Usage-based is an upgrade, not a requirement.
- A non-existent trigger entity is only a **warning** at create time — so verify
  the helper's `entity_id` in Phase 5 and fix it if the trigger didn't resolve.
