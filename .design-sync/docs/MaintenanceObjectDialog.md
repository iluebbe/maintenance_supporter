---
category: Dialogs
---

Create/edit dialog for a maintained object (the device/appliance): name, area, manufacturer/model/serial, linked HA device and notes.

`openCreate()` for a new object, `openEdit(entryId, object)` to edit.

```jsx
import { dsDemoHass, dsProps } from "maintenance-supporter-frontend";

<maintenance-object-dialog ref={dsProps({ hass: dsDemoHass() })} />
```
