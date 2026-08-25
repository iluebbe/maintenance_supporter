---
category: Dialogs
---

The full task create/edit dialog: name, schedule (interval, calendar patterns, one-time), warning window, sensor triggers, checklist, parts consumption, assignees/rotation, priority, labels and completion requirements.

Open imperatively — `openCreate(entryId, objects?)` for a new task (pass the object list to render the object picker), `openEdit(entryId, task)` with a full task.

```jsx
import { dsDemoHass, dsProps, DS_DEMO } from "maintenance-supporter-frontend";

<maintenance-task-dialog ref={dsProps({ hass: dsDemoHass() })} />
// then: el.openCreate("", DS_DEMO.OBJECTS)
```
