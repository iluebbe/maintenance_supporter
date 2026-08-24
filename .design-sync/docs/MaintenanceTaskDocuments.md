---
category: Sections
---

Compact document chips for one task (or part): the manuals/links bound to it, opening inline or in a new tab; used on task detail pages and dialogs.

```jsx
import { dsDemoHass, dsProps } from "maintenance-supporter-frontend";

<maintenance-task-documents ref={dsProps({ hass: dsDemoHass(), entryId: "demo_hvac", taskId: "t_filter" })} />
```
