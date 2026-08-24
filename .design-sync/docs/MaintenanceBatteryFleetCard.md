---
category: Cards
---

Battery fleet roster as a standalone Lovelace card: every tracked battery with level bar, type chip (CR2032, 9V, ...), predicted replacement date, sparkline and status; a shopping summary and a mark-replaced flow.

```jsx
import { dsDemoHass, dsProps } from "maintenance-supporter-frontend";

<maintenance-battery-fleet-card ref={dsProps({ hass: dsDemoHass() })} />
```

Wraps the same roster the panel's battery-fleet section renders (`flat` chrome handled internally).
