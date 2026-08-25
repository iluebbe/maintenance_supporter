---
category: Sections
---

The battery fleet roster section (used inside the panel's fleet task detail, and wrapped by the fleet card): all tracked batteries in an aligned grid — name, type chip, level bar, sparkline, predicted date, visibility toggle — plus shopping summary, self-charging toggle and add-battery picker.

Set the `flat` attribute to drop the section chrome (the card wrapper does this).

```jsx
import { dsDemoHass, dsProps } from "maintenance-supporter-frontend";

<maintenance-battery-fleet-section ref={dsProps({ hass: dsDemoHass() })} />
```
