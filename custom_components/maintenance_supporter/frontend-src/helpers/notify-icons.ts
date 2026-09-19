/**
 * #185: the default push-notification icon per maintenance type — the panel's
 * copy of `helpers/notify_icons.py::DEFAULT_NOTIFY_ICONS` (a Python tripwire
 * keeps the two maps identical). Used only to tell the user which icon a task
 * gets when its own `notify_icon` is empty.
 */
export const NOTIFY_ICON_DEFAULTS: Record<string, string> = {
  cleaning: "mdi:broom",
  inspection: "mdi:magnify",
  replacement: "mdi:swap-horizontal",
  calibration: "mdi:tune",
  service: "mdi:wrench",
  reading: "mdi:counter",
  custom: "mdi:wrench-clock",
};

export const NOTIFY_ICON_FALLBACK = "mdi:wrench-clock";

export const defaultNotifyIcon = (taskType: string | undefined): string =>
  (taskType && NOTIFY_ICON_DEFAULTS[taskType]) || NOTIFY_ICON_FALLBACK;
