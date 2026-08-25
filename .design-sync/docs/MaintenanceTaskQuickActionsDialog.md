---
category: Dialogs
---

The task quick-actions hub opened from card rows: quick info (status, next due, interval), Complete/Skip/Reset, admin actions (Edit, QR, Archive, Delete), expandable history + stats, and adaptive-analysis panels.

`openFor(entryId, taskId)` loads fresh data itself.

```jsx
import { dsDemoHass, dsProps } from "maintenance-supporter-frontend";

<maintenance-task-quick-actions-dialog ref={dsProps({ hass: dsDemoHass() })} />
// then: el.openFor("demo_hvac", "t_filter")
```
