---
category: Dialogs
---

Small promise-based confirm dialog used before destructive actions. `confirm({title, message, confirmText})` resolves true/false.

```jsx
import { dsProps, dsDemoHass } from "maintenance-supporter-frontend";

<maintenance-confirm-dialog ref={dsProps({ hass: dsDemoHass() })} />
// then: const ok = await el.confirm({ title: "Delete task", message: "Delete this task?", confirmText: "Delete" })
```
