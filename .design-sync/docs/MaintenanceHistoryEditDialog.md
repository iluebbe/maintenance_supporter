---
category: Dialogs
---

Edit dialog for an existing history entry: timestamp, notes, cost, duration, completed-by and used parts (stock is reconciled by delta). Opened with the entry's current values.

```jsx
import { dsDemoHass, dsProps } from "maintenance-supporter-frontend";

<maintenance-history-edit-dialog ref={dsProps({ hass: dsDemoHass() })} />
```
