// A year in the life of a household, in ten minutes — Home Assistant under
// libfaketime, driven week by week through the public API.
//
//   node e2e/timelapse/run.mjs            (needs the faketime image, see below)
//
// Starts one container from TIMELAPSE_IMAGE (docker/Dockerfile.ha-faketime —
// libfaketime in LD_PRELOAD when FAKETIME_ENABLED is set) with its clock a
// year back, sets up a household (seed.json: objects, parts, rotation,
// phases, adaptive scheduling, seasons, readings), the demo robots
// (docker/demo_roborock_fixture, wearing down with the clock) adopted from
// the integration catalog, and a battery fleet. Then, week by week: the clock
// moves on, sensors drift (boiler pressure, dishwasher cycles, batteries),
// the coordinators refresh through the real path, and the household acts —
// completes (feedback, photos, readings, parts, costs), skips, misses,
// postpones, snoozes, swaps batteries, pauses the pool for the winter, goes
// on vacation. History, notifications, rotations, phases, fleet learning and
// buy reminders all come out of the product's own code paths instead of a
// hand-written import. At the end the clock returns to real time and the run
// checks that the traces exist.
//
// The instance is kept (KEEP=0 removes it). MIGRATE=1 then moves it to a
// fresh instance with e2e/migration/run.mjs and compares everything.
//
// Env: TIMELAPSE_IMAGE (docker-homeassistant-dev:latest), TIMELAPSE_PORT
// (8163), WEEKS (52), SEED (1, the PRNG seed).
//
// Faketime limits: interval timers run on the real monotonic clock
// (DONT_FAKE_MONOTONIC=1), so the weekly steps refresh the coordinators
// explicitly and wait out HA's 10 s refresh cooldown; daily jobs (retention
// sweep, 08:00 digest) do not fire on a jump and are not exercised here.
import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { addIntegration, connect, docker, onboard, setState, sleep, upload, waitForHttp } from "../migration/lib.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO = resolve(HERE, "..", "..");
const RUN = join(HERE, ".run");
const CONFIG = join(RUN, "config");
const NAME = "ms-timelapse";
const IMAGE = process.env.TIMELAPSE_IMAGE || "docker-homeassistant-dev:latest";
const PORT = Number(process.env.TIMELAPSE_PORT || 8163);
const WEEKS = Number(process.env.WEEKS || 52);
const BASE = `http://127.0.0.1:${PORT}`;
const USER = "owner";
const PASS = "migration-pass-1";
const DAY = 864e5;

const log = (...a) => console.log("[timelapse]", ...a);

// Deterministic "household" (mulberry32).
let prngState = Number(process.env.SEED || 1) >>> 0;
function rand() {
  prngState = (prngState + 0x6d2b79f5) >>> 0;
  let t = prngState;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

// ── the clock ────────────────────────────────────────────────────────────────
const START = new Date(Date.UTC(new Date().getUTCFullYear(), new Date().getUTCMonth(), new Date().getUTCDate()) - WEEKS * 7 * DAY);
let now = new Date(START);
// The clock file lives in the container's own file system, not in the bind
// mount: libfaketime re-reads it on every clock call (FAKETIME_NO_CACHE), and
// on a Windows host a bind-mounted file is briefly missing while it is
// replaced — libfaketime then falls back to "+0", fails to parse it in
// absolute mode and aborts Home Assistant. Inside the container a rename is
// atomic. The trailing newline is required too.
const CLOCK_FILE = "/faketime.txt";
function writeClock(spec) {
  docker("exec", NAME, "sh", "-c", `printf '%s\\n' '${spec}' > ${CLOCK_FILE}.tmp && mv ${CLOCK_FILE}.tmp ${CLOCK_FILE}`);
}
function setClock(date) {
  now = date;
  // Noon, container time: clear of midnight and DST.
  writeClock(`@${date.toISOString().slice(0, 10)} 12:00:00`);
}
const isoDay = (d) => d.toISOString().slice(0, 10);

// ── setup ────────────────────────────────────────────────────────────────────
function start() {
  try {
    rmSync(RUN, { recursive: true, force: true });
  } catch {
    docker("run", "--rm", "--entrypoint", "rm", "-v", `${HERE}:/m`, IMAGE, "-rf", "/m/.run");
  }
  mkdirSync(CONFIG, { recursive: true });
  writeFileSync(join(CONFIG, "configuration.yaml"), "default_config:\nlogger:\n  default: warning\n");
  docker("rm", "-f", NAME);
  // Created, the clock file copied in, THEN started: Home Assistant's first
  // call already reads the faked date.
  docker(
    "create", "--name", NAME, "-p", `${PORT}:8123`, "-e", "TZ=Europe/Berlin",
    "-e", "FAKETIME_ENABLED=true", `-e`, `FAKETIME_TIMESTAMP_FILE=${CLOCK_FILE}`,
    "-e", "FAKETIME_NO_CACHE=1", "-e", "DONT_FAKE_MONOTONIC=1", "-e", "ROBOROCK_DEMO_WEAR=1",
    "-v", `${CONFIG}:/config`,
    "-v", `${join(REPO, "custom_components", "maintenance_supporter")}:/config/custom_components/maintenance_supporter:ro`,
    "-v", `${join(REPO, "docker", "demo_roborock_fixture")}:/config/custom_components/roborock:ro`,
    IMAGE,
  );
  const initial = join(RUN, "faketime.txt");
  writeFileSync(initial, `@${START.toISOString().slice(0, 10)} 12:00:00\n`);
  docker("cp", initial, `${NAME}:${CLOCK_FILE}`);
  docker("start", NAME);
  now = new Date(START);
}

const STATE = {
  pressure: 1.8,
  cycles: 0,
  readings: { cold: 812.4, power: 20431 },
  batteries: {
    // %/week: a lock and a remote go through two sets a year — enough swaps
    // for the fleet to log intervals.
    "sensor.hall_smoke_battery": { level: 70, rate: 1.8, type: "9V", qty: 1 },
    "sensor.kitchen_smoke_battery": { level: 55, rate: 2.2, type: "9V", qty: 1 },
    "sensor.door_lock_battery": { level: 90, rate: 3.6, type: "AA", qty: 4 },
    "sensor.garage_remote_battery": { level: 40, rate: 2.9, type: "CR2032", qty: 1 },
  },
};

async function pushSensors(api) {
  await setState(BASE, api.token, "sensor.boiler_pressure", STATE.pressure.toFixed(2), { unit_of_measurement: "bar", device_class: "pressure" });
  await setState(BASE, api.token, "sensor.dishwasher_cycles", String(STATE.cycles), { state_class: "total_increasing" });
  for (const [id, b] of Object.entries(STATE.batteries)) {
    await setState(BASE, api.token, id, String(Math.max(0, Math.round(b.level))), {
      device_class: "battery", unit_of_measurement: "%", battery_type: b.type, battery_quantity: b.qty,
      battery_last_replaced: b.replaced || isoDay(new Date(START.getTime() - 200 * DAY)),
    });
  }
}

async function refresh(api) {
  // One entity per object (and the robots): their coordinators refresh at the
  // faked time through CoordinatorEntity.async_update — HA's own path.
  const ids = [...api.refreshIds];
  await api.ws.call({ type: "call_service", domain: "homeassistant", service: "update_entity", target: { entity_id: ids } }).catch(() => null);
  await sleep(10500);
}

async function objects(api) {
  return (await api.ws.call({ type: "maintenance_supporter/objects" })).objects || [];
}

// ── the household ────────────────────────────────────────────────────────────
const COUNT = { complete: 0, skip: 0, missed: 0, postpone: 0, snooze: 0, photo: 0, swap: 0, errors: 0 };

async function complete(api, o, t) {
  const req = new Set(t.required_completion_fields || []);
  const msg = { type: "maintenance_supporter/task/complete", entry_id: o.entry_id, task_id: t.id, notes: "done" };
  if (req.has("cost") || rand() < 0.3) msg.cost = Math.round(5 + rand() * 60);
  if (req.has("duration") || rand() < 0.3) msg.duration = Math.round(10 + rand() * 50);
  if ((t.readings || []).length) {
    STATE.readings.cold += 9 + rand() * 4;
    STATE.readings.power += 250 + rand() * 60;
    msg.reading_values = Object.fromEntries(t.readings.map((s) => [s.id, Math.round((s.id === "cold" ? STATE.readings.cold : STATE.readings.power) * 10) / 10]));
  }
  if (t.adaptive_config?.enabled) msg.feedback = ["needed", "needed", "not_needed", "not_sure"][Math.floor(rand() * 4)];
  if (req.has("photo") || rand() < 0.08) {
    const photo = await upload(BASE, api.token, o.entry_id, `photo-${isoDay(now)}.jpg`, "image/jpeg", Buffer.from([0xff, 0xd8, 0xff, 0xe0, Math.floor(rand() * 255)]), ["photo"]);
    msg.photo_doc_ids = [photo.id];
    COUNT.photo++;
  }
  if (t.name === "Top up the pressure") STATE.pressure = 1.8;
  if (t.name === "Refill salt") STATE.saltDone = true;
  await api.ws.call(msg).then(
    () => COUNT.complete++,
    async (e) => {
      // A phase can demand details its task does not (the mower's "replace"
      // wants the cost) — answer the refusal like a person would.
      if (!String(e.message).includes("completion_details_required")) {
        COUNT.errors++;
        log("complete refused:", t.name, String(e.message).slice(0, 120));
        return;
      }
      await api.ws.call({ ...msg, cost: msg.cost ?? 25, duration: msg.duration ?? 20, notes: msg.notes || "done" }).then(
        () => COUNT.complete++,
        (e2) => { COUNT.errors++; log("complete refused twice:", t.name, String(e2.message).slice(0, 120)); },
      );
    },
  );
}

async function act(api, week) {
  for (const o of await objects(api)) {
    if (o.object.paused_at) continue;
    for (const t of o.tasks) {
      if (t.archived || t.enabled === false) continue;
      const r = rand();
      if (t.status === "triggered" || t.status === "overdue") {
        if (r < 0.78) await complete(api, o, t);
        else if (r < 0.86 && t.allow_skip !== false) {
          await api.ws.call({ type: "maintenance_supporter/task/skip", entry_id: o.entry_id, task_id: t.id, reason: "no time this week" }).then(() => COUNT.skip++, () => COUNT.errors++);
        } else if (r < 0.9 && t.allow_skip !== false) {
          await api.ws.call({ type: "maintenance_supporter/task/skip", entry_id: o.entry_id, task_id: t.id, as_missed: true }).then(() => COUNT.missed++, () => COUNT.errors++);
        }
      } else if (t.status === "due_soon") {
        if (r < 0.3) await complete(api, o, t);
        else if (r < 0.38 && t.next_due) {
          const until = isoDay(new Date(Date.parse(t.next_due) + 7 * DAY));
          await api.ws.call({ type: "maintenance_supporter/task/postpone", entry_id: o.entry_id, task_id: t.id, until }).then(() => COUNT.postpone++, () => COUNT.errors++);
        } else if (r < 0.43) {
          await api.ws.call({ type: "maintenance_supporter/task/snooze", entry_id: o.entry_id, task_id: t.id }).then(() => COUNT.snooze++, () => COUNT.errors++);
        }
      }
    }
  }
  // Every quarter: ask for the adaptive analysis of the tasks that learn.
  if (week % 13 === 0) {
    for (const o of await objects(api)) {
      for (const t of o.tasks.filter((x) => x.adaptive_config?.enabled)) {
        await api.ws.call({ type: "maintenance_supporter/task/analyze_interval", entry_id: o.entry_id, task_id: t.id }).catch(() => null);
      }
    }
  }
}

function drift() {
  STATE.pressure -= 0.04 + rand() * 0.03;
  STATE.cycles += 4 + Math.floor(rand() * 4);
  for (const b of Object.values(STATE.batteries)) {
    b.level -= b.rate * (0.8 + rand() * 0.4);
    if (b.level < 12 && rand() < 0.6) {
      b.level = 100;
      b.replaced = isoDay(now);
      COUNT.swap++;
    }
  }
}

async function seasons(api, week) {
  const month = now.getUTCMonth() + 1;
  const pool = (await objects(api)).find((o) => o.object.name === "Pool pump");
  if (!pool) return;
  const winter = month >= 11 || month <= 3;
  if (winter && !pool.object.paused_at) {
    const until = isoDay(new Date(Date.UTC(now.getUTCFullYear() + (month >= 11 ? 1 : 0), 3, 1)));
    await api.ws.call({ type: "maintenance_supporter/object/pause", entry_id: pool.entry_id, until }).catch((e) => log("pause:", e.message));
  } else if (!winter && pool.object.paused_at) {
    await api.ws.call({ type: "maintenance_supporter/object/resume", entry_id: pool.entry_id }).catch((e) => log("resume:", e.message));
  }
  if (week === Math.floor(WEEKS * 0.55)) {
    const startV = isoDay(new Date(now.getTime() + 7 * DAY));
    const endV = isoDay(new Date(now.getTime() + 21 * DAY));
    await api.ws.call({ type: "maintenance_supporter/vacation/update", enabled: true, start: startV, end: endV, buffer_days: 1 }).catch((e) => log("vacation:", e.message));
    log(`vacation ${startV} → ${endV}`);
  }
}

// ── main ─────────────────────────────────────────────────────────────────────
async function main() {
  start();
  await waitForHttp(BASE + "/manifest.json");
  const token = await onboard(BASE, USER, PASS);
  const ws = await connect(BASE, token);
  const probe = await fetch(BASE + "/api/template", { method: "POST", headers: { authorization: "Bearer " + token, "content-type": "application/json" }, body: JSON.stringify({ template: "{{ now().date() }}" }) }).then((r) => r.text());
  if (probe.trim() !== isoDay(START)) throw new Error(`faketime is not active: HA says ${probe}, expected ${isoDay(START)} (use the faketime image)`);
  log(`clock at ${probe.trim()} — ${WEEKS} weeks to go`);
  const lived = await ws.call({ type: "auth/long_lived_access_token", client_name: "timelapse", lifespan: 3650 });
  const api = { ws, token: lived, refreshIds: new Set() };

  await addIntegration(BASE, lived);
  await addIntegration(BASE, lived, "roborock");
  for (const person of ["Anna", "Ben"]) await ws.call({ type: "config/auth/create", name: person, group_ids: ["system-users"] });
  await pushSensors(api);
  const seed = readFileSync(join(HERE, "seed.json"), "utf8");
  const imported = await ws.call({ type: "maintenance_supporter/json/import", json_content: seed });
  if (imported.unmatched_users?.length || imported.errors?.length) throw new Error("seed import: " + JSON.stringify(imported));
  await sleep(6000);

  // The catalog: adopt every suggested robot duty (reset buttons included).
  const setups = (await ws.call({ type: "maintenance_supporter/integration_setups/discover" })).setups || [];
  const robots = setups.filter((s) => s.integration === "roborock" && s.tasks.length);
  const adopted = await ws.call({ type: "maintenance_supporter/integration_setups/adopt", selections: robots.map((s) => ({ device_id: s.device_id })) });
  log(`adopted ${adopted.tasks_created} robot duties on ${robots.length} robots`);
  // The battery fleet over the Battery-Notes-shaped sensors.
  await ws.call({ type: "maintenance_supporter/battery_fleet/setup" }).catch((e) => log("fleet setup:", e.message));
  await sleep(6000);

  // What to refresh each week: one task sensor per object, and the robots.
  const reg = await ws.call({ type: "config/entity_registry/list" });
  const perEntry = new Map();
  for (const e of reg) {
    if (e.platform === "maintenance_supporter" && e.entity_id.startsWith("sensor.") && e.config_entry_id && !perEntry.has(e.config_entry_id)) perEntry.set(e.config_entry_id, e.entity_id);
    if (e.platform === "roborock" && e.entity_id.startsWith("sensor.")) api.refreshIds.add(e.entity_id);
  }
  for (const id of perEntry.values()) api.refreshIds.add(id);

  let notifications = 0;
  const notificationKinds = {};
  await ws.call({ type: "subscribe_events", event_type: "maintenance_supporter_notification" });
  ws.onEvent = (ev) => {
    notifications++;
    const kind = ev?.data?.kind || ev?.data?.notification_type || "?";
    notificationKinds[kind] = (notificationKinds[kind] || 0) + 1;
  };

  for (let week = 1; week <= WEEKS; week++) {
    setClock(new Date(START.getTime() + week * 7 * DAY));
    drift();
    await pushSensors(api);
    await seasons(api, week);
    await refresh(api);
    await act(api, week);
    if (week % 4 === 0) log(`week ${week} (${isoDay(now)}): ${JSON.stringify(COUNT)}`);
  }

  writeClock("+0");
  await refresh(api);
  await summarize(api, { notifications, notificationKinds });
  ws.close();

  if (process.env.MIGRATE === "1") {
    log("moving the year to a fresh instance (e2e/migration/run.mjs)");
    execFileSync("node", [join(REPO, "e2e", "migration", "run.mjs")], {
      stdio: "inherit",
      env: { ...process.env, SOURCE_CONTAINER: NAME, SOURCE_URL: BASE, SOURCE_USER: USER, SOURCE_PASS: PASS, MIGRATION_IMAGE: IMAGE, SOURCE_CHMOD: "1" },
    });
  }
  if (process.env.KEEP === "0") docker("rm", "-f", NAME);
}

async function summarize(api, { notifications, notificationKinds }) {
  const exported = JSON.parse((await api.ws.call({ type: "maintenance_supporter/export", format: "json", include_history: true })).data);
  const byType = {};
  let phasesDone = 0;
  let buyDone = 0;
  let robotDone = 0;
  for (const o of exported.objects) {
    for (const t of o.tasks) {
      for (const h of t.history || []) {
        byType[h.type] = (byType[h.type] || 0) + 1;
        if (h.type === "completed" && h.phase_id) phasesDone++;
        // A completed buy reminder keeps its history but loses its part link.
        if (h.type === "completed" && (t.part_ref || /^Buy /.test(t.name))) buyDone++;
        if (h.type === "completed" && t.origin?.kind === "integration") robotDone++;
      }
    }
  }
  // The fleet's replacement log (a batteries' swap dates) — in the export.
  const fleetTask = exported.objects.flatMap((o) => o.tasks).find((t) => t.battery_fleet_task);
  const learned = Object.values(fleetTask?.battery_replacements || {}).filter((b) => (b.dates || []).length >= 2).length;
  const summary = { byType, phasesDone, buyDone, robotDone, notifications, notificationKinds, household: COUNT, fleetBatteriesWithTwoSwaps: learned };
  writeFileSync(join(RUN, "summary.json"), JSON.stringify(summary, null, 2));
  log("summary", JSON.stringify(summary));
  const missing = [];
  if ((byType.completed || 0) < 60) missing.push("≥60 completions");
  if (!byType.skipped) missing.push("a skip");
  if (!byType.missed) missing.push("a missed occurrence");
  if (!byType.triggered) missing.push("a trigger episode");
  if (!phasesDone) missing.push("a phase completion");
  if (!buyDone) missing.push("a completed buy reminder");
  if (!robotDone) missing.push("a completed robot duty (reset pressed)");
  if (!notifications) missing.push("a notification event");
  if (!COUNT.swap) missing.push("a battery swap");
  if (!learned) missing.push("a battery logged with two swap dates");
  if (COUNT.errors > COUNT.complete / 5) missing.push(`fewer refused actions (${COUNT.errors})`);
  if (missing.length) {
    console.error("[timelapse] FAILED — the year left no trace of: " + missing.join(", "));
    process.exit(1);
  }
  log("OK — a year of real-shaped data; instance kept as " + NAME + " on " + BASE);
}

main().catch((err) => {
  console.error("[timelapse] ERROR:", err.message);
  process.exit(2);
});
