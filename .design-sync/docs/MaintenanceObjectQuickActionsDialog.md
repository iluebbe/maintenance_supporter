---
category: Dialogs
---

Quick-actions dialog for an object: read-only meta (area, model, serial), its task list with statuses, and Edit / Add-task / Pause / Delete actions. `openFor(entryId)`.

```jsx
import { dsDemoHass, dsProps } from "maintenance-supporter-frontend";

<maintenance-object-quick-actions-dialog ref={dsProps({ hass: dsDemoHass() })} />
// then: el.openFor("demo_hvac")
```
