---
category: Sections
---

Per-object document library: manuals, receipts and web links as cards with kind icons, size, and linked tasks/parts; upload, link-add, search and delete flows.

```jsx
import { dsDemoHass, dsProps } from "maintenance-supporter-frontend";

<maintenance-documents-section ref={dsProps({ hass: dsDemoHass(), entryId: "demo_hvac" })} />
```
