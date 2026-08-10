/** Domains offered by the trigger entity pickers (#129).
 *
 *  MUST mirror TRIGGER_ENTITY_DOMAINS in config_flow_trigger.py — the config
 *  flow and the dialog are two UIs over the same field, and a domain usable
 *  in one must be pickable in the other. A parity test regex-parses this
 *  file against the Python list (test_frontend_const_parity.py).
 */
export const TRIGGER_PICKER_DOMAINS = [
  "sensor",
  "binary_sensor",
  "number",
  "input_number",
  "input_boolean",
  "switch",
  "climate",
  "vacuum",
  "cover",
  "fan",
  "light",
  "water_heater",
  "humidifier",
  "media_player",
  "weather",
  "air_quality",
  "valve",
  "lawn_mower",
  "lock",
];

/** Environmental-entity picker filter — mirrors the options flow's adaptive
 *  step (EntitySelectorConfig: domain sensor, device_class temperature/
 *  humidity/pressure). */
export const ENVIRONMENTAL_PICKER_DOMAINS = ["sensor"];
export const ENVIRONMENTAL_PICKER_DEVICE_CLASSES = ["temperature", "humidity", "pressure"];
