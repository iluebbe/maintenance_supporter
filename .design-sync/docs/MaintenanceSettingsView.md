---
category: Views
---

The integration settings surface: feature toggles (adaptive, budget, groups, checklists, ...), notification rules with quiet hours, completion actions, vacation mode, budget limits, import/export and QR batch printing.

```jsx
import { dsDemoHass, dsProps, DS_DEMO } from "maintenance-supporter-frontend";

<maintenance-settings-view
  ref={dsProps({ hass: dsDemoHass(), features: DS_DEMO.SETTINGS.features, budget: null })}
/>
```
