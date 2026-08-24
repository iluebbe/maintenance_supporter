---
category: Elements
---

SVG sparkline/line chart for sensor-triggered tasks: value series, maintenance-event markers, above/below threshold lines, target line and an optional dashed degradation projection. Pure presentational — feed it points.

```jsx
import { dsProps } from "maintenance-supporter-frontend";

<maintenance-trigger-chart
  ref={dsProps({
    points: [{ ts: 1755600000000, val: 220 }, { ts: 1755900000000, val: 261 }, { ts: 1756200000000, val: 312 }],
    events: [], thresholdAbove: 300, thresholdBelow: null, targetValue: null, projection: null,
  })}
/>
```
