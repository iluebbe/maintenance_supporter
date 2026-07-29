# Roadmap

Planned and proposed features for **Maintenance Supporter**. This is a living
document — priorities shift with user feedback (issues and Discussions).
Nothing here is a dated promise; items ship when they're ready and well-tested.
Shipped features are recorded in [CHANGELOG.md](CHANGELOG.md).

Legend: 💡 proposed · 🛠️ in progress · ✅ shipped

---

## Next up (recommended order)

### ✅ Battery Fleet: silent under-reporting (found 2026-07-22) — all four causes fixed

**Correctness before features.** A live audit against a 27-note production
fleet found the fleet reporting **0 batteries to replace** while **11 were
already overdue** (up to 272 days) and **2 more sat below the native low
threshold**. Four independent causes, all in
`helpers/battery_fleet.py::read_batteries` — **B1-B4 all shipped** (2026-07-25
and -26); the detail is kept below because the reasoning is what makes the
regression tests legible.

**One open question, not a bug** (B1's follow-up): a battery that is overdue
only by *forecast* lands in `needs_soon` and does not raise the low-count
sensor, so the fleet task still does not trigger on it. Whether "forecast
overdue" should count as due is a design decision, not a defect.

B1. ✅ **Forecast-only notes are dropped before the forecast can run** (the
   big one) — **shipped 2026-07-25**: the drop check became
   `if not available and not low and last_replaced is None: continue`, so an
   index-card note (no level sensor, state `unknown` forever) survives when
   it carries a replacement date and reaches the overdue/`soon` forecast
   (negative `days_until` sorts overdue forecasts to the top). Regression
   test: `test_forecast_only_note_reaches_the_forecast`. Original finding:
   Battery Notes entries WITHOUT a `source_entity_id` carrying only
   `battery_type` + `battery_last_replaced` were discarded before
   `build_overview()`; in the audited fleet this hid **15 of 27 notes**,
   **11 of them already overdue** (worst case 272 days). Its follow-up
   question is stated once at the top of this section.

B2. ✅ **Two different low thresholds** — **shipped 2026-07-26**: the
   NATIVE_LOW_PERCENT floor (20 %) is OR-ed into the Battery-Notes branch;
   Battery Notes' own battery_low still applies, so a higher configured
   threshold keeps winning. Regression test = audit case (b). Original: Battery-Notes batteries use Battery
   Notes' own threshold (10 % in the audited setup), native ones use
   `NATIVE_LOW_PERCENT = 20`. The same cell counts as low or healthy depending
   on which pass found it — a CR2032 at **11.5 %** and a CR123A at **16.5 %**
   were both reported healthy. Suggested fix: OR the native percentage floor
   into the Battery-Notes branch, or promote the threshold to one configurable
   value used by both passes.

B3. ✅ **`covered_devices` is filled before the drop check** — **shipped
   2026-07-25**: the `covered_sources`/`covered_devices` adds moved BEHIND
   the (B1-adjusted) drop check, so only a KEPT note covers its source and
   device; a dead note no longer shadows a working native level sensor on
   the same device. An EXCLUDED note deliberately still covers (exclusion
   hides the battery — it must not resurrect as a native "Unknown" row).
   Regression tests: `test_dead_note_no_longer_shadows_live_native_sensor`,
   `test_excluded_note_still_covers_its_device`.

B4. ✅ **Rechargeables are treated as replaceable batteries** — **shipped
   2026-07-25 (424b4c6, independently reported as issue #107)**: the native
   pass skips devices that also expose a vacuum/lawn_mower entity, a
   `battery_charging` binary, or are Companion-app devices (`mobile_app`
   identifiers — phones, tablets, Wear-OS watches); an explicit Battery
   Notes note always wins. Plus a manual per-battery exclude
   (`battery_fleet/set_excluded` + eye-off row action + restore chips) for
   everything the heuristics can't know. The audit's alternative "require a
   known battery type" was deliberately NOT taken — it would disable the
   native degraded mode entirely. **Known residual gaps** (manual exclude
   covers them): cars without a `battery_charging` binary, watches/wearables
   paired through non-Companion integrations, other rechargeables (BLE
   trackers, toothbrushes).

**Regression guard:** all three audit cases are covered — (a) forecast-only
note and (c) dead note + live native sensor shipped with B1/B3, and (b) a note
at 11.5 % against a 10 % threshold shipped with B2.

### Next wave (proposed 2026-07)

1. ~~**More voice/Assist intents — grounded task guidance**~~ ✅ **Shipped
   in v2.28.0** — `MaintenanceSupporterTaskInstructions` answers *"how do I
   do the descaling?"* strictly from what is **stored on the task** (notes,
   checklist, linked documents incl. per-task page hint, required spare parts
   with location + live stock, documentation link). **Anti-hallucination by
   design:** with nothing stored it says so and *asks* whether the user wants
   general, non-verified advice — the disclose-and-ask question is the speech
   itself, so LLM pipelines relay it instead of inventing steps (the tool
   description reinforces the contract). Plus `TaskDue` ("when is X due?"),
   `SnoozeTask` and `PartStock` ("how many {part} left?" — with
   reorder-threshold warning). The remaining candidate from this wave,
   postpone-by-voice, shipped in 2.44 together with skip-by-voice.
2. ~~**Integration-aware discovery: verified entity signatures**~~ ✅
   **Shipped in v2.28.0** — a source-verified catalog
   (`helpers/integration_signatures`, method contract: every entry carries a
   reference into the integration's code, enforced by a tripwire) covers
   Roborock / Xiaomi Miio / Dreame vacuums and IPP / Brother printers. The
   new **"Suggested setups"** surface discovers matching devices and adopts
   them with **sensor threshold triggers pre-wired** (unit-aware: below 24 h
   left or below 10 % remaining; auto-resolving on replacement). **Next
   (researched + install-count-verified 2026-07, see
   docs/design/integration-research-2026-07.md):** signature catalog v2 —
   Ecovacs (per-consumable lifespan %, incl. GOAT mowers), Husqvarna
   Automower + Landroid Cloud (blade usage-time counters → new
   `usage_above` direction), kia_uvo (service-distance); a **Robot Lawn
   Mower** template; source dives for Home Connect / LG ThinQ / ViCare
   before cataloging them. BMW is dead (integration removed), Valetudo
   deferred (MQTT-name matching). **Update (v2.29.0):** all of the above
   shipped, plus Xiaomi MIoT/Home, Midea (LAN), Bambu Lab and car odometers
   (Kia/Hyundai, Tesla, Renault) — the catalog stands at 19 integrations /
   48 task-signatures across five trigger directions. The discovery surface
   is labelled **Beta** while the catalog matures.

3. 💡 **Signature catalog: community candidates** — from Discussion #101 and
   the stargazer analysis: ~~Segway Navimow~~ ✅ shipped via the new runtime_hours
   direction (the engine accumulates mowing time on the lawn_mower entity —
   no integration counter needed), **WeBack vacuums**
   (Jezza34000/homeassistant_weback_component — consumable sensors to
   verify), plus the parked dreo / tuya_local / daikin_onecta /
   electrolux_status / Mercedes (mbapi2020) and the core Tesla trio. ~~Miele~~
   ✅ shipped (salt / rinse aid / PowerDisk / TwinDos fill levels — thanks for
   the pointer!). Each entry needs the usual source dive first (method
   contract).

3a. ✅ **CPAP / sleep-therapy template (+ resmed_myair verdict)** — **shipped
   2026-07-26**: `health_cpap` template (new Health category, 7 tasks:
   weekly mask+tub cleaning, monthly cushion + filter, tubing 90 d,
   humidifier tub + headgear/frame 180 d, annual service; 8 new _T sources
   ×17). INTEGRATIONS.md gained a "Reviewed — no usable signals" section
   with the resmed_myair verdict row pointing at the template. Original: CPAP
   machines have real, manufacturer-specified upkeep: mask cushion ~monthly,
   air filter ~monthly, tubing ~3 months, humidifier tub ~6 months,
   headgear + frame ~6 months, annual overall check. Because a CPAP runs
   every night, calendar intervals track usage almost perfectly — the rare
   case where a static template IS the right trigger. Benefits all CPAP
   users (Löwenstein/Philips too, no integration needed).
   `resmed_myair` (1,131 installs; source-dived 2026-07-21) exposes only
   therapy metrics — per-night `totalUsage` gauge (resets nightly, the
   bhyve-class counter trap), `maskPairCount`, AHI/leak/score, no
   consumable or cumulative signal, no live state for engine runtime —
   → **verified, no signature**; record the verdict as an INTEGRATIONS.md
   row pointing at the template.

3b. ✅ **Second research lens: template-worthiness sweep** — **shipped
   2026-07-26**: the lens is now Step 6 of
   docs/design/signature-evaluation-scheme.md (every sweep must ask it).
   First pass: the ENTIRE parked "no wear sensors" list resolved to
   existing templates (jura→Espresso, eufy/dahua→Security Camera,
   indego/zcsmower→Robot Mower, …), and never-walked classes yielded THREE
   new templates (catalog 42→45): Fire Safety Equipment, Aquarium,
   Hearing Aids. Parked as niche: e-scooters, piano tuning, dumb
   dehumidifiers. Original: (method change —
   the CPAP lesson). All 13 signature rounds grep integration SOURCES for
   wear signals (`filter_life`, `*_time_left`, odometers, cycle counts…) —
   so a device CLASS with genuine maintenance needs whose integration
   exposes none can never surface, no matter its install count. Add the
   complementary question to every sweep: *"is this a device class with
   manufacturer-recommended maintenance?"* → feeds the TEMPLATE catalog
   instead of the signature catalog. First pass: re-walk the parked
   "no wear sensors" list (jura, eufy, dahua, indego, zcsmower, garmin,
   bosch_shc, …) plus categories never walked (medical/sleep, aquarium
   beyond eheim, musical instruments, e-scooters, …) under this lens.

3c. 💡 **Scheduled catalog re-visit** — integrations EVOLVE: new sensors
   appear upstream (the SmartThinQ re-audit found adoptable keys months
   after the first pass), install counts shift the priority order, and
   park-reasons expire (a parked integration may have gained the missing
   per-station binary by now). The weekly drift watchdog only guards
   EXISTING signatures against upstream changes — it never discovers new
   capability. Add a periodic (roughly quarterly) re-visit: (a) parked
   list with each park-reason re-checked against current sources, (b)
   top analytics risers not yet catalogued, (c) spot-check of previous
   "no signature" verdicts.

4. ~~**Catalog governance: full re-audit + drift watchdog**~~ ✅ **Shipped
   2026-07-18** — (a) all 22 entries re-audited against the evaluation
   scheme (results in the research doc: everything picks the most direct
   signal per duty; authoritative count 22 integrations / 53 signatures);
   (b) **`signature-drift.yml`** runs WEEKLY (Monday cron + manual
   dispatch): `scripts/check_signature_drift.py` greps per-entry probe
   strings (`scripts/signature_probes.json`, tripwire-synced with
   SIGNATURES) in the referenced upstream sources and auto-files a drift
   issue — never PR-blocking. Runtime side already existed: the
   `missing_trigger_entity` HA Repair covers adopted tasks natively.
   ~~**Follow-up candidate from the re-audit:** one source entity can only
   feed ONE signature today — needs per-duty entity claims.~~ ✅ **Shipped
   2026-07-26** — discovery's entity claim is now per DUTY: a task already
   watching an entity blocks only its own duty (recognised by catalog name
   in any of the 22 languages), so a mower's hours counter still proposes
   "Clean Undercarriage" after "Replace Mower Blades" was adopted, and a
   deselected duty stays adoptable later. A watcher with a custom/renamed
   name conservatively keeps claiming the whole entity — re-discovery never
   re-proposes against a rename. Still open: Miele washer tub-clean via
   status-entity runtime (verify status values first).

5. ~~**Bambu Lab: model-aware 3D-printer maintenance**~~ ✅ **Shipped
   2026-07-18 (post-v2.30)** — via the signature layer, where the model is
   known: CoreXY (X1/P1S/P1P) get carbon-rod cleaning every 100 print-hours,
   A1 bed-slingers a purge-wiper replacement every 300 h, enclosed models the
   chamber filter (300 h), and **AMS units propose desiccant replacement from
   their MEASURED humidity** (new `alert_above` style, >40 %, auto-resolving;
   AMS Lite excluded — no desiccant compartment). The static 3D Printer
   template stays model-neutral. Original idea (kept for reference): study the different
   printer models (A1/A1 mini vs P1P/P1S vs X1C/X1E, AMS vs AMS 2 Pro/AMS HT)
   and Bambu's official maintenance guides, then tune the 3D Printer template
   per model: enclosure models add carbon/HEPA filter replacement, the A1
   series has different rod/rail care, AMS units get desiccant/feeder
   maintenance, and interval defaults should follow the wiki's per-model
   recommendations. Discovery already binds the template to the printer
   device, so the model is known at adoption time.

4. ~~**Seed the counting baseline from the last real service (#102)**~~ ✅
   **Shipped in v2.32.0 (47acbc3)** — every usage_delta duty in the
   suggested-setups dialog offers an optional *"reading at last service"*
   input, and the task dialog exposes an editable start value on delta-mode
   counter triggers (empty = count from the current reading; editing
   re-anchors — the Store-runtime is cleared so the new value takes effect).
   A car at 27,000 km whose last service was at 12,000 km now comes due
   immediately at adoption. The display/restart bugs found alongside #102
   were fixed in e45f47d. Remaining follow-up idea (💡): one-step
   registration of PAST services — pre-fill a backdated history entry
   (date, cost, invoice document) together with the start value.

5. 💡 **Show the value of used parts on completions (#104)** — costs are
   deliberately booked ONCE (part purchases at restock time; the completion
   cost field is for extra expenses like labor), so a completion that only
   consumed stocked parts shows cost 0. Correct for budgets, but the history
   entry could additionally display the *informational* value of the parts
   used (qty × unit price at purchase) without double-counting it into any
   budget total.
5a. ~~**Numeric countdown entities (opt-in)**~~ ✅ **Shipped 2026-07-26** —
   forum ask (riiam, 2026-06-14): "include the remaining days count down …
   rather than OK statuses to use it in bars". Every task now registers a
   **days-until-due countdown sensor** (numeric state in days, negative
   once overdue; unknown for archived/never-scheduled tasks), disabled by
   default like the next-due timestamp twin — enabling it per task in the
   entity registry IS the opt-in, so the extra entity costs nothing for
   30+-task setups. Translated in all 22 languages; EXAMPLES.md carries a
   gauge-card recipe plus the template-sensor fallback for older versions.

6. 💡 **Persisted checklist progress without completing (#73)** — checklist
   ticks currently live only in the completion dialog and are stored on the
   history entry at completion. A "partially done" workflow would persist
   per-item progress on the PENDING task (WS field + panel rendering +
   reset on completion), letting users tick off steps across several days
   before closing the task.

7. ~~**Live schedule preview — "your next three dates" (#83)**~~ ✅ **Shipped in v2.34.0** — implemented exactly as designed below, incl. an engine fix the work surfaced (seasonal window now preserves calendar patterns instead of rolling to the 1st). — while
   editing a task's recurrence, show the next 3 concrete occurrences the
   CURRENT settings produce, updating live as fields change. This is the
   schedule-side twin of the trigger live-hint (v2.25) and would have
   answered #83 ("every 6 months on the 2nd Saturday — possible?") at a
   glance.

   **Engine contract (no drift by construction):** the dates come from the
   REAL engine, never a frontend reimplementation — a new read-only WS
   command (`schedule/preview`: draft schedule + last_performed +
   schedule_time → next N ISO dates) that instantiates
   `Schedule.from_dict` and iterates `next_due()`, simulating on-time
   completion per step (`last_performed`/`last_planned_due` advance,
   `times_performed` increments so finite series terminate correctly).
   Season rolls, business-day rolls, ±offsets and series ends all apply
   automatically because it IS the engine.

   **Display:** an info-accented hint box (same visual language as
   `.trigger-live-hint`) directly under the recurrence fields:

       📅 Nächste Termine
       Sa 10.01.2026 10:00 · Sa 11.07.2026 · Sa 09.01.2027
       (bei pünktlichem Abschluss)

   - Dates as weekday-prefixed chips via the shared date formatter
     (honors `window.__msDateTimePrefs`); `schedule_time` appended when
     the feature is on.
   - The "(assuming on-time completion)" caption appears only for
     completion-anchored tasks — due-anchored grids are exact.
   - Finite series show fewer chips + "series ends" when < N remain;
     manual/trigger-only schedules hide the box entirely.
   - Recomputed via the WS preview, debounced ~300 ms per keystroke;
     the previous result stays visible while the next loads (no flicker).
   - Read-only surfaces later: the task-detail view could show the same
     three dates under "next due" (cheap once the endpoint exists).

### Shipped waves

**Everything below is worked off** — most recently the **2.26/2.27 waves**:
saved views completed across all surfaces, Assist voice intents, the
29-template catalog in 6 curatable groups, HA date-format support. The only
remaining entry is the internal form-generation refactor (item 7,
deliberately deferred). New ideas land here as they come up — suggestions
welcome via issues/Discussions.

1. ~~**Adopt problem sensors as triggered tasks**~~ ✅ **Shipped in v2.24.0** —
   a discovery + opt-in-sync layer over the existing *sensor-trigger → task →
   history → notification* pipeline; opt-in by design, own sensors excluded.
2. ~~**Saved filter views**~~ ✅ **Complete** — MVP shipped in v2.24.0 (shared
   named filter/sort/group combinations on the panel list); label filter,
   **notification routing** (`notify_scope_view_id` — "only notify me about
   view 'Garden'") and **saved views on the Lovelace card** (`view_id` card
   option, AND semantics) shipped in v2.26.0.
3. ~~**Dark-mode & color-blind contrast QA**~~ ✅ **Shipped in v2.24.0** —
   WCAG-contrast pass on status badges/chips + theme-token routing, pinned by a
   real-browser contrast tripwire.
4. ~~**Live "what happens next" hint on sensor-based triggers**~~ ✅ **Shipped
   in v2.25.0** — the trigger form explains itself against the *live* sensor
   ("the sensor reads 660 h now — due at 760 h, +100 h, restarting after each
   completion"); covers threshold/counter/runtime/state-change, 22 languages.
5. ~~**Suggest a spare part when adopting a problem sensor**~~ ✅ **Shipped in
   v2.26.0** — discovery suggests the target object's name-matching part;
   adoption pre-links it as the task's consumed part, closing the
   problem → task → buy-part loop in one step.
6. ~~**Voice/Assist intents**~~ ✅ **Shipped in v2.26.0** — two intents
   (`MaintenanceSupporterListTasks`, `MaintenanceSupporterCompleteTask`):
   LLM-based Assist pipelines pick them up automatically as tools in any
   language; the classic agent used the shipped en/de sentence files, then at
   `assist/custom_sentences/`. (Both moved in 2.44: six languages, shipped
   inside the integration at `assist_sentences/` — the old path no longer
   exists, so it is corrected here rather than left as history.) Completion goes through the real coordinator
   path (history, rotation, parts, completion window).
7. **Form generation from field specs** (🟡, internal) — the long-term
   parity-by-construction step for the two hand-written task/trigger forms
   (~2k-line panel dialog + ~80 config-flow fields). No direct user value, and
   parity is already tripwire-enforced at the values level (`task_fields`) and
   the existence level (`test_parity_task_fields`) — so this deliberately
   stays a standalone refactor for a quiet cycle, not bundled into a feature
   wave.

Smaller candidates — both ✅ **Shipped in v2.26.0**: ~~notes on an adopted
problem-sensor task survive an un-adopt → re-adopt cycle~~ (deleted adopted-task
notes are stashed per sensor and restored on re-adopt) and ~~per-part file
attachments~~ (documents link to spare parts via `part_ids`, mirroring task
links incl. export/import remap and the Replace-object carry-over).

Exploratory, no near-term commitment: voice/Assist task creation, optional
gamification, approval workflow.

---

## Near-term (planned)

### ✅ LLM setup assistant — a skill that configures the integration for you
**Shipped** as a portable skill/playbook in
[`skills/maintenance-setup-assistant/`](skills/maintenance-setup-assistant/)
(SKILL.md + WS-API contract + discovery heuristics + non-smart catalog with
derived-usage-sensor recipes). A guided skill (Claude Code / Assist / an
MCP-style agent) that stands the integration up correctly from a conversation,
instead of the user clicking through the config flow object-by-object. The skill:

1. **Authenticate to Home Assistant** — obtain (or be given) a long-lived
   access token and the base URL; verify it can reach the WS/REST API. Never
   store the token in plain text where it can leak; treat it like a password.
2. **Discover maintenance candidates** — scan the HA device & entity registries
   for things that plausibly need upkeep: pumps, filters, HVAC, printers,
   vehicles (odometer/`device_class: distance`), water softeners, appliances,
   anything exposing a wear-signal sensor (runtime hours, cycle counters,
   pressure/flow, battery/consumable levels). Group by area/device and propose a
   ranked list of objects + suggested tasks with sensible default intervals and
   trigger types (threshold / counter-delta / runtime) inferred from the sensor.
   - **Also propose *non-smart* devices** — common household items that never
     appear in the registry but still need maintenance (range hood filter,
     dishwasher/washing-machine cleaning, smoke-detector batteries, HVAC filter,
     descaling the kettle/coffee machine, gutter cleaning, …). Offer these from a
     curated catalog as time-based tasks. Where a smart signal *can* stand in for
     usage, suggest a **derived usage sensor**: infer run-cycles or on-time from
     a smart-plug's **power draw** (threshold/state-change on wattage) or from a
     **presence/occupancy** signal, so an otherwise "dumb" appliance still gets
     usage-based (counter/runtime) triggers instead of a pure calendar interval.
3. **Match manuals & intervals (opt-in)** — when the user wants it, look up the
   manufacturer/model (from the device registry) to suggest a documentation URL
   or manufacturer-recommended service intervals, and attach them via the
   Documents feature. Strictly opt-in and source-cited; the user confirms before
   anything is fetched or attached.
4. **Create it via the public WS API** — drive `object/create`, `task/create`
   (+ `trigger_config`), and the global settings through the same WS commands
   the panel uses, so everything is validated server-side. Dry-run/preview each
   batch and get a single confirmation before writing.
5. **Verify & hand off** — after setup, sanity-check that entities were created
   and triggers resolve, then summarise what was configured and what needs a
   human decision (intervals it couldn't infer, sensors it wasn't sure about).

Ships as a documented skill/playbook (prompt + the WS command contract +
discovery heuristics) rather than integration code — the backend already
exposes everything it needs (67 WS commands, entity introspection, documents).
Guardrails: confirm before every write, never invent intervals silently, keep
the token handling safe, and prefer proposing over auto-applying.

### ✅ Shared maintenance — multiple assignees + rotation
**Shipped.** Assign a task to several household members (`assignee_pool`) and
rotate responsibility automatically on each completion — round-robin,
least-completed, or random. The "currently responsible" user stays a single
pointer (`responsible_user_id`) so all existing per-user notifications and
badges keep working. Set via the panel task dialog + the options-flow edit
step.

### ✅ Native To-do entity
**Shipped.** A single global `todo.maintenance` list entity aggregates every
active task; item status mirrors due state (due/overdue/triggered →
needs-action, otherwise completed), and checking an item off completes the
task. Appears in the native **To-do** card and is reachable via
**Assist/voice**. Complements — does not replace — the panel and the Lovelace
card. Optional per-assignee lists can pair with rotation later.

### ✅ Multiple reminders per task + overdue escalation
**Shipped.** Configure several lead-time reminders via the
`reminder_lead_days` list (e.g. **14 / 3 / 0** = 14 days, 3 days, and on the
due date) in the panel notification settings; a daily check fires one extra
reminder on each matching day, honouring quiet hours, vacation mode, snooze,
per-user routing, and the daily limit. The overdue repeat cadence has existed
all along via `notify_overdue_interval_hours`.

---

### ✅ Spare parts & consumables inventory
**Shipped** (2.23). Maintenance consumes things — filters, seals, descaler,
softener salt, mower blades. A per-object **parts list** tracks each part's
identifiers (manufacturer, MPN, GTIN/EAN), storage location, product URL,
unit price and current stock with a reorder threshold: completing a task
that consumes parts decrements the stock, dropping to the threshold
auto-creates a one-off **"Buy {part}"** task (self-contained notes, product
or shopping-search link), and completing it restocks — quantity and cost
editable in the dialog. Datasheets/receipts attach through the document
store; per-part stock sensors + a global "parts to reorder" counter feed
automations (edge-triggered low/out/restocked events); the printable work
sheet lists required parts; everything round-trips through export/import.

### ✅ One stock pool for several objects (#111) — shipped 2.44

**Shipped.** A task's `consumes_parts` link may name another object's pool
(`{entry_id, part_id, quantity}`; absent `entry_id` still means the task's own
object, so nothing already stored changed shape). The pool keeps exactly one
owner, which is what makes one buy task, one low state and one stock sensor
fall out with no deduplication anywhere. Deleting the owner **moves** the pool
and its stock to the longest-standing borrower, repoints every other link and
raises a repair issue naming what went where; only genuinely borrowed parts
move. An unresolvable link is surfaced instead of silently deducting nothing.
Replacing a borrower keeps its link; import keeps one whose object exists here.

The reasoning below is kept because it is why the design looks like this.

Not an oversight — a documented trade-off. `docs/design/spare-parts.md:118`
already records it: *parts are per-object by design (entry-data locality,
export simplicity)*, with the uuid part ids left as the migration path "if that
ever matters". This is the request that says it matters.

**Do NOT make stock itself multi-object.** Stock rows live in a per-entry Store
(`storage.py:184`), and on every setup `prune_part_orphans`
(`storage.py:213`, called from `__init__.py:1178`) **deletes any stock row
whose part id is not in that entry's own `data["parts"]`**. A pooled stock row
parked on a borrowing entry would be silently eaten on the next restart — and
the Store has no version/migration mechanism at all (`STORE_VERSION` has never
been bumped; drift is handled defensively in `_sanitize_loaded`). That single
path rules out the obvious designs.

**The cheap shape that works: keep one owner, let only the LINK cross.**
The pool stays a normal part on one object — a "Vacuum consumables" shelf, or
simply the first vacuum. What becomes cross-entry is the task's reference:
`consumes_parts` grows from `[{part_id, quantity}]` to
`[{entry_id?, part_id, quantity}]`, defaulting to the task's own object.

Most of what looks hard then solves itself, because the pool still has exactly
one owner:
- the buy-task reconciler is entry-local (`parts_runtime.py:202`), so one owner
  means **one** "Buy …" task by construction — no dedup needed;
- `is_low` and the reorder threshold are evaluated once, on the owner;
- `PartStockSensor`'s unique_id embeds the object slug (`sensor.py:624`), so one
  owner means one sensor rather than N reading the same pool;
- `PartsToReorderSensor` (`sensor.py:680`) and the voice `_part_snapshot`
  (`intent.py:564`) already scan every entry — with one owner they count the
  pool once instead of N times;
- `prune_part_orphans` stays happy: the part really is in its owner's data.

What genuinely has to change, and nothing beyond it:
- `sanitize_consumes_parts` (`helpers/parts.py:221`) validates ids against the
  owning object's set — it must resolve the referenced entry instead of
  dropping foreign ids, and refuse a link to an entry that no longer exists.
- `async_handle_completion_parts` (`parts_runtime.py:119`) reads parts and
  Store from the completing task's entry — it must resolve the target entry
  per link, and keep the immediate (non-debounced) save it already relies on.
- The task dialog's part picker (`task-dialog.ts:724`) loads only its own
  object's parts, and the panel resolves ids against `obj.parts`
  (`maintenance-panel.ts:3161`) — an unresolved id currently renders empty, so
  a cross-object link needs the name to come from somewhere.
- Export/import remaps part ids **per object** (`websocket/io.py:432`), and
  `object/replace` regenerates them (`websocket/objects.py:869`) — a
  cross-entry link has to survive both, as task↔part links already do.
- Archive of the owner: `parts_runtime.py:230` zeroes an archived object's
  parts to silence its buy tasks. Borrowers must not silently inherit that
  zero — an archived pool is unavailable, which is not the same as empty.
- The stock events (`EVENT_PART_STOCK_LOW/OUT/RESTOCKED`, `const.py:495`)
  carry one owning `object_id` — fine, but automations written against them
  should be told the pool's owner is the one that fires.

**Deleting the owner is the hard question, and it has a good answer.**
As designed above the link would dangle, and today's consume path skips a part
it cannot resolve (`parts_runtime.py:158`: `if part is None: continue`) — so
the task would complete and quietly decrement nothing. That is the one outcome
this must not have.

The codebase already handles exactly this shape, in exactly the right place:
- `async_remove_entry` (`__init__.py:1511`) is the single choke point that
  fires for **all three** delete paths — the panel's WS delete, HA's own
  *Configure → Delete* UI and the service. Its own comments say why that
  matters: the Configure-UI path bypasses `ws_delete_object`, so a warning
  dialog in the panel can never be enough on its own.
- **Documents are the precedent for a shared thing outliving its owner**: the
  same hook removes an object's documents refcount-aware, and a blob another
  object still uses survives.
- **`object/replace` already transfers a pool**: it carries parts to another
  object with fresh ids, copies their stock and remaps the task links
  (`websocket/objects.py:866-956`).

So the answer is to **transfer rather than orphan**. In `async_remove_entry`,
before `store.async_remove()` throws the stock away: if any other entry's tasks
link to this object's parts, move those parts and their stock to one of the
borrowers, rewrite the borrowers' links, and raise a repair issue naming what
moved where ("the dust-bag pool now lives on Vacuum 2 — move it if you would
rather"). Nothing is lost, no link is ever left dangling, and the user is told
rather than left to discover it.

Pick the destination deterministically (the oldest borrowing entry) so the
outcome does not depend on dict order; the repair issue exists precisely
because that pick is arbitrary and the user may want a different one.

Belt-and-braces regardless of the transfer: the consume path must stop
treating an unresolvable link as "nothing to do". A link that cannot be
resolved should record the completion and surface the problem, never pass
silently — the same reasoning behind refusing a completion that is missing its
required details.

**Precedent worth copying.** Battery Fleet already runs one pool for many
consumers, and notably does it *above* the part model rather than inside it: a
dedicated owning object, deterministic part ids (`batt_aa`), a global
`find_fleet_entry` lookup, and an external aggregator calling
`async_change_part_stock(hass, fleet_entry, pid, delta=-qty)`
(`helpers/battery_fleet_setup.py:209`). It also leaves `auto_buy_task` **off**
on purpose so the pool cannot spawn competing buy tasks — the aggregate task's
detail is the shopping surface instead.

**Available today, and worth documenting either way**: make one object own the
shared consumables and put the buy-task there, as the battery fleet does. What
it does not give you is the automatic decrement when each appliance's own task
is completed — which is precisely what this request is about.

Reported as niche by its author; probably not — identical appliances sharing a
consumable is the same pattern Battery Fleet exists for.

### ✅ Documents linked to tasks
**Shipped** (v2.23.1). A document can belong to a specific task, not just the
object: each task row carries a **paperclip badge** with its document count,
the object view is ordered *Tasks → Documents → Parts*, and the task-detail
page lets you link/unlink the object's documents. The link **survives a
backup/restore** — task ids are remapped onto the fresh ids on import, exactly
like the spare-part links.

### ✅ Complete, portable backup — selective export + documents archive
**Shipped** (v2.23.1). The JSON/YAML/CSV export can be **limited to selected
objects** (to move a single asset between installs), and a dedicated
**documents archive** (a ZIP of the content-addressed file blobs + a manifest)
downloads/restores the file *contents* the settings export omits — matching
objects by id then by name for a cross-instance move, idempotent on repeat.
Together they make a complete, portable backup.

---

## Next (under consideration)

### ✅ Replace an object (successor flow)
**Shipped** in v2.20.0. When an appliance dies and is replaced, deleting
the object loses its history and rename+reset mixes two machines' records.
**Replace…** (object detail header / `object/replace` WS) retires the old
object in place — archived with a `replaced_by` marker, history and costs
stay browsable — and creates the successor pre-filled from it: task
configuration and documents carried over (blobs refcounted, not copied),
counters fresh, installation date today, serial number and warranty cleared.
Identified via the device-biography journey review
(docs/design/user-journeys.md, N1).

### ✅ Object pause / seasonal mode
**Shipped** in v2.20.0. Seasonal equipment (pool, lawn mower, AC) is out of
service for months — vacation mode is global and archive retires entirely;
neither fits "paused until spring". **Pause** (object detail header /
`object/pause` WS, optional auto-resume date) freezes the object's schedules:
tasks read a new `paused` status, triggers tear down, nothing notifies, the
calendar and To-do list skip them — but the object stays visible with its
history. Resume (manual or automatic on the set date) re-anchors recurring
tasks to a fresh cycle, exactly like unarchive. Identified via the
device-biography journey review (docs/design/user-journeys.md, N3).


### ✅ End-of-month scheduling (last day / last business day / ±N offset)
**Shipped** in v2.18.0 (requested in
[Discussion #83](https://github.com/iluebbe/maintenance_supporter/discussions/83)).
The day-of-month schedule gained **last day of the month** and **business days
only** (roll back over the weekend — Workday-aware when HA's Workday
integration is configured), and every calendar pattern accepts a **±N-day
offset**. "Two days before the last working day of the month" is three
clicks: last day ✓, business days ✓, offset −2.

### ✅ Finite recurring series (repeat N times / recur until a date)
**Shipped** in v2.22.0 on every surface. A recurring task can stop on its own:
"descale weekly, 8 times, done" or "quarterly checks until the warranty ends".
`schedule.ends = {count?, until?}` — either or both; when the series ends the
task stops re-arming and reads as *done*, like a completed one-off. Editable in
the panel task dialog (the **Ends** selector: never / after N times / on date)
and the config-flow edit form; round-trips through JSON/YAML export/import.
Distinct from the one-off type and from the seasonal-pause `until` (which only
auto-resumes, never ends the series).

### ✅ Seasonal active window (only due in certain months)
**Shipped** in v2.22.0 on every surface. A *declarative* month window on the
schedule: "only due April–October" — a computed due date outside
`schedule.season_months` rolls forward to the start of the next active month,
so the task never sits "overdue" through the off-season. Natural for mower
service, pool care, or pre-winter heating checks. Editable via the month picker
in the panel task dialog and the config-flow edit form; round-trips through
export/import. Complements — and is independent of — the soft **seasonal
factors** and the manual **object pause**.

### ✅ Postpone a single occurrence (defer to a date, without completing)
**Shipped** in v2.22.0. "Not this week — push this one to next Tuesday": the
**Postpone…** action in the task ⋮-menu moves **only the current due date**
(a one-shot `due_override` via WS `task/postpone`), not the schedule anchor;
the next completion consumes it and the cadence returns to normal. A
*postponed to …* badge shows on the task, and dashboard card rows carry a
small calendar-clock indicator. Distinct from **snooze** (notifications only)
and **reset to a date** (re-anchors the whole recurrence). Round-trips through
export/import.

### ✅ "Meter reading" task type
**Shipped** (enum value in 2.18; the reading-specific fields in v2.20.0). From [Discussion #83](https://github.com/iluebbe/maintenance_supporter/discussions/83).
Reading-type tasks now carry a per-task **unit** ("kWh", "m³", …) editable in
the task dialog and both config-flow forms, and the completion dialog gains a
**Reading value** field: the recorded value lands on the history entry and
the timeline shows each reading with its **delta vs the previous reading**
(+123.5 kWh). Also on the `complete` service and WS command
(`reading_value`); unit round-trips through JSON/CSV export/import.

### ✅ Priority levels
**Shipped.** An explicit priority per task (low / normal / high) to sharpen
triage when many tasks are due at once — a priority badge in the panel, carried
through create/update on every surface (WS, 3 config-flow forms, task dialog),
and persisted only when non-default.

### ✅ "Missed" status + completion window
**Shipped.** Skipping an overdue task records it as **Missed** (a distinct
history type) rather than a deliberate skip — clearer history + compliance
views. A per-task `earliest_completion_days` optionally restricts premature
completion (the annual inspection can't be signed off three weeks early); the
complete/quick-complete WS paths + the To-do list honour it.

### ✅ Task work sheet — a printable one-pager per task
**Shipped** in v2.21.0. Print what you need at the machine, not a whole
manual: *Work sheet* in the task ⋮-menu opens a print-ready one-pager with
object + task details, the checklist as tick boxes, the notes, and a **QR
code pair** (open the task / complete it) so the paper links back to the
panel. When the task has a linked PDF manual with a page hint
(`task_pages`), the sheet links a server-cut **manual excerpt** — the new
`document/{id}/excerpt` endpoint (pypdf) extracts "from page X, N pages" of
the stored PDF for printing alongside.

### ✅ Saved filter views (profiles) — MVP shipped (v2.24.0)
Every panel filter used to be transient. A **named, saved view** (status /
user / archived + **label** + sort + group-by) is now reusable across the panel
task list via a **Views** dropdown, shared across everyone who opens the panel
and stored on the global entry. **Notification routing shipped (v2.26.0):**
`notify_scope_view_id` restricts all reminders to tasks matching one view's
label/user filters ("only notify me about tasks in view 'Garden'").
**Card application shipped (v2.26.0):** the `view_id` card option applies a
view's status/user/label filters on top of the card's own config.
Later: broaden the captured filters further (areas / objects).

### ✅ Adopt problem sensors as triggered tasks — shipped (v2.24.0)
Many integrations expose `binary_sensor` entities with
`device_class: problem` (printer errors, filter warnings, battery alerts).
An **Adopt problem sensors** button now mirrors selected problem sensors as
sensor-based tasks: the task triggers while the problem is active and resolves
when it clears — putting one-off appliance complaints into the same inbox,
history and notification pipeline as planned maintenance. Opt-in by design
(discovery only proposes; the integration's own per-task sensors are excluded).

### ✅ Cross-cutting labels / tags
**Shipped** (v2.17). Lightweight comma-separated tags per task (e.g. `safety`,
`seasonal`) that cut across objects, areas, and groups — shown as chips,
searchable in the command palette, filterable, and round-tripped through
export/import. Orthogonal to the existing hierarchical grouping.

### ✅ Warranty-expiry reminders
**Shipped** (opt-in). A daily check reminds once when an object's stored
`warranty_expiry` is exactly N days out (default 30, configurable 1–365 in the
panel settings). Routes through the notification manager (quiet hours, bundling,
dual service/entity send). Distinct from a recurring task's due date — it's a
one-off date on the object, not a schedule.

---

## ✅ Usability & design wave (2026-07) — worked off

Smaller, high-frequency wins first; each ships independently.

### Quick wins
- ✅ **Explainer & onboarding GIFs** — **first set shipped 2026-07-26** via
  `e2e/gifs-demo.mjs` (create-from-template, complete-task,
  calendar-object-filter; measured-trim recording against ha-shots,
  ffmpeg-static conversion; embedded in README + FEATURES → In action).
  Remaining flows (suggested setups, battery fleet, QR quick-complete) +
  dark-mode theming stay open. Original idea: short (10–20 s, looping) screen
  recordings of the key flows, embedded in the README and the matching
  FEATURES.md sections, so a prospective user SEES the integration work
  before installing. Candidate flows: first-run → template gallery → object
  created; complete-with-photo; Suggested setups adopting a device with a
  pre-wired trigger; Battery Fleet (shopping list → mark all replaced); QR
  quick-complete from a phone; calendar + object filter. Build them
  REPRODUCIBLY like the docs screenshots: a committed script on the ha-shots
  instance (Playwright records video → ffmpeg/gifski to GIF, English
  dark-mode, faketime-pinned dates), so every release can refresh them
  cheaply instead of hand-recording. Keep each GIF small (≤ ~2–3 MB, panel
  cropped); host in-repo under `docs/images/gifs/`. Later idea: surface the
  same GIFs in-app — the first-run empty state could offer a "20-second
  tour" instead of text only.
- ⏸️ **Object photos as avatars** — the documents feature already stores images;
  pick one as the object's thumbnail in cards and the objects table. **On hold**
  (2026-07): unsure it reads/looks well at avatar size — revisit with a design
  mockup before building.
- ✅ **Duplicate task / object** (v2.14.0) — clone an existing task or a whole
  object with its tasks as a starting point.
- ✅ **Undo toast instead of confirm dialogs** (v2.14.0) — low-risk actions
  (complete, skip, archive) execute immediately with a few seconds of "Undo".
- ✅ **Snooze in the panel** — a "Snooze" item in the task more-menu routes to
  the existing NotificationManager snooze (suppresses reminders for
  `snooze_duration_hours`), via a new `task/snooze` WS command.
- ✅ **Bulk actions** (v2.15.0) — Select mode with checkboxes + bulk bar to
  complete/archive many tasks at once.

### Bigger building blocks
- ✅ **First-run onboarding + template gallery** (v2.15.0) — a "From template"
  button + first-run empty-state nudge opens the 13 templates by category.
- ✅ **"Today / this week" view** (v2.15.0) — mobile-first focus list (Overdue /
  Due today / This week) with one-tap complete.
- ✅ **Command palette (Ctrl+K)** (v2.15.0) — global fuzzy search across objects
  and tasks with keyboard nav.
- ✅ **Weekly digest notification** (v2.15.0, opt-in) — Monday-morning summary
  through the notification manager.
- ✅ **Printable maintenance report (PDF)** (v2.15.0) — per-object asset data,
  task table, costs; opens in a new tab to print / "Save as PDF".

### Design system
- ✅ **Dark-mode & color-blind audit** — status badges carry a shape icon and the
  chart danger zone uses a diagonal hatch (v2.15.0). Status colours route through
  HA theme tokens. **Contrast QA done (v2.24.0):** the light-background badges
  (Due Soon / OK / Archived) wore white text below the 3:1 WCAG UI floor — now
  dark text (7.6–9.7:1); the Triggered badge became a `--deep-orange-color` token
  so it follows themes. A real-browser **contrast tripwire** (computed-style
  test) now blocks any badge from dropping below 3:1 — the "tripwire" this line
  used to claim existed but didn't. Live-verified in dark + light on ha-shots.
- ✅ **Task-detail information architecture** (v2.15.0) — Weibull/seasonal
  analysis cards are collapsible with per-section remembered state.
- ✅ **Panel performance as a feature** — code-splitting (strategy chunks),
  `content-visibility: auto` on object cards / history timeline / Today list,
  and (new) a **genuinely virtualized dashboard task table**: above 120 rows
  only the scroll window is in the DOM (spacers keep the scrollbar honest), and
  a hidden sizer row pins the content-sized badge column so the shared subgrid
  tracks can't jitter while scrolling. Verified live with ~300 tasks: 36 DOM
  rows, byte-identical column widths at top/middle/end.

## Maintainability (internal, scheduled before the feature wave)

Refactorings that keep the codebase healthy as it grows — no user-visible
changes, but they gate how cheap the features above are to build.

### Regression-class guards (proposed 2026-07, from a 854-commit history audit)

A retrospective over all 180 `fix:` commits found the recurring regression
classes. The largest by user impact: **field round-trip / surface closure**
(~30 commits, 6 user-filed issues: #42 #50 #58 #88 #103 #106) — a persisted
field exists, but one of the read→edit→write surfaces (WS summary, dialog
hydration, dialog save, options flow, service, import/export) doesn't carry
it, so the next save silently drops or resets it. i18n gaps (the #2 class)
were closed 2026-07 with the value gates + `add_locale_key.py`. These guards
target what's left:

1. ✅ **Contract-fixture round-trip test** — **shipped 2026-07-26** exactly as
   designed below (tests/test_task_contract_fixture.py + the frontend
   task-contract-roundtrip closure test + TASK_UPDATE_FIELD_MAP inventory
   tripwire; regenerate via MS_REGEN_CONTRACT=1). Original: (kills the #42/#50/#58/#88/#103/#106
   class structurally). A backend test builds a MAXIMAL task (every storage
   field populated), emits the real `_build_task_summary` output as a
   committed JSON fixture; a frontend test hydrates the task dialog from
   exactly that fixture, saves, and deep-diffs the update payload against it.
   Plus a field-inventory tripwire: any key in `ws_update_task`'s `field_map`
   / `normalize_task_storage` that is missing from the fixture fails with
   "new field X not covered by the round-trip". A new field can then never
   re-open the class, and the two sides cannot drift apart unnoticed — the
   exact hole #106 slipped through (the old round-trip test fed idealized
   payloads, not the real summary shape).
2. ✅ **Stale-bundle version handshake** — **shipped 2026-07-26**: esbuild
   stamps the manifest version into every bundle (helpers/bundle-version.ts),
   the panel compares it against the new read-tier `version` WS command once
   per lifetime and renders a dismiss-free reload banner on mismatch (18
   languages; dev builds never flag). Original: (kills the invisible-stale-cache
   confusion of the #106 follow-up and the #86 family). esbuild stamps the
   manifest version into the bundles; the panel compares it against the
   backend version at load and shows a discreet "new version on the server —
   refresh" banner on mismatch. Turns an undiagnosable client state into a
   visible one-click fix (HA's service worker refreshes stale-while-
   revalidate, so "I cleared the cache" is routinely not enough).
3. ✅ **Committed overflow sweep** — **shipped 2026-07-26** as
   `e2e/live-overflow-sweep.mjs` (4 surfaces × {412, 768}px × de/uk/hi/en,
   fails on any element past the viewport). Paid for itself on its FIRST
   run: the Ukrainian tab bar overflowed 412px phones on every surface
   (fixed via tighter narrow tab padding — the earlier 18-language sweep
   had only measured the task-detail view). Original: (presses the
   ~18-commit responsive class). The 2026-07 ad-hoc sweep as a permanent
   pre-release e2e: main surfaces (list, task detail, dialogs, settings) ×
   {412px, 768px} × the longest-label languages (de/uk/hi), asserting
   `scrollWidth ≤ clientWidth` and no element past the viewport edge. Runs
   against the Docker instance before releases (validate-in-Docker rule),
   like the docs-shots — English-only visual checks provably hide
   i18n-length overflow (the ⋮-menu bug shipped invisible in EN at 412px).
4. ✅ **`scripts/preflight.sh`** — **shipped 2026-07-26**: ruff (pinned) →
   tsc → mypy (warning-only: the container's HA lags CI's pht-cc-latest, so
   identical mypy versions still disagree; CI authoritative) → esbuild →
   web-test-runner → full pytest with a calibrated coverage policy (<97.5 %
   fails; 97.5–98 % warns — CI runs the holidays-gated tests the container
   skips, measured local baseline 97.54 % vs CI green;
   PREFLIGHT_SKIP_PYTEST=1 for quick loops). Original: one
   command bundling the exact CI gates — ruff, mypy --strict (CI arguments),
   the pytest suite, tsc --noEmit, esbuild, web-test-runner — to run before
   any push instead of rediscovering each command per session.

- ✅ **Extract per-type trigger evaluators** — done: the coordinator's
  `_evaluate_trigger_fallback` dispatches to pure `evaluate_threshold/counter/
  state_change/runtime` functions in `helpers/trigger_fallback.py`, each unit-
  tested in `test_trigger_fallback.py`.
- ✅ **Move `_trigger_state` out of `trigger_config`** (v2.13.0) — dynamic trigger
  runtime now lives in the per-entry Store, reconstructed into `trigger_config`
  only at read.
- ✅ **Modularize the panel** — cohesive render clusters live in `renderers/`
  free-function modules: progress bars, history sub-view, and (new) the entire
  **task-detail cluster** (`renderers/task-detail.ts` — header/actions, tab
  bar, overview tab with KPI/meta/analysis cards, history tab) behind a
  `TaskDetailContext` of ~20 panel-owned callbacks. Dialog ownership stays
  panel-side by design, so the module renders into the panel's shadow root and
  never touches a dialog itself. The panel shrank ~2.9k → ~2.5k lines.
- 🟡 **Panel ↔ config-flow parity by construction** — the *global settings*
  surface derives from one `helpers/settings_registry` source, and the
  task-field **values** now derive from one `helpers/task_fields` source
  (priority/anchor/rotation enums + warning/earliest/interval ranges consumed
  by both WS schemas, the sanitizer, and every config-flow selector; tripwires
  pin the TS dialog and fail the build on re-hardcoded literals). Field
  *existence* in both UIs is enforced by `test_parity_task_fields`. Remaining:
  the two task/trigger *forms* are still hand-written — full form generation
  from field specs is the long-term step.
- ✅ **Parallelize the test suite** (pytest-xdist) — CI runs
  `pytest -n auto --dist loadfile`; per-test blob isolation
  (`_isolate_document_blobs` conftest fixture) keeps the parallel run
  deterministic.

---

### ✅ A second user action showed stale state for up to ten seconds (found 2026-07-28, fixed)

Postpone a task that has a responsible user and the panel keeps showing it
**overdue for ~15 seconds**. The data is correct throughout — `due_override`
is stored immediately — but the coordinator's computed `_next_due` /
`_status`, which every surface reads, lag behind. A user who postpones and
sees no change will reasonably postpone again.

Reproduced on a live instance, deterministic, and **not** voice-specific: the
plain `task/postpone` WS command the panel itself uses shows it.

```
no assignee   -> next_due=2026-09-15 override=2026-09-15   (immediate)
with assignee -> next_due=2020-01-31 override=2026-09-15   (still overdue)
              -> converges at ~15 s, or instantly after any other task edit
```

**Cause, measured rather than guessed.** The suspicion above was right in
direction and wrong in scale: `async_request_refresh()` is debounced, and Home
Assistant's default window is **ten seconds**
(`REQUEST_REFRESH_DEFAULT_COOLDOWN`), not the fraction of a second the first
write assumed. Tracing the coordinator showed the second request returning
without a recompute at all — the first action had opened the window and the
second was coalesced into its end.

**So it was never about assigning, or about postponing.** Any two user actions
on one object inside ten seconds hit it: two completions, an edit then a skip,
and every bulk action beyond its first item.

**Fixed** by giving user actions `async_refresh_now()` — an immediate
recompute of that one object, which is cheap — while the trigger path keeps
`async_request_refresh()`, since a counter entity changing many times a minute
is exactly what the window is for. A source scan fails any new user-facing
mutation that reaches for the debounced call
(`tests/test_refresh_after_user_action.py`).

## Voice, second pass — and voice with a screen (A + B + C8 shipped 2.44; C9 + D open)

Maintenance is one of the few domains where voice is not a gimmick: the moment
you need the information is the moment your hands are dirty, gloved, or holding
the filter. The six intents shipped in v2.26–v2.28 proved the plumbing. What
they still do not know is **who is asking** and **which room they are standing
in** — the two facts that turn a generic answer into the right one.

Home Assistant already hands both to every intent handler
(`Intent.context.user_id`, `Intent.device_id`, `Intent.satellite_id`,
`Intent.assistant`, verified against core 2026.7). `intent.py` reads none of
them today — only `language`. That is the whole opportunity in one sentence.

### A. Close the gaps in what already ships

1. ~~**The sentence files never reach a HACS install.**~~ ✅ **Fixed in 2.44** —
   they lived outside `custom_components/`, so the `zip_release` archive never
   carried them and the classic Assist agent matched none of our intents (LLM
   pipelines were unaffected, which is why nobody noticed). They now ship
   inside the integration, and the opt-in `install_assist_sentences` setting
   copies them into `config/custom_sentences/<lang>/` and reloads the
   conversation agent. Every installed file carries a checksum of its own
   content, so a file the user edited is never overwritten or deleted.
2. ~~**Nothing checks the sentence YAML against the intents.**~~ ✅ **Fixed in
   2.44** — `test_assist_sentences.py` compares the `INTENT_*` constants
   against the keys in every shipped language file, in both directions, so a
   new intent without sentences now fails instead of shipping mute.
3. ~~**Postpone (and skip) by voice**~~ ✅ **Shipped in 2.44** — the standing
   candidate from the 2.28 wave. `PostponeTaskIntent` takes days or an
   explicit date and defers only the current occurrence; on an already-overdue
   task the days count from today, so "by three days" cannot land in the past.
   No duration means it asks rather than guesses. `SkipTaskIntent` moves to the
   next cycle without recording work and names the new due date.
4. ~~**Spoken responses cover en/de; the UI covers 22 languages.**~~ ✅
   **Shipped in 2.44**, and the split it forced is the lasting part: **what the
   assistant SAYS is text and now exists in all 22**, moved out of `intent.py`
   into `assist_sentences/responses/<lang>.json` (loaded once in the executor,
   English fallback per key); **what it UNDERSTANDS is grammar** and ships only
   for languages whose every phrasing was probed against a live agent — en, de,
   fr, es, it, nl. A placeholder cannot carry the case ending, particle or
   article a language demands of the name inserted into it, so the translations
   restructure around it (Finnish apposition, Hungarian cataphoric colon,
   Turkish head noun, Korean batchim-free particles, Hindi `को` forcing default
   agreement). Adding a language is now one JSON file, with parity gates on
   keys, placeholders and formatting.
   It also exposed a defect in the original: **"1 days overdue"**, shipped in en
   AND de since the first voice release. Slavic case government made it
   impossible to ignore; a single day now has its own wording everywhere.

### B. Teach the intents who and where (the high-value half)

5. ~~**"What do I need to do?"**~~ ✅ **Shipped in 2.44** as the `scope: mine`
   slot on `ListTasks`: resolves `Intent.context.user_id` and answers with that
   person's tasks, following the current rotation duty. An unknown speaker is
   told so rather than handed the whole house's list — a plausible-sounding
   wrong answer is worse than none.
6. ~~**"What needs doing in here?"**~~ ✅ **Shipped in 2.44** as `scope: here`,
   resolving `Intent.satellite_id` (the entity's own area first, then its
   device's) and falling back to `Intent.device_id`. A device with no area says
   so instead of widening.
7. ~~**Disambiguate by room instead of giving up.**~~ ✅ **Shipped in 2.44** —
   two candidates in different rooms resolve to the one in the asking room; two
   in the SAME room still read back rather than guess. Correctness, not
   convenience: voice completion writes real history, so a misheard name is a
   real wrong entry.

### C. Make the spoken answer displayable (framework-agnostic)

8. ~~**`filter_area` on the card.**~~ ✅ **Shipped in 2.44** as `filter_areas`,
   with a picker in the visual editor offering only areas that actually hold an
   object.
9. **A binding primitive.** So that any display layer can react to a spoken
   maintenance question, an intent should leave behind what it just answered —
   subject, area, matched tasks, and the satellite that asked. Deliberately
   not a View-Assist API: the same primitive serves browser_mod, a plain wall
   dashboard, or an automation.

### D. View Assist — a recipe, never a dependency

[View Assist](https://dinki.github.io/View-Assist/) turns tablets and ESPHome
satellites into voice devices *with a screen* — exactly the missing half of a
maintenance answer, because you want the checklist shown, not read aloud. It
is two HACS-default repositories: the `view_assist` integration (~1.2k
installs) and a companion Android app with its own `vaca` integration
(~1.3k). It moved from YAML packages to a real integration in 2025.4 and
re-architected again in 2025.11, so anything written against it should be
pinned to a version.

The display primitive already exists on their side, and the surfaces relevant
to us are:

- `view_assist.navigate(device, path, revert_timeout)` — put a dashboard path
  on a specific satellite, auto-reverting after N seconds (default 20).
  Crucially, `path` is **not** restricted to their own views: at least one
  third-party integration already uses it to show its own dashboard.
- `view_assist.add_status_item` / `toggle_menu` — an ambient status bar, whose
  item DSL supports `entity:…`, `view:<name>|<icon>` and `action:script.x|icon`.
- `view_assist.set_state` — an open-schema entity service
  (`{str: cv.match_all}`): any key/value becomes an attribute on the
  satellite's VA sensor.
- `view_assist.load_asset(asset_class: dashboard|views|blueprints, name,
  download_from_repo)` — their asset installer.
- `view_assist.broadcast_event`, plus timers (`set_timer` with class
  Alarm|Timer|Reminder|Command, `snooze_timer`, `cancel_timer`) firing
  `va_timer_<action>` events.
- Jinja globals `view_assist_entity(<device_id>)` and `view_assist_entities(…)`
  — the canonical way a blueprint turns the triggering device into the VA
  sensor it should act on.

What follows:

10. **Nothing needs to be built into our integration for the basic case.** A
    Lovelace view holding our card plus one `view_assist.navigate` call is
    already a maintenance screen, and `navigate` accepts our own path. The gap
    is on *our* side, and it is items 6 and 8: an intent that knows which room
    asked, and a card that can be pointed at that room.
11. **Ship a blueprint, and only later a view.** The blueprint hears the
    maintenance sentence, gets the spoken answer from our intent, and calls
    `view_assist.navigate` on the satellite that heard it — resolved with
    `view_assist_entity(trigger.device_id)` on their side, or with
    `Intent.satellite_id` on ours, which is what keeps the answer on the
    tablet that was actually spoken to instead of every tablet in the house.
    Blueprints install through HA's own blueprint store under our namespace;
    they do not need View Assist at all.
12. **An ambient badge is the cheapest native-feeling touch.**
    `view_assist.add_status_item` can carry *"2 overdue"* in every satellite's
    status bar, driven by the `sensor.maintenance_supporter_overdue` we already
    publish — and the `view:` item form makes that badge a launcher into the
    maintenance screen rather than a dead label. No new backend at all.
13. **Do not duplicate their timers.** `view_assist.set_timer` covers ad-hoc
    spoken alarms; ours are schedule-driven and survive restarts. The
    complement worth having runs the other way: a task step with a duration
    (*"descale for 20 minutes"*) setting a View Assist timer on the satellite
    in that room.
14. **If we ever ship a VA-native view, the working pattern is known.**
    `load_asset` downloads only from *their* repository, so a third party
    cannot publish a view for it to fetch. The proven route (already done by
    at least one other integration) is: write the view YAML into
    `config/view_assist/views/<name>/`, then call `load_asset` with
    `download_from_repo: false`, guarded by `hass.services.has_service`, with
    `after_dependencies: ["view_assist"]` in the manifest. Their community
    gallery is *not* a viable channel: the asset manager explicitly skips the
    community directory, so those views are manual copy-paste. This is the
    heaviest option here and should stay last — a plain dashboard path plus
    `navigate` gets most of the value for none of the coupling.

### What this deliberately does not become

- **A hard dependency on any display project.** No import of `view_assist`,
  no soft-fail branches in our code. The integration stays fully useful with a
  phone and no satellite; everything in D is automation-level and lives in
  docs.
- **A promise of 22 spoken languages.** Sentence patterns are per-language
  work with real upkeep. Ship what can be maintained, and say which languages
  those are.
- **Anything pinned to an unstable surface.** View Assist has re-architected
  twice with breaking changes (2025.4, 2025.11) and its own docs still
  document three services that no longer exist. A blueprint and a dashboard
  path age gracefully across that; code that reaches into their internals does
  not.

---

## Exploratory (longer-term ideas)

- **Voice / Assist task creation** — create a task by natural language through
  HA Assist ("add maintenance: replace HVAC filter every 3 months").
- **Optional gamification** — per-user completion streaks / points for shared
  households, off by default.
- **Approval workflow** — manager sign-off on completions for operator /
  commercial setups (dovetails with operator mode).
- ✅ **Photo attachments** — **Shipped.** Attach a photo when completing a task;
  stored via the DocumentStore (deduped, backup-safe) and shown as a thumbnail
  in the history timeline.

---

Have an idea or want to vote on one of these? Open an issue with the
`enhancement` label, or join the
[Ideas discussions](https://github.com/iluebbe/maintenance_supporter/discussions).
