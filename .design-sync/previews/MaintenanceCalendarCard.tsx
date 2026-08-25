/** MaintenanceCalendarCard — rolling maintenance calendar.
 * Forward mode projects tasks from next_due (window chips 7/14/30/365);
 * past mode lists what history actually recorded.
 *
 * Two capture constraints shape these stories:
 * - the capture browser pins the clock (page.clock.setFixedTime), so the
 *   kit's absolute 2026 dates never fall inside the card's window — dates
 *   here are computed RELATIVE to `new Date()`;
 * - the 700px capture viewport: forward day rows are 83px each and all 7
 *   render, so a 7-day story fits only with about one event per day (extra
 *   events +35px each). Past mode collapses empty days and is denser.
 */
import * as React from "react";
import { dsDemoHass, dsProps, DS_DEMO } from "maintenance-supporter-frontend";

type ConfigurableEl = { setConfig: (c: Record<string, unknown>) => void };

const iso = (offsetDays: number): string => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + offsetDays);
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
};
const ts = (offsetDays: number, time = "10:00:00"): string => `${iso(offsetDays)}T${time}+00:00`;

type DemoObjects = Array<{ entry_id: string; tasks: Array<Record<string, unknown>> }>;

/** The kit household re-dated relative to "now" + history the past window can see. */
const relativeObjects = (): DemoObjects => {
  const objects = JSON.parse(JSON.stringify(DS_DEMO.OBJECTS)) as DemoObjects;
  const task = (entryId: string, taskId: string) =>
    objects.find((o) => o.entry_id === entryId)!.tasks.find((t) => t.id === taskId)!;

  Object.assign(task("demo_hvac", "t_filter"), {
    next_due: iso(-6),
    days_until_due: -6,
    history: [
      { timestamp: ts(-18), type: "completed", notes: "Rinsed and dried the filter", cost: 24.9, duration: 20, completed_by: "admin-1" },
      { timestamp: ts(-48), type: "completed", cost: 24.9, duration: 15 },
    ],
  });
  Object.assign(task("demo_hvac", "t_coils"), { next_due: iso(3), days_until_due: 3 });
  Object.assign(task("demo_hvac", "t_refrigerant"), { next_due: iso(122), days_until_due: 122 });
  Object.assign(task("demo_vacuum", "t_dustbin"), {
    next_due: iso(2),
    days_until_due: 2,
    history: [
      { timestamp: ts(-4, "17:40:00"), type: "completed", duration: 2 },
      { timestamp: ts(-8, "19:10:00"), type: "skipped", notes: "Weekend away" },
    ],
  });
  Object.assign(task("demo_vacuum", "t_sensor_wipe"), { next_due: iso(1), days_until_due: 1 });
  Object.assign(task("demo_vacuum", "t_brush"), {
    history: [{ timestamp: ts(-12, "12:00:00"), type: "trigger_replaced", notes: "312 h on the old brush" }],
  });
  Object.assign(task("demo_pool", "t_backwash"), { next_due: iso(9), days_until_due: 9 });
  Object.assign(task("demo_pool", "t_ph"), {
    next_due: iso(-2),
    days_until_due: -2,
    history: [{ timestamp: ts(-9, "09:00:00"), type: "completed", cost: 6.5, duration: 10, notes: "pH 7.4 — added 2 chlorine tabs" }],
  });
  Object.assign(task("demo_pool", "t_winterize"), { next_due: iso(68), days_until_due: 68 });
  return objects;
};

/** Forward-week variant: at most one event per day so the whole 7-day
 * composition (chips included) fits the capture viewport. */
const weekObjects = (): DemoObjects => {
  const objects = relativeObjects();
  const task = (entryId: string, taskId: string) =>
    objects.find((o) => o.entry_id === entryId)!.tasks.find((t) => t.id === taskId)!;
  // Overdue and triggered tasks all bucket on TODAY — keep exactly one.
  Object.assign(task("demo_pool", "t_ph"), { status: "ok", next_due: iso(6), days_until_due: 6 });
  Object.assign(task("demo_vacuum", "t_brush"), { status: "ok", trigger_active: false });
  // Projection shown in the Embedded story; here it would push the card's
  // closing border past the 700px capture frame.
  Object.assign(task("demo_vacuum", "t_dustbin"), { interval_days: 6 });
  return objects;
};

const calHass = (objects: () => DemoObjects) =>
  dsDemoHass({
    handlers: {
      "maintenance_supporter/objects": () => ({ objects: objects() }),
    },
  });

const configure =
  (config: Record<string, unknown>, objects: () => DemoObjects = relativeObjects) =>
  (el: unknown) => {
    if (!el) return;
    (el as ConfigurableEl).setConfig({
      type: "custom:maintenance-supporter-calendar-card",
      ...config,
    });
    dsProps({ hass: calHass(objects) })(el);
  };

export const ThisWeek = () => (
  <maintenance-supporter-calendar-card
    ref={configure(
      { window_days: 7, show_user_filter: false, show_object_filter: false },
      weekObjects,
    )}
    style={{ display: "block", width: 520 }}
  />
);

/** Past mode: what history actually recorded — completions, a skip and a
 * trigger swap, labelled by event type (not derived status). */
export const PastMonth = () => (
  <maintenance-supporter-calendar-card
    ref={configure({ past_days: 30, title: "Recently done" })}
    style={{ display: "block", width: 520 }}
  />
);

/** Embedded use: chips + filters hidden, restricted to one object. */
export const Embedded = () => (
  <maintenance-supporter-calendar-card
    ref={configure({
      window_days: 7,
      show_window_chips: false,
      show_user_filter: false,
      show_object_filter: false,
      object_filter: "Robot Vacuum",
    })}
    style={{ display: "block", width: 520 }}
  />
);
