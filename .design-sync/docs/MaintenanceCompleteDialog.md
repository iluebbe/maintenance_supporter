---
category: Dialogs
---

The completion dialog: notes, cost, duration, checklist tick-off, optional reading value (for reading tasks: `taskType`/`readingUnit`), per-completion parts selection with stock display, backdating, and photo attachment. Enforces `requiredFields`.

Configure via properties, then call `open()`:

```jsx
import { dsDemoHass, dsProps } from "maintenance-supporter-frontend";

<maintenance-complete-dialog
  ref={dsProps({
    hass: dsDemoHass(), entryId: "demo_hvac", taskId: "t_filter",
    taskName: "Clean air filter",
    checklist: ["Remove front cover", "Vacuum filter", "Rinse and dry"],
    requiredFields: ["notes"],
  })}
/>
// then: el.open()
```
