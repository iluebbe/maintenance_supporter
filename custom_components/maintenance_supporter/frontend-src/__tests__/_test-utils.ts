/**
 * Shared test utilities for the panel/card component test suites.
 *
 * Centralises the things that were previously duplicated across the per-file
 * `mockHass()` helpers in settings-view-vacation.test.ts /
 * settings-view-print-qr.test.ts / task-dialog-completion-actions.test.ts:
 *
 *   - DEFAULT_FEATURES — the AdvancedFeatures shape with everything OFF
 *   - DEFAULT_SETTINGS_RESPONSE — what the backend's
 *     `maintenance_supporter/settings` WS handler returns out of the box
 *   - createMockHass(...) — returns a stub `{hass, sent, serviceCalls}`
 *     with sendMessagePromise/callService captures and a small handler
 *     map for the most common WS endpoints. Per-suite overrides can be
 *     added via the `handlers` option.
 *
 * Underscore-prefixed filename so web-test-runner's `__tests__/**\/*.test.ts`
 * glob skips it (it's a helper, not a suite).
 */

export interface SentMessage {
  type: string;
  [key: string]: unknown;
}

export interface ServiceCall {
  domain: string;
  service: string;
  data?: Record<string, unknown>;
}

/** Same shape as `frontend-src/types.ts::AdvancedFeatures`. */
export interface MockFeatures {
  adaptive: boolean;
  predictions: boolean;
  seasonal: boolean;
  environmental: boolean;
  budget: boolean;
  groups: boolean;
  checklists: boolean;
  schedule_time: boolean;
  completion_actions: boolean;
}

export const DEFAULT_FEATURES: MockFeatures = {
  adaptive: false, predictions: false, seasonal: false,
  environmental: false, budget: false, groups: false,
  checklists: false, schedule_time: false, completion_actions: false,
};

/**
 * Default response for `maintenance_supporter/settings` — mirrors the shape
 * that `_build_full_settings()` in `websocket/dashboard.py` produces with
 * defaults. Override sub-objects via spread when a test needs a specific value:
 *
 *   const settings = { ...DEFAULT_SETTINGS_RESPONSE, vacation: {...DEFAULT_SETTINGS_RESPONSE.vacation, enabled: true} };
 */
export const DEFAULT_SETTINGS_RESPONSE = {
  features: { ...DEFAULT_FEATURES },
  admin_panel_user_ids: [] as string[],
  general: {
    default_warning_days: 7,
    notifications_enabled: false,
    notify_service: "",
    panel_enabled: false,
  },
  notifications: {
    due_soon_enabled: true, due_soon_interval_hours: 24,
    overdue_enabled: true, overdue_interval_hours: 12,
    triggered_enabled: true, triggered_interval_hours: 0,
    quiet_hours_enabled: true, quiet_hours_start: "22:00", quiet_hours_end: "08:00",
    max_per_day: 0, bundling_enabled: false, bundle_threshold: 2,
    title_style: "default",
  },
  actions: {
    complete_enabled: false, skip_enabled: false,
    snooze_enabled: false, snooze_duration_hours: 4,
  },
  budget: {
    monthly: 0, yearly: 0, alerts_enabled: false,
    alert_threshold_pct: 80, currency: "EUR", currency_symbol: "€",
  },
  vacation: {
    enabled: false, start: null as string | null, end: null as string | null,
    buffer_days: 3, exempt_task_ids: [] as string[],
    is_active: false, window_end: null as string | null,
  },
};

export type WsHandler = (msg: SentMessage) => Promise<unknown> | unknown;

export interface CreateMockHassResult {
  hass: {
    language: string;
    connection: { sendMessagePromise: (msg: SentMessage) => Promise<unknown> };
    callService: (
      domain: string, service: string, data?: Record<string, unknown>,
    ) => Promise<void>;
    services?: Record<string, Record<string, unknown>>;
  };
  sent: SentMessage[];
  serviceCalls: ServiceCall[];
}

export interface CreateMockHassOptions {
  /** Override the default settings response (deep-merge not done — pass full shape). */
  settingsResponse?: typeof DEFAULT_SETTINGS_RESPONSE;
  /** Per-WS-type handlers — return a value or Promise. Wins over built-in defaults. */
  handlers?: Record<string, WsHandler>;
  /** Optional `hass.services` registry (for ha-service-picker / schema-driven forms). */
  services?: Record<string, Record<string, unknown>>;
  /** Override `hass.language`. Defaults to "en". */
  language?: string;
}

/**
 * Build a stub `hass` object suitable for mounting Lit components in
 * @open-wc/testing fixtures. Captures all outgoing WS messages in `sent`
 * and all service calls in `serviceCalls` so tests can assert on them.
 *
 * Built-in handlers (overridable via `opts.handlers`):
 *   - maintenance_supporter/settings → DEFAULT_SETTINGS_RESPONSE (or the override)
 *   - maintenance_supporter/users/list → {users: []}
 *   - maintenance_supporter/objects → {objects: []}
 *   - maintenance_supporter/tags/list → {tags: []}
 *   - default for anything else → {}
 */
export function createMockHass(opts: CreateMockHassOptions = {}): CreateMockHassResult {
  const sent: SentMessage[] = [];
  const serviceCalls: ServiceCall[] = [];
  const settings = opts.settingsResponse ?? DEFAULT_SETTINGS_RESPONSE;

  const sendMessagePromise = async (msg: SentMessage): Promise<unknown> => {
    sent.push(msg);
    const override = opts.handlers?.[msg.type];
    if (override) return await override(msg);
    if (msg.type === "maintenance_supporter/settings") return settings;
    if (msg.type === "maintenance_supporter/users/list") return { users: [] };
    if (msg.type === "maintenance_supporter/objects") return { objects: [] };
    if (msg.type === "maintenance_supporter/tags/list") return { tags: [] };
    return {};
  };

  const callService = async (
    domain: string, service: string, data?: Record<string, unknown>,
  ): Promise<void> => {
    serviceCalls.push({ domain, service, data });
  };

  return {
    hass: {
      language: opts.language ?? "en",
      connection: { sendMessagePromise },
      callService,
      services: opts.services,
    },
    sent,
    serviceCalls,
  };
}
