/**
 * Home profile (v2.93) — the backend's guess of house vs apartment, the
 * climate of the home location and the country, as served with the
 * `maintenance_supporter/templates` read. The panel gallery recommends
 * templates from it; Settings shows it and lets the admin override the
 * dwelling type (`home_type`). Everything is derived locally.
 */

import { t } from "../styles";

export interface HomeClimate {
  koppen: string | null;
  coldest_c: number | null;
  warmest_c: number | null;
  hemisphere: "north" | "south";
  has_winter: boolean;
  traits: string[];
}

export interface HomeProfile {
  dwelling: "house" | "apartment" | "unknown";
  dwelling_detected: "house" | "apartment" | "unknown";
  dwelling_reasons: string[];
  dwelling_source: "auto" | "setting";
  country: string | null;
  hemisphere: "north" | "south";
  climate: HomeClimate | null;
  traits: string[];
  /** Equipment the detection saw: garage, basement, garden. */
  features?: string[];
}

/** Per-template recommendation fields of the templates read. */
export interface TemplateRecommendation {
  recommended?: boolean;
  reasons?: string[];
  dwelling_mismatch?: boolean;
}

export function dwellingLabel(kind: string, lang: string): string {
  return t(`home_dwelling_${kind === "house" || kind === "apartment" ? kind : "unknown"}`, lang);
}

/** "Deutschland" for "DE" in German; falls back to the code. */
export function countryName(code: string | null | undefined, lang: string): string {
  if (!code) return "";
  try {
    return new Intl.DisplayNames([lang], { type: "region" }).of(code) || code;
  } catch {
    return code;
  }
}

/** Detection reason codes from helpers/home_profile.py → readable phrases.
 *  Several codes share one phrase (a garage area and a garage door). */
const DETECTION_KEYS: Record<string, string> = {
  floors: "home_reason_floors",
  basement_floor: "home_reason_basement",
  area_basement: "home_reason_basement",
  area_garden: "home_reason_garden",
  area_shed: "home_reason_shed",
  area_driveway: "home_reason_driveway",
  area_garage: "home_reason_garage",
  entity_garage: "home_reason_garage",
  area_attic: "home_reason_attic",
  entity_lawn_mower: "home_reason_lawn_mower",
  entity_gate: "home_reason_gate",
  area_balcony: "home_reason_balcony",
  small_home: "home_reason_small_home",
};

export function detectionReasons(codes: readonly string[], lang: string): string {
  const phrases: string[] = [];
  for (const code of codes) {
    const key = DETECTION_KEYS[code];
    if (!key) continue;
    const phrase = t(key, lang);
    if (!phrases.includes(phrase)) phrases.push(phrase);
  }
  return phrases.join(", ");
}

/** A recommendation reason (starter / seen feature / climate trait /
 *  country) as a chip label. */
export function recommendationReason(code: string, lang: string, country: string | null): string {
  if (code === "starter") return t("home_reason_starter", lang);
  if (code === "country") return t("home_reason_country", lang).replace("{country}", countryName(country, lang));
  if (code.startsWith("feature_")) {
    // feature_garage → the same phrase the detection uses ("a garage").
    const key = DETECTION_KEYS[`area_${code.slice("feature_".length)}`];
    return t("home_reason_feature", lang).replace("{feature}", key ? t(key, lang) : code);
  }
  return t(`home_trait_${code}`, lang);
}
