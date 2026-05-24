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

### 🛠️ Calendar-pattern schedules
In addition to the day/week/month/year intervals, support calendar-anchored
recurrence:
- specific **weekdays** ("every Mon & Thu — skim the pool"),
- **nth weekday of month** ("first Saturday — test the smoke alarms"),
- specific **day-of-month**.

Extends the calendar-aware interval engine (last-day clamping, leap years) and
the calendar projection already used by the panel + calendar entity.

*Implemented and tested across the task dialog, config & options flows, the
add-task service, import/export (JSON/YAML), and the localized calendar-entity
label — in all 12 UI languages. Ships with the next release.*

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
