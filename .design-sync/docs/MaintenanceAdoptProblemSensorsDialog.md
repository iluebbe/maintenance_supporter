---
category: Dialogs
---

Discovery dialog for problem/binary sensors (filter clogged, tank empty, ...): lists detected sensors with their devices, lets the user adopt each as a sensor-triggered maintenance task, with per-sensor hold-filter (for-minutes) and part pre-link.

```jsx
import { dsDemoHass, dsProps } from "maintenance-supporter-frontend";

<maintenance-adopt-problem-sensors-dialog ref={dsProps({ hass: dsDemoHass() })} />
```
