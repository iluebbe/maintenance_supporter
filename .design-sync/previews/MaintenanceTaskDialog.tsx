/** MaintenanceTaskDialog — the full create/edit task form.
 * openCreate/openEdit are async: they load users/tags/parts/foreign pools
 * over WS before opening, so the demo hass must answer those reads.
 * Overrides here (not in the kit): tags/list ships {id,name} objects (the
 * dialog's expected shape), and object/objects carry `parts` so the
 * consumes-parts picker and foreign-pool section render. */
import * as React from "react";
import { dsDemoHass, dsProps, DS_DEMO } from "maintenance-supporter-frontend";

const HVAC_PARTS = [
  { id: "p_filter", name: "HEPA filter", unit: "pcs" },
  { id: "p_cleaner", name: "Coil cleaner", unit: "bottle" },
];
const VACUUM_PARTS = [{ id: "p_brush", name: "Main brush", unit: "pcs" }];

const partsFor = (entryId: string) =>
  entryId === "demo_vacuum" ? VACUUM_PARTS : entryId === "demo_hvac" ? HVAC_PARTS : [];

const taskHass = () =>
  dsDemoHass({
    handlers: {
      "maintenance_supporter/tags/list": () => ({
        tags: [
          { id: "filters", name: "filters" },
          { id: "outdoor", name: "outdoor" },
          { id: "safety", name: "safety" },
        ],
      }),
      "maintenance_supporter/object": (msg) => {
        const found =
          DS_DEMO.OBJECTS.find((o) => o.entry_id === msg.entry_id) ?? DS_DEMO.OBJECTS[0];
        return { ...found, parts: partsFor(found.entry_id) };
      },
      "maintenance_supporter/objects": () => ({
        objects: DS_DEMO.OBJECTS.map((o) => ({ ...o, parts: partsFor(o.entry_id) })),
      }),
    },
  });

const FLAGS = {
  checklistsEnabled: true,
  scheduleTimeEnabled: true,
  completionActionsEnabled: true,
  defaultWarningDays: 7,
};

type TaskDialogEl = {
  openCreate: (entryId: string, objects?: unknown[]) => Promise<void>;
  openEdit: (entryId: string, task: unknown) => Promise<void>;
};

const openWith = (call: (el: TaskDialogEl) => void) => (el: unknown) => {
  if (!el) return;
  dsProps({ hass: taskHass(), ...FLAGS })(el);
  call(el as TaskDialogEl);
};

/** No preset object → alphabetical object dropdown (#40), blank form. */
export const CreateWithObjectPicker = () => (
  <maintenance-task-dialog
    ref={openWith((el) => void el.openCreate("", DS_DEMO.OBJECTS))}
  />
);

/** Time-based task with checklist, labels, priority and linked parts. */
export const EditTimeBased = () => (
  <maintenance-task-dialog
    ref={openWith((el) => void el.openEdit("demo_hvac", DS_DEMO.OBJECTS[0].tasks[0]))}
  />
);

/** Sensor-based runtime trigger (Robot Vacuum main brush, 300 h).
 * Real HA entity pickers cannot exist outside HA, so this jumps straight to
 * the dialog's own comma-separated fallback (its probe lands there ~2.2 s in
 * anyway) and scrolls the trigger section into the captured window — it sits
 * far down the form. */
export const EditSensorTrigger = () => (
  <maintenance-task-dialog
    ref={openWith((el) =>
      void el.openEdit("demo_vacuum", DS_DEMO.OBJECTS[1].tasks[0]).then(async () => {
        const lit = el as unknown as {
          _entityPickerFallback: boolean;
          updateComplete: Promise<unknown>;
          shadowRoot: ShadowRoot | null;
        };
        lit._entityPickerFallback = true;
        await lit.updateComplete;
        const content = lit.shadowRoot?.querySelector(".content");
        const headings = Array.from(lit.shadowRoot?.querySelectorAll("h3") ?? []);
        const trigger = headings.find((h) => /trigger/i.test(h.textContent ?? ""));
        if (content && trigger) {
          const delta =
            trigger.getBoundingClientRect().top - content.getBoundingClientRect().top;
          content.scrollTop += delta - 8;
        }
      }),
    )}
  />
);
