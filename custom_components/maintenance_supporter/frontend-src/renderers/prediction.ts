/** Sensor prediction section renderer. */

import { html, nothing } from "lit";
import { t, formatDate } from "../styles";
import type { MaintenanceTask, AdvancedFeatures } from "../types";

export function renderPredictionSection(task: MaintenanceTask, lang: string, features: AdvancedFeatures) {
  const hasDegradation = task.degradation_trend != null && task.degradation_trend !== "insufficient_data";
  const hasThreshold = task.days_until_threshold != null;
  const hasEnv = task.environmental_factor != null && task.environmental_factor !== 1.0;
  if (!hasDegradation && !hasThreshold && !hasEnv) return nothing;

  const trendIcon = task.degradation_trend === "rising"
    ? "M16,6L18.29,8.29L13.41,13.17L9.41,9.17L2,16.59L3.41,18L9.41,12L13.41,16L19.71,9.71L22,12V6H16Z"
    : task.degradation_trend === "falling"
      ? "M16,18L18.29,15.71L13.41,10.83L9.41,14.83L2,7.41L3.41,6L9.41,12L13.41,8L19.71,14.29L22,12V18H16Z"
      : "M22,12L18,8V11H3V13H18V16L22,12Z";

  return html`
    <div class="prediction-section">
      ${task.sensor_prediction_urgency ? html`
        <div class="prediction-urgency-banner">
          <ha-svg-icon path="M1,21H23L12,2L1,21M12,18A1,1 0 0,1 11,17A1,1 0 0,1 12,16A1,1 0 0,1 13,17A1,1 0 0,1 12,18M13,15H11V10H13V15Z"></ha-svg-icon>
          ${t("sensor_prediction_urgency", lang).replace("{days}", String(Math.round(task.days_until_threshold || 0)))}
        </div>
      ` : nothing}
      <div class="prediction-title">
        <ha-svg-icon path="M2,2V4H7V2H2M22,2V4H13V2H22M7,7V9H2V7H7M22,7V9H13V7H22M7,12V14H2V12H7M22,12V14H13V12H22M7,17V19H2V17H7M22,17V19H13V17H22M9,2V19L12,22L15,19V2H9M11,4H13V17.17L12,18.17L11,17.17V4Z"></ha-svg-icon>
        ${t("sensor_prediction", lang)}
      </div>
      <div class="prediction-grid">
        ${hasDegradation ? html`
          <div class="prediction-item">
            <ha-svg-icon path="${trendIcon}"></ha-svg-icon>
            <span class="prediction-label">${t("degradation_trend", lang)}</span>
            <span class="prediction-value ${task.degradation_trend}">${t("trend_" + task.degradation_trend, lang)}</span>
            ${task.degradation_rate != null ? html`<span class="prediction-rate">${task.degradation_rate > 0 ? "+" : ""}${Math.abs(task.degradation_rate) >= 10 ? Math.round(task.degradation_rate).toLocaleString() : task.degradation_rate.toFixed(1)} ${task.trigger_entity_info?.unit_of_measurement || ""}/${t("day_short", lang)}</span>` : nothing}
          </div>
        ` : nothing}
        ${hasThreshold ? html`
          <div class="prediction-item">
            <ha-svg-icon path="M12,20A7,7 0 0,1 5,13A7,7 0 0,1 12,6A7,7 0 0,1 19,13A7,7 0 0,1 12,20M12,4A9,9 0 0,0 3,13A9,9 0 0,0 12,22A9,9 0 0,0 21,13A9,9 0 0,0 12,4M12.5,8H11V14L15.75,16.85L16.5,15.62L12.5,13.25V8M7.88,3.39L6.6,1.86L2,5.71L3.29,7.24L7.88,3.39M22,5.72L17.4,1.86L16.11,3.39L20.71,7.25L22,5.72Z"></ha-svg-icon>
            <span class="prediction-label">${t("days_until_threshold", lang)}</span>
            <span class="prediction-value prediction-days${task.days_until_threshold === 0 ? " exceeded" : task.sensor_prediction_urgency ? " urgent" : ""}">${task.days_until_threshold === 0 ? t("threshold_exceeded", lang) : "~" + Math.round(task.days_until_threshold!) + " " + t("days", lang)}</span>
            ${task.threshold_prediction_date ? html`<span class="prediction-date">${formatDate(task.threshold_prediction_date, lang)}</span>` : nothing}
            ${task.threshold_prediction_confidence ? html`<span class="confidence-dot ${task.threshold_prediction_confidence}"></span>` : nothing}
          </div>
        ` : nothing}
        ${hasEnv && features.environmental ? html`
          <div class="prediction-item">
            <ha-svg-icon path="M15,13V5A3,3 0 0,0 12,2A3,3 0 0,0 9,5V13A5,5 0 0,0 7,17A5,5 0 0,0 12,22A5,5 0 0,0 17,17A5,5 0 0,0 15,13M12,4A1,1 0 0,1 13,5V8H11V5A1,1 0 0,1 12,4Z"></ha-svg-icon>
            <span class="prediction-label">${t("environmental_adjustment", lang)}</span>
            <span class="prediction-value">${task.environmental_factor!.toFixed(2)}x</span>
            ${task.environmental_entity ? html`<span class="prediction-entity">${task.environmental_entity}</span>` : nothing}
          </div>
        ` : nothing}
      </div>
    </div>
  `;
}
