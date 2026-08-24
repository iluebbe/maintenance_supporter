---
category: Dialogs
---

Create/edit dialog for task groups: name, color, and member task selection across all objects. `openCreate()` / `openEdit(groupId, group)`.

```jsx
import { dsDemoHass, dsProps, DS_DEMO } from "maintenance-supporter-frontend";

<maintenance-group-dialog ref={dsProps({ hass: dsDemoHass(), objects: DS_DEMO.OBJECTS })} />
```
