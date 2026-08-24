---
category: Cards
---

The main Lovelace task-list card: a household's maintenance tasks with status dots, due-in countdowns, assignee badges and per-row complete buttons, plus header KPIs and add-object/add-task actions.

Use it as the primary at-a-glance surface on any dashboard. It loads its own data through `hass` (objects, statistics, saved view filters) — give it a `hass` and it fills itself.

```jsx
import { dsDemoHass, dsProps } from "maintenance-supporter-frontend";

<maintenance-supporter-card ref={dsProps({ hass: dsDemoHass() })} />
```

Rows open the task quick-actions dialog; the header check button opens the complete dialog. Status colors follow the `--maint-*` tokens.
