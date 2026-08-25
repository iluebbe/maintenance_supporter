---
category: Dialogs
---

Integration-aware setup suggestions: known integrations found in the household (vacuum, printer, HVAC, ...) with ready-made task bundles the user can adopt in one click.

```jsx
import { dsDemoHass, dsProps } from "maintenance-supporter-frontend";

<maintenance-suggested-setups-dialog ref={dsProps({ hass: dsDemoHass() })} />
```
