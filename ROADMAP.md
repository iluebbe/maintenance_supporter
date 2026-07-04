# Roadmap

Planned and proposed features for **Maintenance Supporter**. This is a living
document — priorities shift with user feedback (issues and Discussions).
Nothing here is a dated promise; items ship when they're ready and well-tested.
Shipped features are recorded in [CHANGELOG.md](CHANGELOG.md).

Legend: 💡 proposed · 🛠️ in progress · ✅ shipped

---

## Near-term (planned)

### 💡 Shared maintenance — multiple assignees + rotation
Assign a task to several household members and rotate responsibility
automatically on each completion (round-robin, least-completed, or random).
Builds directly on the existing per-user assignment, per-user notification
routing, and operator mode — the missing piece for families, shared homes,
and hotels. The "currently responsible" user stays a single pointer so all
existing per-user notifications and badges keep working.

### 💡 Native To-do entity
Expose due/overdue tasks as a Home Assistant `todo` list entity, so
maintenance appears in the native **To-do** dashboard card and can be managed
by **Assist/voice** ("what maintenance is due?", "mark the filter change
done"). Complements — does not replace — the panel and the Lovelace card.
Optional per-assignee lists pair with rotation above.

### 💡 Multiple reminders per task + overdue escalation
Beyond the single "warning days" threshold: configure several lead-time
reminders (e.g. **14 days / 3 days / on the due date**) and an optional repeat
cadence once a task is overdue. Runs through the existing notification manager,
so rate-limiting, quiet hours, and bundling apply automatically.

---

## Next (under consideration)

### 💡 Priority levels
An explicit priority per task (e.g. P1–P4) to sharpen triage when many tasks
are due at once — feeds the existing sort/group-by, and notification emphasis.

### 💡 "Missed" status + completion window
Distinguish a task that was due and never done (**Missed**) from a manual
reset, for clearer history, better adaptive learning, and compliance views.
Optionally restrict premature completion (don't let the annual inspection be
signed off three weeks early).

### 💡 Cross-cutting labels / tags
Lightweight tags (e.g. `#safety`, `#seasonal`, `#tenant-visible`) that cut
across objects, areas, and groups for filtering and reporting — orthogonal to
the existing hierarchical grouping.

### 💡 Warranty-expiry reminders
Remind ahead of an object's warranty running out, linked to its stored warranty
document. Reuses the notification manager (lead times, quiet hours, bundling)
and the documents feature (attach the warranty PDF, surface it in the reminder).
Distinct from a recurring task's due date — it's a one-off date on the
object/document, not a schedule.

---

## Usability & design wave (planned, 2026-07)

Smaller, high-frequency wins first; each ships independently.

### Quick wins
- ⏸️ **Object photos as avatars** — the documents feature already stores images;
  pick one as the object's thumbnail in cards and the objects table. **On hold**
  (2026-07): unsure it reads/looks well at avatar size — revisit with a design
  mockup before building.
- 💡 **Duplicate task / object** — clone an existing task (or a whole object with
  its tasks) as a starting point. Covers multi-stage filter units and fleets of
  identical hotel rooms without repetitive data entry.
- 💡 **Undo toast instead of confirm dialogs** — low-risk actions (complete, skip,
  archive) execute immediately with a few seconds of "Undo"; destructive deletes
  keep their confirmation.
- 💡 **Snooze in the panel** — snoozing currently exists only as a notification
  action; surface it on task rows and the task detail.
- 💡 **Bulk actions** — multi-select in the tasks and objects tables: complete,
  archive, assign a user in one go.

### Bigger building blocks
- 💡 **First-run onboarding + template gallery** — a guided "create your first
  object" flow in the panel, and the 13 object templates (currently config-flow
  only) browsable as a visual gallery.
- 💡 **"Today / this week" view** — a mobile-first focus list of what's due, with
  one-tap complete and an estimated total effort; candidate default landing view
  on phones.
- 💡 **Command palette (Ctrl+K)** — global search across objects, tasks, and
  documents plus quick actions, generalizing the document search shipped in
  2.11.0.
- 💡 **Weekly digest notification** (opt-in) — a Monday-morning summary ("3 tasks
  due this week") through the existing notification manager.
- 💡 **Printable maintenance report (PDF)** — per object or whole install: asset
  data, task history, costs. Aimed at landlords/hotels (operator mode) that need
  maintenance evidence.

### Design system
- 💡 **Dark-mode & color-blind audit** — status colors lean hard on red/green and
  the chart danger zone uses low-opacity fills; add a second encoding
  (icons/patterns), verify contrast in dark themes, consolidate design tokens.
- 💡 **Task-detail information architecture** — the page has grown (trigger,
  prediction, seasonal, cost, documents, history): collapsible sections with
  remembered state.
- 💡 **Panel performance as a feature** — list virtualization and code-splitting
  for large installs (`content-visibility` shipped in 2.12.0 as the first step).

## Maintainability (internal, scheduled before the feature wave)

Refactorings that keep the codebase healthy as it grows — no user-visible
changes, but they gate how cheap the features above are to build.

- 🛠️ **Extract per-type trigger evaluators** from the coordinator's refresh
  fallback (five near-identical per-entity loops today) into pure, individually
  tested functions.
- 🛠️ **Move `_trigger_state` out of `trigger_config`** into the runtime Store —
  dynamic state currently lives inside static config (entry.data), which has
  repeatedly caused confusion (baseline/current-value bugs).
- 🛠️ **Modularize the panel** — the 2.5k-line `maintenance-panel.ts` is being
  thinned by extracting cohesive render clusters into `renderers/` free-function
  modules (the pattern already used for sparkline/prediction/charts). Done so
  far: the shared progress bars (`renderers/progress.ts`) and the history
  sub-view (`renderers/history.ts`). Remaining: the task-detail cluster is a
  larger, higher-risk step — it owns ~20 action handlers and drives dialogs in
  the panel's shadow root, so a full `<task-detail-view>` web component needs
  events/dialog-ownership rework rather than a mechanical move; do it
  incrementally, not big-bang.
- 🛠️ **Panel ↔ config-flow parity by construction** — both UIs must expose the
  same task/trigger fields (parity is the product goal). Instead of maintaining
  two hand-written forms, derive both from a single field-schema source so a new
  field lands in panel *and* options flow automatically — and can't silently
  drop sibling keys (the 2.12.0 recovery-flag preserve-hack is the symptom to
  eliminate).
- 🛠️ **Parallelize the test suite** (pytest-xdist) — the backend suite is at
  ~9 minutes and growing.

---

## Exploratory (longer-term ideas)

- **Voice / Assist task creation** — create a task by natural language through
  HA Assist ("add maintenance: replace HVAC filter every 3 months").
- **Optional gamification** — per-user completion streaks / points for shared
  households, off by default.
- **Approval workflow** — manager sign-off on completions for operator /
  commercial setups (dovetails with operator mode).
- **Photo attachments** — before/after photos or a receipt on a completion.

---

Have an idea or want to vote on one of these? Open an issue with the
`enhancement` label, or join the
[Ideas discussions](https://github.com/iluebbe/maintenance_supporter/discussions).
