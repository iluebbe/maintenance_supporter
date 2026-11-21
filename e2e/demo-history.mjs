/** The docs demo's sensor history, made under a fake clock: real single
 *  states in the recorder, as in a real home, not only the hourly statistics
 *  shots-demo.mjs imports.
 *
 *    node e2e/demo-history.mjs        (on a wiped docker/.shots-config)
 *
 *  Runs between the wipe of the ha-shots config and shots-demo.mjs:
 *
 *  1. Stops ha-shots and makes sure the demo's configuration.yaml keeps the
 *     states long enough (`recorder: purge_keep_days: 60`; the nightly purge
 *     would cut them to ten days).
 *  2. Creates the throwaway container ms-demo-history: the ha-shots image
 *     and mounts, plus docker/demo_history_fixture as
 *     custom_components/demo_history and a copy of configuration.yaml with
 *     `demo_history:`. Its clock (libfaketime) starts DAYS back and runs SPEED
 *     times faster. The clock is given once, as FAKETIME in the environment,
 *     with FAKETIME_DONT_RESET: read from a clock file (as the timelapse
 *     does), libfaketime started its fast clock over on every re-read and the
 *     time jumped back and forth (trial of 2026-11-21); rewriting such a file
 *     during a run is also what crashed Home Assistant in the large timelapse.
 *  3. The fixture writes the demo sensors along the curves the docs show
 *     (template sensors, the battery fleet's states, the pool pump, the robots
 *     wearing down). This script follows its log and stops the container once
 *     the fixture is done, half a fake day before the fake clock would reach
 *     the real one, so nothing is recorded in the future.
 *  4. Counts the recorded states per sensor (read only) and fails when a
 *     curve is missing.
 *
 *  ha-shots stays stopped; the sweep starts it again, and shots-demo.mjs
 *  then onboards and seeds on top of this history.
 *
 *  Env: DAYS (35), SPEED (2880: a fake day every 30 real seconds), FORCE=1 to
 *  run on a config that is already onboarded, SHOTS_CONFIG (a config folder
 *  other than docker/.shots-config, for a trial run). */
import { execFileSync, spawnSync } from "node:child_process";
import { appendFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO = resolve(HERE, "..");
// SHOTS_CONFIG: another config folder, for a trial run next to the demo.
const CFG = resolve(process.env.SHOTS_CONFIG || join(REPO, "docker", ".shots-config"));
const NAME = "ms-demo-history";
// The image of the ha-shots container itself, not the tag: a tag moved on to
// a newer Home Assistant writes storage files the older ha-shots can no longer
// read ("Storage file http has version 2", 2026-11-21).
const shotsImage = spawnSync("docker", ["inspect", "ha-shots", "--format", "{{.Image}}"], { encoding: "utf8" });
const IMAGE = process.env.SHOTS_IMAGE || (shotsImage.status === 0 && shotsImage.stdout.trim()) || "docker-homeassistant-dev:latest";
const DAYS = Number(process.env.DAYS || 35);
const SPEED = Number(process.env.SPEED || 2880);
const DAY = 864e5;
const log = (...a) => console.log("[history]", ...a);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function docker(...args) {
  const r = spawnSync("docker", args, { encoding: "utf8" });
  if (r.status !== 0) throw new Error(`docker ${args[0]} failed: ${(r.stderr || r.stdout || "").trim().slice(0, 400)}`);
  return (r.stdout || "") + (r.stderr || "");
}
const dockerQuiet = (...args) => spawnSync("docker", args, { encoding: "utf8" });

// ── 1. the demo config ───────────────────────────────────────────────────────
const yamlPath = join(CFG, "configuration.yaml");
if (!existsSync(yamlPath)) throw new Error(`${yamlPath} is missing`);
if (existsSync(join(CFG, ".storage", "onboarding")) && process.env.FORCE !== "1") {
  throw new Error("docker/.shots-config is already onboarded: wipe it first (the sweep does), or FORCE=1");
}
dockerQuiet("stop", "ha-shots");
let yaml = readFileSync(yamlPath, "utf8");
if (!/^recorder:/m.test(yaml)) {
  const eol = yaml.includes("\r\n") ? "\r\n" : "\n";
  appendFileSync(yamlPath, `${yaml.endsWith(eol) ? "" : eol}recorder:${eol}  purge_keep_days: 60${eol}`);
  yaml = readFileSync(yamlPath, "utf8");
  log("configuration.yaml: recorder keeps 60 days");
}
const work = join(tmpdir(), "ms-demo-history");
mkdirSync(work, { recursive: true });
const historyYaml = join(work, "configuration.yaml");
writeFileSync(historyYaml, `${yaml.replace(/\s*$/, "")}\ndemo_history:\n`);
// The fixture's mount point under the read-only custom_components mount
// (gitignored, like the robots' and the plants').
mkdirSync(join(REPO, "custom_components", "demo_history"), { recursive: true });

// ── 2. the container and its clock ───────────────────────────────────────────
const t0 = Date.now();
const start = new Date(t0 - DAYS * DAY);
// The fake clock catches up with the real one when start + SPEED·t = t0 + t.
const end = new Date(t0 + (DAYS * DAY) / (SPEED - 1));
// "@" is read in the container's zone.
const berlin = new Intl.DateTimeFormat("sv-SE", {
  timeZone: "Europe/Berlin", year: "numeric", month: "2-digit", day: "2-digit",
  hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false,
}).format(start);
dockerQuiet("rm", "-f", NAME);
docker(
  "create", "--name", NAME,
  "-e", "TZ=Europe/Berlin",
  "-e", "FAKETIME_ENABLED=true", "-e", `FAKETIME=@${berlin} x${SPEED}`,
  "-e", "FAKETIME_DONT_RESET=1", "-e", "DONT_FAKE_MONOTONIC=1",
  "-e", "ROBOROCK_DEMO_WEAR=1", "-e", `DEMO_HISTORY_END=${end.toISOString()}`,
  "-v", `${CFG}:/config`,
  "-v", `${join(REPO, "custom_components")}:/config/custom_components:ro`,
  "-v", `${join(REPO, "docker", "demo_roborock_fixture")}:/config/custom_components/roborock:ro`,
  "-v", `${join(REPO, "docker", "demo_plant_fixture")}:/config/custom_components/plant:ro`,
  "-v", `${join(REPO, "docker", "demo_history_fixture")}:/config/custom_components/demo_history:ro`,
  "-v", `${historyYaml}:/config/configuration.yaml:ro`,
  IMAGE,
);
docker("start", NAME);
log(`clock @${berlin} x${SPEED}: ${DAYS} days in ~${Math.round((DAYS * DAY) / (SPEED - 1) / 60e3)} min, curves end ${end.toISOString()}`);

// ── 3. follow the fixture ────────────────────────────────────────────────────
const deadline = Date.now() + (DAYS * DAY) / (SPEED - 1) + 10 * 60e3;
let lastDay = null, shown = 0, done = null;
const seen = new Set();
try {
  while (!done) {
    if (Date.now() > deadline) throw new Error("the fixture did not finish in time");
    await sleep(3000);
    const running = dockerQuiet("inspect", NAME, "--format", "{{.State.Running}}").stdout.trim();
    const out = docker("logs", "--tail", "200", NAME);
    if (running !== "true") throw new Error(`the container stopped:\n${out.split("\n").slice(-25).join("\n")}`);
    // The tail repeats lines read before: each one counts once.
    for (const line of out.split("\n")) {
      if (!line.includes("[custom_components.demo_history]") || seen.has(line)) continue;
      seen.add(line);
      const day = /\bday (\d{4}-\d{2}-\d{2})/.exec(line);
      if (day && lastDay && day[1] < lastDay) throw new Error(`the fake clock went back from ${lastDay} to ${day[1]}`);
      if (day && day[1] !== lastDay) {
        lastDay = day[1];
        if (shown++ % 7 === 0) log("fake day", lastDay);
      }
      if (/\bdone at /.test(line)) done = line.slice(line.indexOf("done at"));
      if (/ERROR|Traceback/.test(line)) log("fixture:", line.trim());
    }
  }
} catch (e) {
  // A container left running would go on writing into the demo's database.
  dockerQuiet("rm", "-f", NAME);
  throw e;
}
log(done);
docker("stop", "-t", "30", NAME);
const errors = docker("logs", NAME).split("\n").filter((l) => /ERROR.*(demo_history|roborock|recorder)/.test(l));
docker("rm", NAME);
if (errors.length) log("errors in the log:\n" + errors.slice(0, 10).join("\n"));

// ── 4. what the recorder holds ───────────────────────────────────────────────
const probe = `
import json, sqlite3, time
# Home Assistant is stopped; read only in spirit (SQLite in WAL mode needs
# a writable folder even to read).
db = sqlite3.connect("/config/home-assistant_v2.db")
rows = db.execute("""
  select m.entity_id, count(*), min(s.last_updated_ts), max(s.last_updated_ts)
  from states s join states_meta m on s.metadata_id = m.metadata_id
  where m.entity_id like 'sensor.%' or m.entity_id like 'input_boolean.%'
  group by m.entity_id""").fetchall()
print(json.dumps(rows))`;
const rows = JSON.parse(execFileSync("docker", ["run", "--rm", "--entrypoint", "python3", "-v", `${CFG}:/config`, IMAGE, "-c", probe], { encoding: "utf8" }));
const want = [
  "sensor.hvac_airflow", "sensor.pump_pressure", "sensor.pump_runtime", "sensor.water_meter",
  "sensor.smoke_detector_hall_battery", "sensor.smoke_detector_kitchen_battery",
  "sensor.kitchen_smoke_battery_plus", "sensor.patio_door_battery_plus", "sensor.video_doorbell_battery_plus",
  "input_boolean.pool_pump_power", "sensor.roborock_q7_main_brush_time_left", "sensor.roborock_s8_main_brush_time_left",
];
const now = Date.now() / 1e3;
const bad = [];
for (const id of want) {
  const r = rows.find(([e]) => e === id);
  const span = r ? (r[3] - r[2]) / 86400 : 0;
  log(`${id.padEnd(44)} ${r ? String(r[1]).padStart(5) : "    -"} states over ${span.toFixed(1)} days`);
  // A battery that loses a few percent a month changes a dozen times.
  if (!r || r[1] < 10 || span < DAYS - 3) bad.push(id);
  if (r && r[3] > now) bad.push(`${id} (a state in the future)`);
}
if (bad.length) throw new Error("history missing or short: " + bad.join(", "));
log(`OK: ${rows.length} entities with history; start ha-shots next (the sweep does)`);
