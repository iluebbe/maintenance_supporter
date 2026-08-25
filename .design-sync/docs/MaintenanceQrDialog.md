---
category: Dialogs
---

QR-code dialog for a task: renders the deep-link QR (server-generated SVG), object/task caption, and print/download actions — scan with a phone to open or complete the task.

`openForTask(entryId, taskId, objectName, taskName)`.

```jsx
import { dsDemoHass, dsProps } from "maintenance-supporter-frontend";

<maintenance-qr-dialog ref={dsProps({ hass: dsDemoHass() })} />
```
