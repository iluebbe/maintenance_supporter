# Design: Spare Parts & Consumables Inventory

Status: **shipped** (2.23). This documents the agreed design and the reasoning
behind the non-obvious choices.

## Goal

Maintenance consumes things (filters, seals, descaler, softener salt). A
per-object parts list closes the loop: *task due → part already on the shelf →
completion consumes it → stock drops → a buy reminder creates itself →
completing the purchase restocks.*

## Data model

- **Static definitions** in `entry.data["parts"][part_id]` (like `tasks`):
  name, `vendor`, `mpn`, `gtin`, `storage_location`, `product_url`, `notes`,
  `unit`, `cost`, `reorder_threshold`, `restock_quantity`, `auto_buy_task`,
  `doc_id`.
- **Mutable stock** in the per-entry Store (`parts.<part_id>.stock`) — it
  changes on every consuming completion, exactly the `last_performed` class of
  dynamic state. `stock` is **optional**: a part without it is a catalog-only
  entry (identifiers + links), which keeps the entry barrier low.
- **Task→part link on the task**: `task.consumes_parts = [{part_id, quantity}]`
  — completion-centric (the completion handler is task-side), the reverse view
  is derived. One storage location, no sync problem. A task can consume
  several parts ("annual service" = filter + seal + descaler).

### Identifiers: GTIN + MPN

"EAN" today is the GS1 **GTIN** family: EAN-13 = GTIN-13 (international,
incl. Japan's JAN), UPC-A = GTIN-12 (North America; a GTIN-13 with a leading
zero), EAN-8, GTIN-14. One `gtin` field accepts 8/12/13/14 digits and
validates the GS1 check digit — that covers "worldwide". Spare parts often
have **no retail barcode** but always a manufacturer part number, so `mpn`
(+ `vendor`) is the second, frequently sharper identifier.

### Shopping link resolution

No price-API scraping (ToS, fragility, keys) — deep links only:

1. `product_url` on the part always wins.
2. Otherwise a search URL with a `{q}` placeholder and query precedence
   **GTIN → "vendor mpn" → name**. The template is read from the global option
   `part_search_url_template` (`parts_runtime.py`), but **nothing currently
   writes it**: the key is absent from `SETTING_SPECS`, so `global/update`
   drops it, and there is neither an options-flow nor a panel field for it. In
   practice every install therefore uses the built-in default — an Amazon
   search for the HA UI language. Making it configurable means adding the
   `SettingSpec` plus a UI field; until then the read is a hook, not a setting.

## Buy-task lifecycle: declarative reconcile

A pure function (`helpers/parts.reconcile_buy_tasks`) computes the desired
state — *a buy task exists exactly while its part opts in AND is low* — and
diffs it against the tasks carrying a `part_ref` marker. Idempotence and
self-healing are properties of the diff, not bookkeeping:

- stock drops to the threshold → one reminder is created (one-off `custom`
  task, label `shopping`, cart icon, due today; **no new task-type enum** —
  that would cascade through every surface and translation);
- restocking any other way removes an **open** reminder automatically;
- a **completed** reminder occupies its part's *low episode* — if the restock
  didn't lift the stock above the threshold, no duplicate spawns;
- when the part recovers, a completed reminder is **kept** (its cost history
  feeds the statistics) and only its `part_ref` marker is detached, so the
  next low episode starts fresh.

The reminder is self-contained for shopping without opening the object:
quantity, identifiers, unit price, the shopping link (as the task's
`documentation_url`) and the storage location for putting the delivery away.

The runtime driver (`parts_runtime.py`) applies the diff through the shared
task-CRUD primitives and reloads the entry once (per-task entities). It runs
as a deferred background task — never from inside the coordinator call that
changed the stock. Stock writes save the Store **immediately** (not
debounced): a reload may follow any stock change and would otherwise read
stale state from disk.

## Stock rules

- Consumption on **complete** only (skip/missed consume nothing), clamped at 0.
- Restock on completing the buy task: `restock_quantity` by default, editable
  in the complete dialog (`restock_quantity` on the complete WS call); cost
  prefills quantity × unit price into the normal cost field.
- Manual adjustment any time via `part/restock` (delta or absolute).
- Events are **edge-triggered** — `low` / `out` / `restocked` fire once per
  crossing; a further decrease while already low never re-nags.

## Entities

One stock sensor per part on the object device (state = stock, `unavailable`
for catalog-only parts; attributes: threshold, storage location, `is_low`) and
one global `parts_to_reorder` counter on the hub (registry-stable unique_ids).
Both dispatcher-driven — no polling, recorder writes only on real stock
movements.

## Surfaces

- **Panel**: "Parts & consumables" section on the object detail (rows with
  stock badge, identifiers, storage location, shopping link; inline add/edit
  form with native inputs; +/- stock adjust). Task dialog: "Consumes parts"
  checkboxes with per-part quantity (self-loaded from the object payload so
  every dialog opener works). Complete dialog: consumption preview and, on a
  buy task, the editable "quantity bought" field. Work sheet: a required-parts
  block with tick boxes.
- **Config flow**: intentionally panel-only for now (same decision as the
  documents feature).

## Interactions & edge cases

- **Export/import** round-trips definitions, tracked stock and task links;
  part ids are regenerated on import and links remapped (like task ids).
- **Replace object** carries parts *including stock* to the successor (the
  shelf doesn't change when the machine dies).
- **Archive/pause** produce no buy tasks; deleting an object removes its
  parts, links and any open reminder; deleting a part prunes task links and
  its stock state.
- Parts are **per-object** by design (entry-data locality, export simplicity).
  Former known limit — *"a consumable shared between two objects has two
  stocks"* — closed in 2.45 (#111) WITHOUT moving to a global store: a task's
  `consumes_parts` link may carry an `entry_id` and draw on a pool owned by
  another object. Ownership stays singular, so the reconciler, the threshold
  and the stock sensor stay entry-local and nothing needed deduplicating.
  Deleting an owner transfers the pool to its longest-standing borrower rather
  than orphaning it (`helpers/shared_parts.py`), because stock lives in a
  per-entry Store that is destroyed with the entry — and `prune_part_orphans`
  would delete a stock row parked anywhere else on the next setup.

## Testing

Pure rules unit-tested (GTIN check digit, transitions, episode semantics);
the full consume→low→buy→restock loop through the real integration incl. the
stock sensor and the global counter; a journey across restarts; an
export/import tripwire asserting every part field + stock + links survive;
permission matrix entries for the four WS commands; a live e2e script
(`e2e/live-parts-test.mjs`) driving the loop against a running instance.
