# Signature evaluation scheme — from direct to derived triggers

How to evaluate an integration for the suggested-setups signature catalog
(`helpers/integration_signatures.py`). The scheme is a **ladder**: check the
direct signals first, then the derived ones, and only after walking ALL rungs
is a negative verdict allowed. It exists because two early verdicts were wrong
in exactly this way — "lifetime counter, no reset → unusable" (missed the
delta-baseline counter) and "Navimow has no maintenance sensors" (missed both
the `lawn_mower` platform and the engine's own runtime accumulation).

## Step 0 — Inventory (before judging anything)

1. **List every entity platform** of the integration — `sensor.py` alone is
   not an inventory. Mowers carry `lawn_mower.py`, vacuums `vacuum.py`,
   appliances `binary_sensor.py`/`switch.py`. A state entity is signature
   material even when no sensor is.
2. **Establish how the match string derives**: `translation_key` from the
   entity description (preferred, rename-immune), else the entity_id suffix
   (key/name-slug), else a structural pattern (xiaomi_home's `_<key>_p_`
   infix). Quote the deriving code in the `source` field.
3. **Record the audit trail**: `verified` = date @ repo/branch head read.
   Both fields are tripwire-enforced.

## Step 1 — Direct signals (the integration reports the maintenance quantity)

| Signal shape | Direction | Trigger wired |
|---|---|---|
| Percent remaining (filter %, toner %) | `percent_left` | threshold below 10 %, auto-resolve on replacement |
| Countdown (hours/days left) | `duration_left` | threshold below 24 h (unit-converted), auto-resolve |
| Wear counter **with a device reset** (blade hours, tub-clean cycles) | `usage_above` | **delta counter from explicit 0 baseline** — absolute at adoption; manual completion re-baselines (no instant re-fire); device reset auto-completes |
| Actionable event/enum state (`present`/`off`) | `event_present` | state latch, auto-resolve when the appliance clears it |

Notes:
- A plain `trigger_above` threshold is **wrong** for wear counters — after a
  manual completion the counter still reads past the mark and would re-fire
  immediately. Always the delta-baseline form.
- Events beat counters when both exist for the same duty (Home Connect
  descale events vs. its coffee counters): the event is the appliance's own
  calibrated signal, and two rows for one duty is a duplicate.

## Step 2 — Derived from a raw quantity (integration reports usage, not duty)

| Signal shape | Direction | Trigger wired |
|---|---|---|
| **Lifetime counter, no reset anywhere** (print hours, burner hours, odometer) | `usage_delta` | counter in delta mode — fires every N canonical units (hours / km, unit-converted incl. mi) since the last completion; completion re-baselines; no auto-complete (the counter never recovers) |
| Value in an **attribute** rather than the state | any numeric direction + `attribute` in the trigger config | supported by every numeric trigger; no catalog case yet — judge whether the attribute tracks *device wear* (usable) or *consumable stock on a swappable part* (noisy — Bambu tray `remain` resets on every spool swap → skipped) |

"TOTAL_INCREASING with no reset" is a **reason to use `usage_delta`**, never a
reason to decline. Semantics check first: a counter of *performed maintenance*
(Miele's descaling counter) is not a usage quantity — skip those.

## Step 3 — Engine-derived (integration reports only a STATE)

The engine can measure usage itself; no integration counter is required.

| Signal shape | Direction | Trigger wired |
|---|---|---|
| Time spent in a state (`mowing`, `cleaning`, `on`) | `runtime_hours` | runtime trigger with `trigger_on_states` — the engine accumulates hours (persisted 5-min, restart-safe, paused while unavailable); fires at N hours; completion resets the count |
| Number of duty cycles (mows, washes) | *(no catalog direction yet)* | `state_change` with `trigger_target_changes: N` — available manually in the task dialog; add a catalog direction when a case prefers counts over hours |

Catalog mechanics for state targets: set `entity_domain` (+ `on_states`);
empty `keys` means "the device's single entity of that domain" and is
tripwire-restricted to non-sensor domains. Hours from the engine need **no
unit conversion** (`trigger_runtime_hours` is always hours).

## Step 4 — Negative verdict (last resort)

Allowed only after Steps 0–3, and the write-up must name what was checked:
every entity platform, and why neither a direct, derived, nor engine-derived
signal fits. Record it in the research doc with date + ref so it can be
re-checked when upstream grows entities. Devices with `device_class: problem`
binaries need no signature — problem-sensor adoption covers them generically.

## Device-type gates

Two optional per-signature gates restrict a match to the right appliance when
the entity key alone can't:
- **`require_sibling_keys`** — the device must ALSO carry an entity matching
  one of these keys. Identifies the appliance type from its own entity set:
  Miele's `status` sensor is identical across all appliance types, but only
  washers carry `twin_dos_*`/`spin_speed` (washer-gated in core's `types=`),
  so the tub-clean signature fires only there. Watched/adopted siblings still
  count as type evidence — only the match *target* must be unwatched.
- **`models`** — case-insensitive substring match against the device
  registry's `model`. Bambu sets model to the printer type (X1C/P1S/A1…), so
  the chamber-filter duty gates to enclosed models and an open-frame A1 next
  to an X1C gets only the lubrication task.
When neither gate can express the distinction (no identifying sibling, no
model string), the signature must NOT ship — mis-proposing on the wrong
appliance type is worse than a missing proposal.

## Cross-cutting rules

- **One duty, one task**: when the same physical part is exposed in several
  shapes (Xiaomi filter as % + days + used-hours; Miele PowerDisk + TwinDos),
  catalog ONE signal per duty. Preference: percent > countdown > device
  counter > engine runtime (most direct wins).
- **Unit-aware matching**: `percent_left` claims `%` entities; duration/counter
  claim non-`%`; `event_present`/`runtime_hours` require unit-less. This is
  what disambiguates LG ThinQ's shared `filter_lifetime` key.
- **Walk the manual-complete path** for every trigger shape: what happens if
  the user completes the task without touching the device? It must not
  re-fire instantly and must not double-record.
- **Thresholds are defaults, not promises**: 10 % / 24 h / 100 h / 15,000 km
  are adoption-time defaults; users tune them on the task afterwards.
- Method contract stays: nothing enters the catalog without reading the
  integration's actual source (`source` + `verified` fields, i18n ×17 for
  task names — all tripwire-enforced in `tests/test_integration_setups.py`).

## Catalog governance — extensibility, freshness, upstream changes

### Architecture: catalogs are data with machine-checked invariants
Both catalogs are plain in-repo data structures — `SIGNATURES`
(dict of `IntegrationSignature`) and `TEMPLATES` (list of `ObjectTemplate`) —
with their invariants enforced by tripwire tests rather than convention:
direction whitelist, non-empty `source`/`verified`, full ×17 localization of
every task name, empty-keys-only-for-non-sensor-domains, template curation
count pins. **Adding an entry is one dict/list literal plus i18n**; nothing
else in the pipeline changes, because discovery, trigger building and the
dialog are all driven off the data. That is the extensibility contract:
new integrations and templates must never require touching the engine.

### Freshness control (Aktualitätskontrolle)
Two catalog classes age differently:
- **Templates** have no upstream dependency — their freshness is editorial
  (interval defaults, model guidance). Review is periodic and
  discussion-driven; entries that cite external guidance (Bambu wiki) carry
  the date in the note.
- **Signatures** depend on upstream entity naming and CAN silently rot when
  an integration renames a translation_key or entity. Today's guard is the
  `verified` field ("date @ repo/branch head") — an audit trail, not a
  monitor.

### Shipped: automated drift check in GitHub Actions (weekly)
`/.github/workflows/signature-drift.yml` — **weekly** cron (Mondays 06:00
UTC) + manual dispatch, so drift is caught before it piles up:
1. `scripts/check_signature_drift.py` (stdlib-only) reads
   `scripts/signature_probes.json`: per integration the raw upstream URL(s)
   the entry was verified against and literal probe strings that must still
   appear there. Probes are chosen per entry to survive code style (LG probes
   the UPPERCASE enum members because the lowercase values are StrEnum
   `auto()`; xiaomi_home probes the entity-id builder because its keys come
   from device specs, not the repo).
2. A missing string (or unreachable source) = **drift** → the workflow files
   or updates a "Signature drift" issue with the log; the job summary lists
   every probe result. Never a PR-blocking check — upstream churn must not
   block our merges; the scheduled job is the watchdog, the PR gate stays
   about OUR code.
3. A tripwire test (`test_every_signature_has_a_drift_probe`) keeps the probe
   file in exact sync with `SIGNATURES` — a new catalog entry without a probe
   fails CI (the test skips in the dev container, which doesn't mount
   `scripts/`; the full CI checkout enforces it).

### Runtime layer: HA-native Repairs (already shipped)
Drift has a second, user-local detection layer that predates the catalog:
the coordinator raises the fixable **`missing_trigger_entity` Repair issue**
when a task's watched entity has been missing from the state machine past a
startup grace period and a refresh threshold (plus `stale_action_entity` for
on-complete action targets). So if an upstream change ever does remove a
registered entity, affected users see a native HA Repair naming the task,
object and entity — while the weekly Action catches the catalog side before
new discoveries silently dry up. Two layers, two audiences: Repairs for the
user's adopted tasks, the Action for the catalog maintainer.

### Handling upstream changes when they happen
- **Runtime is already graceful, twice over**: (1) if upstream renames a key,
  discovery simply stops proposing that entry — no crash, no wrong wiring.
  (2) **Already-adopted tasks are immune**: they watch concrete entity_ids,
  and HA's entity registry keeps entity_ids stable across integration
  updates — an upstream rename of the description key does not rename
  registered entities. Drift therefore only degrades NEW discovery.
- **Repair process** (drift issue → fix): re-dive the integration per this
  scheme (the rename may also have changed unit or shape), update the keys,
  bump `verified`, note it in the CHANGELOG if the entry was
  user-visible-broken. If upstream *removed* the signal, move the entry to
  the research doc's negative list with the date — the audit trail is the
  point.
- **Full re-audit**: whenever the scheme itself gains a rung (as it just did
  with `usage_delta` and `runtime_hours`), all existing entries are walked
  again — tracked as a ROADMAP item, results recorded per entry in the
  research doc.

## Step 6 — the template-worthiness lens (added 2026-07-26, roadmap 3b)

Every research sweep MUST also ask the complementary question the signature
greps can never answer:

> **Is this a device CLASS with manufacturer- or guideline-specified
> maintenance, regardless of what its integration exposes?**

A class with real upkeep but no wear signals (the CPAP lesson: resmed_myair
ships only therapy metrics) never surfaces through source greps — it feeds
the **template catalog** instead. Checklist per candidate class:

1. Does a manufacturer/guideline interval exist (manual, DIN, community
   consensus)? No interval → no template.
2. Does calendar time track real usage acceptably (daily/nightly-use
   devices: yes; sporadic-use devices: weaker)?
3. Is an EXISTING template already covering the class? (2026-07-26 first
   pass: the entire parked "no wear sensors" list resolved to existing
   templates — jura→Espresso Machine, eufy/dahua→Security Camera,
   indego/zcsmower→Robot Lawn Mower, bhyve/opensprinkler→Lawn Irrigation,
   astrandb-miele→appliance templates, bosch_shc→Smoke & CO Detectors.)
4. Meaningful audience? (fire extinguishers/first-aid: universal;
   aquarium: large hobby; hearing aids: huge demographic; piano tuning:
   parked as niche.)

Record the verdict either as a new template (+ full _T translations) or as
a "covered by template X" note here; integrations reviewed with NO usable
signals additionally get a row in INTEGRATIONS.md → "Reviewed — no usable
signals".
