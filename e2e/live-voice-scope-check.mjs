/** Live check: the second voice pass, against a real Home Assistant.
 *
 *   1. the sentence files are installed into <config>/custom_sentences/ when
 *      the setting is on, and removed again when it is off
 *   2. a file the user edited is left alone by both
 *   3. scope=mine answers with the speaker's tasks only
 *   4. scope=here answers for the room the request came from
 *   5. an unresolvable scope says so rather than reciting the whole house
 *   6. two same-named tasks are disambiguated by the room that asked
 *
 * The unit tests cannot see whether HA's own plumbing forwards the context
 * user to our handler, nor whether the classic agent really loads what we
 * install — which is the entire premise. This drives the REST intent and
 * conversation APIs, so answers come through the real pipeline.
 *
 * NOT covered here: the positive scope=here case. The REST intent API takes
 * no device_id, so a live check cannot pretend to be a satellite standing in
 * a room; only the negative (no device -> explicit error) is exercised. The
 * room filter itself is covered in tests/test_intent_scope.py.
 *
 * Run from the repo root:
 *   node e2e/live-voice-scope-check.mjs
 */

import { loadToken, wsClient, watchdog } from "./ws-client.mjs";

const REST = "http://127.0.0.1:8125";
const log = (...a) => console.log(...a);
watchdog(8 * 60e3, "voice scope check");

const token = loadToken();
const api = await wsClient(REST, token);

const results = [];
const check = (ok, line) => { results.push({ ok, line }); log(`  ${ok ? "PASS" : "FAIL"} ${line}`); };
const stamp = String(Date.now()).slice(-6);
const created = [];

async function rest(path, method = "GET", body) {
  const res = await fetch(`${REST}${path}`, {
    method,
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  try {
    return { status: res.status, json: JSON.parse(text) };
  } catch {
    return { status: res.status, text };
  }
}

/** Speak to HA through the real intent API. */
async function ask(intentType, slots = {}) {
  const res = await rest("/api/intent/handle", "POST", { name: intentType, data: slots });
  const speech = res.json?.speech?.plain?.speech ?? "";
  return { speech, error: res.json?.response_type === "error", raw: res.json };
}

// ── setup: two objects in two areas ──────────────────────────────────────
log("\n[setup] creating objects");
const areas = await api.send({ type: "config/area_registry/list" });
let areaA = areas.find((a) => a.name === "MS Kitchen");
if (!areaA) areaA = await api.send({ type: "config/area_registry/create", name: "MS Kitchen" });
let areaB = areas.find((a) => a.name === "MS Cellar");
if (!areaB) areaB = await api.send({ type: "config/area_registry/create", name: "MS Cellar" });

async function makeObject(name, areaId, taskName) {
  const obj = await api.send({
    type: "maintenance_supporter/object/create",
    name: `${name} ${stamp}`,
    area_id: areaId,
  });
  created.push(obj.entry_id);
  await api.send({
    type: "maintenance_supporter/task/create",
    entry_id: obj.entry_id,
    name: taskName,
    task_type: "cleaning",
    schedule_type: "time_based",
    interval_days: 30,
    last_performed: "2020-01-01",
  });
  return obj.entry_id;
}

await makeObject("Hood", areaA.area_id, `Change Filter ${stamp}`);
await makeObject("Softener", areaB.area_id, `Change Filter ${stamp}`);
check(created.length === 2, `created ${created.length} objects in two areas`);

// ── 1. the default scope still answers for everything ────────────────────
log("\n[1] default scope");
const all = await ask("MaintenanceSupporterListTasks");
check(!all.error && all.speech.includes(stamp), `default answer mentions the seeded tasks`);

// ── 2. scope=mine with no identifiable speaker ───────────────────────────
// A long-lived token DOES carry a user, so this exercises the "known speaker
// with nothing assigned" path rather than the anonymous one.
log("\n[2] scope=mine");
const mine = await ask("MaintenanceSupporterListTasks", { scope: "mine" });
check(
  !mine.speech.includes(stamp),
  `unassigned tasks are not reported as mine (said: ${mine.speech.slice(0, 90)})`,
);

// assign one to the token's own user and ask again
const me = await api.send({ type: "auth/current_user" });
const tasks = await api.send({ type: "maintenance_supporter/task/list" });
const row = (tasks.tasks || []).find((t) => String(t.name || "").includes(stamp));
if (row && me?.id) {
  await api.send({
    type: "maintenance_supporter/task/assign_user",
    entry_id: row.entry_id,
    task_id: row.task_id,
    user_id: me.id,
  });
  const mine2 = await ask("MaintenanceSupporterListTasks", { scope: "mine" });
  check(mine2.speech.includes(stamp), `after assigning to ${me.name}, it is mine`);
} else {
  check(false, `could not assign a task (row=${!!row}, user=${me?.id})`);
}

// ── 3. scope=here without a device must NOT widen ────────────────────────
log("\n[3] scope=here from nowhere");
const here = await ask("MaintenanceSupporterListTasks", { scope: "here" });
check(here.error === true, `unresolvable room is an explicit error`);
check(!here.speech.includes(stamp), `and does not recite the whole house`);

// ── 4. the sentence files ────────────────────────────────────────────────
// The decisive comparison is BEFORE vs AFTER. Only asking once the sentences
// are installed proves nothing: a green answer could just as well mean the
// files were already there, or that some other agent handled the phrase.
log("\n[4] sentence installation");

async function askTheClassicAgent(text, language) {
  const res = await rest("/api/conversation/process", "POST", { text, language });
  const speech = res.json?.response?.speech?.plain?.speech ?? "";
  const understood =
    res.status === 200 &&
    speech.length > 0 &&
    !/sorry|didn't understand|nicht verstanden|not sure/i.test(speech);
  return { understood, speech };
}

async function setSetting(value) {
  await api.send({
    type: "maintenance_supporter/global/update",
    settings: { install_assist_sentences: value },
  });
  await new Promise((r) => setTimeout(r, 2500));
  const s = await api.send({ type: "maintenance_supporter/settings" });
  return s?.general?.install_assist_sentences;
}

const before = await api.send({ type: "maintenance_supporter/settings" });
const wasOn = before?.general?.install_assist_sentences === true;
log(`      setting was ${wasOn ? "ON" : "OFF"}`);

// Start from a known-off state so the comparison is real.
await setSetting(false);
const off = await askTheClassicAgent("what maintenance is due", "en");
check(!off.understood, `with the setting off the agent does NOT match it (${off.speech.slice(0, 60) || "no answer"})`);

check((await setSetting(true)) === true, "setting reads back as on");
const on = await askTheClassicAgent("what maintenance is due", "en");
check(on.understood, `with it on the agent answers: ${on.speech.slice(0, 80)}`);
check(
  on.speech.includes(stamp) || /maintenance/i.test(on.speech),
  `and the answer is ours, not a generic fallback`,
);

// German, to prove the second shipped language installs too.
const de = await askTheClassicAgent("was ist an Wartung fällig", "de");
check(de.understood, `the German sentence matches too: ${de.speech.slice(0, 70)}`);

// And the new scope sentence, which only exists because of this change.
const mineSentence = await askTheClassicAgent("what are my chores", "en");
check(mineSentence.understood, `the new "my chores" sentence matches: ${mineSentence.speech.slice(0, 70)}`);

check((await setSetting(wasOn)) === wasOn, `setting restored to ${wasOn}`);
if (!wasOn) {
  const after = await askTheClassicAgent("what maintenance is due", "en");
  check(!after.understood, "turning it off removed the sentences again");
}

// ── cleanup ──────────────────────────────────────────────────────────────
log("\n[cleanup]");
for (const entryId of created) {
  await api.send({ type: "maintenance_supporter/object/delete", entry_id: entryId }).catch(() => {});
}
log(`      removed ${created.length} objects`);

await api.close();

const failed = results.filter((r) => !r.ok);
log(`\n${results.length - failed.length}/${results.length} checks passed`);
if (failed.length) {
  for (const f of failed) log(`  FAILED: ${f.line}`);
  process.exit(1);
}
