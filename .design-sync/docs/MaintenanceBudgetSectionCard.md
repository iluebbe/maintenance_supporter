---
category: Cards
---

Budget tracker card: monthly and yearly spend as progress tracks with the configured alert threshold (green to amber to red), plus inline budget editing for admins.

```jsx
import { dsDemoHass, dsProps } from "maintenance-supporter-frontend";

<maintenance-budget-section-card ref={dsProps({ hass: dsDemoHass() })} />
```

A budget of 0 renders as plain spent totals (tracking without a maximum).
