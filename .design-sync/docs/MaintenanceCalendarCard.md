---
category: Cards
---

Month/agenda calendar of upcoming maintenance: each day cell carries colored pills for due, overdue (red), due-soon (amber) and missed tasks; clicking a pill opens the task.

Use it when planning ahead matters more than the flat list. Data is self-loaded through `hass`.

```jsx
import { dsDemoHass, dsProps } from "maintenance-supporter-frontend";

<maintenance-supporter-calendar-card ref={dsProps({ hass: dsDemoHass() })} />
```
