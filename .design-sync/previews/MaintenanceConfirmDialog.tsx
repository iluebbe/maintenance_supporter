/** MaintenanceConfirmDialog — promise-based confirm()/prompt().
 * Call (don't await) so the dialog stays open for the capture. */
import * as React from "react";
import { dsDemoHass, dsProps } from "maintenance-supporter-frontend";

type ConfirmDialogEl = {
  confirm: (opts: Record<string, unknown>) => Promise<boolean>;
  prompt: (opts: Record<string, unknown>) => Promise<unknown>;
};

const openWith = (call: (el: ConfirmDialogEl) => void) => (el: unknown) => {
  if (!el) return;
  dsProps({ hass: dsDemoHass() })(el);
  call(el as ConfirmDialogEl);
};

/** Destructive confirm — danger-styled action button. */
export const DeleteTask = () => (
  <maintenance-confirm-dialog
    ref={openWith((el) =>
      void el.confirm({
        title: "Delete task?",
        message:
          'This permanently removes "Clean air filter" and its 12 history entries.',
        confirmText: "Delete",
        danger: true,
      }),
    )}
  />
);

/** prompt() variant — message plus a native date input. */
export const PromptForDate = () => (
  <maintenance-confirm-dialog
    ref={openWith((el) =>
      void el.prompt({
        title: "Pause task",
        message: "The task is hidden from due lists until this date.",
        confirmText: "Pause",
        inputLabel: "Resume on",
        inputType: "date",
        inputValue: "2026-09-15",
      }),
    )}
  />
);
