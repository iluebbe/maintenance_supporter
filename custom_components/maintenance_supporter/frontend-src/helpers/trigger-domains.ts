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
  "counter",
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
  "plant",
  "input_select",
  "select",
  "input_datetime",
  "date",
  "datetime",
  "timer",
  "update",
];

/** Environmental-entity picker filter — mirrors the options flow's adaptive
 *  step (EntitySelectorConfig: domain sensor). Any sensor with statistics
 *  feeds the correlation (fine dust for an air filter, soil moisture); the
 *  former device_class filter (temperature/humidity/pressure) hid them from
 *  the dialog since its picker replaced the free text (2.56.0). */
export const ENVIRONMENTAL_PICKER_DOMAINS = ["sensor"];
