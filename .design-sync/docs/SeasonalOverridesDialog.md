---
category: Dialogs
---

Per-month interval-override editor for a task: a 12-month grid where each month can stretch or shrink the base interval (e.g. mow weekly in summer, pause in winter).

```jsx
import { dsDemoHass, dsProps } from "maintenance-supporter-frontend";

<maintenance-seasonal-overrides-dialog ref={dsProps({ hass: dsDemoHass() })} />
```
