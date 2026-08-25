---
category: Sections
---

Spare-parts inventory for an object: part rows with stock vs. minimum, unit, storage location and cost; restock and edit flows; low-stock rows highlight and feed the buy-task shopping list.

```jsx
import { dsDemoHass, dsProps, DS_DEMO } from "maintenance-supporter-frontend";

<maintenance-parts-section ref={dsProps({ hass: dsDemoHass(), entryId: "demo_hvac", parts: DS_DEMO.PARTS })} />
```
