/** MaintenanceSettingsView — the panel's settings page (feature toggles,
 * panel access, general + notification settings, budget, vacation mode, QR
 * printing, import/export). It is one long page, so besides the top view two
 * cells scroll a fixed-height frame to the mid-page sections. */
import * as React from "react";
import { dsDemoHass, dsProps, DS_DEMO } from "maintenance-supporter-frontend";

const BUDGET = {
  monthly_budget: 150,
  monthly_spent: 37.4,
  yearly_budget: 1500,
  yearly_spent: 812.55,
  alert_threshold_pct: 80,
  currency_symbol: "€",
};

const props = () =>
  dsProps({ hass: dsDemoHass(), features: DS_DEMO.SETTINGS.features, budget: BUDGET });

export const FeaturesAndAccess = () => (
  <maintenance-settings-view ref={props()} style={{ display: "block", width: 760 }} />
);

/** Scroll a fixed frame so the Nth .settings-section sits at the top once the
 * async settings load has rendered (retry until the sections exist). */
const scrollToSection = (frame: HTMLDivElement | null, find: (sr: ShadowRoot) => Element | null) => {
  if (!frame) return;
  const el = frame.querySelector("maintenance-settings-view") as { shadowRoot?: ShadowRoot | null } | null;
  let tries = 0;
  const timer = setInterval(() => {
    const sr = el?.shadowRoot;
    const target = sr ? (find(sr) as HTMLElement | null) : null;
    if (target) {
      frame.scrollTop = target.getBoundingClientRect().top - frame.getBoundingClientRect().top + frame.scrollTop - 4;
      clearInterval(timer);
    } else if (++tries > 30) clearInterval(timer);
  }, 100);
};

const frameStyle: React.CSSProperties = { width: 780, height: 650, overflow: "hidden" };

export const Notifications = () => (
  <div style={frameStyle} ref={(f) => scrollToSection(f, (sr) => sr.querySelectorAll(".settings-section")[4] ?? null)}>
    <maintenance-settings-view ref={props()} style={{ display: "block", width: 760 }} />
  </div>
);

export const VacationAndQr = () => (
  <div style={frameStyle} ref={(f) => scrollToSection(f, (sr) => sr.querySelector('[data-section="vacation"]'))}>
    <maintenance-settings-view ref={props()} style={{ display: "block", width: 760 }} />
  </div>
);
