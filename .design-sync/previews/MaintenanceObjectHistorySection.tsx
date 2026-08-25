/** MaintenanceObjectHistorySection — the cross-task lifecycle log (#138). */
import * as React from "react";
import { dsDemoHass, dsProps, DS_DEMO } from "maintenance-supporter-frontend";

const day = 86400000;
const iso = (offsetDays: number) => new Date(Date.now() - offsetDays * day).toISOString();

/** Rich per-task histories (the section fetches these itself). */
const HISTORIES: Record<string, unknown[]> = {
  t_filter: [
    { timestamp: iso(3), type: "completed", cost: 12.5, duration: 15, notes: "Rinsed and dried the filter", completed_by: "admin-1" },
    { timestamp: iso(34), type: "completed", cost: 24.9, duration: 20 },
    { timestamp: iso(63), type: "skipped", notes: "On vacation" },
    { timestamp: iso(95), type: "completed", duration: 15 },
    { timestamp: iso(126), type: "missed" },
    { timestamp: iso(150), type: "completed", cost: 12.5, duration: 18 },
  ],
  t_coils: [
    { timestamp: iso(20), type: "completed", cost: 0, duration: 30, notes: "Fins straightened", completed_by: "user-2" },
    { timestamp: iso(200), type: "completed", duration: 25 },
  ],
  t_refrigerant: [
    { timestamp: iso(140), type: "completed", cost: 189, duration: 90, notes: "Annual professional service", completed_by: "admin-1" },
    { timestamp: iso(505), type: "completed", cost: 175, duration: 85 },
  ],
};

const hass = () =>
  dsDemoHass({
    handlers: {
      "maintenance_supporter/task/history": (msg) => ({
        history: HISTORIES[String(msg.task_id)] ?? [],
      }),
    },
  });

const props = () => ({
  hass: hass(),
  entryId: "demo_hvac",
  object: DS_DEMO.OBJECTS[0].object,
  tasks: DS_DEMO.OBJECTS[0].tasks,
  currencySymbol: "€",
  userName: (id: string) => (id === "admin-1" ? "Alex" : id === "user-2" ? "Sam" : null),
});

export const Lifecycle = () => (
  <maintenance-object-history-section
    ref={dsProps(props())}
    style={{ display: "block", width: 660 }}
  />
);

export const FilteredToOneTask = () => (
  <maintenance-object-history-section
    ref={(el: unknown) => {
      if (!el) return;
      dsProps(props())(el);
      // The section resets its filters when entryId lands (updated()), so the
      // story's filter must be applied AFTER the initial load settles.
      const apply = (tries: number) => {
        const host = el as { shadowRoot?: ShadowRoot | null; _filterTask?: string };
        if (host.shadowRoot?.querySelector(".row")) {
          host._filterTask = "t_filter";
        } else if (tries > 0) {
          setTimeout(() => apply(tries - 1), 100);
        }
      };
      setTimeout(() => apply(30), 100);
    }}
    style={{ display: "block", width: 660 }}
  />
);
