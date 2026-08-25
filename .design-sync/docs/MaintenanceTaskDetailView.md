---
category: Views
---

The full task detail page: header with status and actions, schedule/trigger facts, progress bars, sparkline chart with trigger thresholds, parts, documents, checklist, history timeline and adaptive-analysis sections.

Give it the task object and a context (`ctx`) carrying `hass` plus the surrounding object data.

```jsx
import { dsDemoHass, dsProps, DS_DEMO } from "maintenance-supporter-frontend";

<maintenance-task-detail-view
  ref={dsProps({ task: DS_DEMO.OBJECTS[0].tasks[0], ctx: { hass: dsDemoHass(), entryId: "demo_hvac" } })}
/>
```
