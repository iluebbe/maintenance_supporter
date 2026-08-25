---
category: Sections
---

Object lifecycle history (#138): every task's completion/skip/reset entries merged into one chronological, cross-task log — the "vehicle service booklet" view on the object detail page. Task filter, inclusive date range, totals footer, and a printable service record (opens as a light-scheme sheet for print / save-as-PDF).

The section fetches each task's FULL history through `hass` on first use (`maintenance_supporter/task/history` per task); the demo backend answers those.

```jsx
import { dsDemoHass, dsProps, DS_DEMO } from "maintenance-supporter-frontend";

<maintenance-object-history-section
  ref={dsProps({
    hass: dsDemoHass(),
    entryId: "demo_hvac",
    object: DS_DEMO.OBJECTS[0].object,
    tasks: DS_DEMO.OBJECTS[0].tasks,
    currencySymbol: "€",
  })}
  style={{ display: "block", width: 640 }}
/>
```

Clicking a task name emits `open-task` (`detail.taskId`); `userName` takes an id→name resolver so the printed sheet credits people instead of UUIDs.
