// A move between two REAL Home Assistant instances, end to end — the Docker
// twin of tests/test_migration_roundtrip.py.
//
//   node e2e/migration/run.mjs
//
// Starts two containers (source + target) from MIGRATION_IMAGE with this
// repo's integration mounted, seeds the source through the public API
// (seed.json import, uploads, a completion with a photo), exports what the
// settings page offers (objects JSON, settings JSON, documents ZIP), imports
// it into the fresh target — people re-created under new user ids, as on
// another installation — stops both (Home Assistant flushes its stores) and
// compares the stored data key by key. Exit code 1 on any difference the
// shared tests/fixtures/migration_expectations.json does not name.
//
// Existing instance as the source instead (e.g. the demo, ha-shots):
//   SOURCE_CONTAINER=ha-shots SOURCE_URL=http://127.0.0.1:8131 \
//   SOURCE_USER=demo SOURCE_PASS=... node e2e/migration/run.mjs
// It is exported as is (no seed), stopped briefly for the flush and started
// again.
//
// Env: MIGRATION_IMAGE (default ghcr.io/home-assistant/home-assistant:2026.7.2),
// SOURCE_PORT / TARGET_PORT (8161 / 8162), ORDER=objects-first (default:
// settings first), KEEP=1 (leave the containers for inspection).
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { diff, snapshot } from "./compare.mjs";
import { addIntegration, connect, docker, login, onboard, setState, upload, waitForHttp } from "./lib.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO = resolve(HERE, "..", "..");
const RUN = join(HERE, ".run");
const EXPECT = JSON.parse(readFileSync(join(REPO, "tests", "fixtures", "migration_expectations.json"), "utf8"));
const IMAGE = process.env.MIGRATION_IMAGE || "ghcr.io/home-assistant/home-assistant:2026.7.2";
const SOURCE_PORT = Number(process.env.SOURCE_PORT || 8161);
const TARGET_PORT = Number(process.env.TARGET_PORT || 8162);
const EXTERNAL = process.env.SOURCE_CONTAINER || "";
const PEOPLE = ["Alice", "Bob"];
// The batteries and the sensor the seed's tasks watch — present on both
// instances, as the devices would be after a move.
const STATES = [
  ["sensor.hall_smoke_battery", "80", { device_class: "battery", unit_of_measurement: "%" }],
  ["sensor.garage_remote_battery", "35", { device_class: "battery", unit_of_measurement: "%" }],
  ["sensor.rig_pressure", "10", { unit_of_measurement: "bar" }],
];

const log = (...a) => console.log("[migration]", ...a);
let exportedAt = null;

function startContainer(name, port) {
  const config = join(RUN, name);
  mkdirSync(config, { recursive: true });
  writeFileSync(join(config, "configuration.yaml"), "default_config:\nlogger:\n  default: warning\n");
  docker("rm", "-f", name);
  docker(
    "run", "-d", "--name", name, "-p", `${port}:8123`, "-e", "TZ=UTC",
    "-v", `${config}:/config`,
    "-v", `${join(REPO, "custom_components", "maintenance_supporter")}:/config/custom_components/maintenance_supporter:ro`,
    // Two demo robots keyed like core Roborock, with reset buttons: the
    // devices a catalog adoption binds to (both instances have them).
    "-v", `${join(REPO, "docker", "demo_roborock_fixture")}:/config/custom_components/roborock:ro`,
    IMAGE,
  );
  return config;
}

async function freshInstance(name, port, people) {
  const config = startContainer(name, port);
  const base = `http://127.0.0.1:${port}`;
  await waitForHttp(base + "/manifest.json");
  const token = await onboard(base);
  await addIntegration(base, token);
  await addIntegration(base, token, "roborock");
  const ws = await connect(base, token);
  // The owner from onboarding is one of them already; the others are new.
  const existing = new Set((await ws.call({ type: "config/auth/list" })).map((u) => u.name));
  for (const person of people) {
    if (!existing.has(person)) await ws.call({ type: "config/auth/create", name: person, group_ids: ["system-users"] });
  }
  return { name, base, token, ws, config };
}

/** The entities the exported tasks and the fleet point at: their states are
 *  copied to the target, as the devices would exist after a real move. */
function referencedEntities(exportJson) {
  const ids = new Set();
  const walk = (tc) => {
    if (!tc || typeof tc !== "object") return;
    for (const id of [tc.entity_id, ...(tc.entity_ids || [])]) if (typeof id === "string") ids.add(id);
    for (const c of tc.conditions || []) walk(c);
  };
  for (const o of JSON.parse(exportJson).objects || []) {
    for (const t of o.tasks || []) {
      walk(t.trigger_config);
      for (const key of ["battery_replacements", "battery_low_latch"]) Object.keys(t[key] || {}).forEach((id) => ids.add(id));
    }
  }
  return [...ids];
}

async function copyStates(src, dst, exportJson) {
  let copied = 0;
  for (const id of referencedEntities(exportJson)) {
    const r = await fetch(`${src.base}/api/states/${id}`, { headers: { authorization: "Bearer " + src.token } });
    if (!r.ok) continue;
    const st = await r.json();
    await setState(dst.base, dst.token, id, st.state, st.attributes);
    copied += 1;
  }
  return copied;
}

async function seed(src) {
  const seedJson = readFileSync(join(HERE, "seed.json"), "utf8");
  const imported = await src.ws.call({ type: "maintenance_supporter/json/import", json_content: seedJson });
  if (imported.created !== 6) throw new Error("seed import: " + JSON.stringify(imported));
  await new Promise((r) => setTimeout(r, 8000));
  const { objects } = await src.ws.call({ type: "maintenance_supporter/objects" });
  const obj = (name) => objects.find((o) => o.object.name === name);
  const task = (o, name) => o.tasks.find((t) => t.name === name);
  const rig = obj("Roundtrip Rig");
  const kitchen = obj("Küche: Spülmaschine");
  const manual = await upload(src.base, src.token, rig.entry_id, "Owner's manual.pdf", "application/pdf", Buffer.from("%PDF-1.4 migration manual"), ["manual"]);
  const rigTask = task(rig, "Full service");
  await src.ws.call({ type: "maintenance_supporter/documents/update", doc_id: manual.id, task_ids: [rigTask.id], task_pages: { [rigTask.id]: 12 } });
  await src.ws.call({ type: "maintenance_supporter/documents/add_link", entry_id: rig.entry_id, url: "https://example.org/service", title: "Service schedule", tags: ["other"] });
  const photo = await upload(src.base, src.token, kitchen.entry_id, "IMG_0001.jpg", "image/jpeg", Buffer.from([0xff, 0xd8, 0xff, 0xe0, 1, 2, 3]), ["photo"]);
  await src.ws.call({
    type: "maintenance_supporter/task/complete",
    entry_id: kitchen.entry_id,
    task_id: task(kitchen, "Descale").id,
    notes: "with photo",
    photo_doc_ids: [photo.id],
  });
  // The rig's filter part points at the manual.
  const rigFull = await src.ws.call({ type: "maintenance_supporter/object", entry_id: rig.entry_id });
  const filter = (rigFull.parts || []).find((p) => p.name === "Filter");
  await src.ws.call({ type: "maintenance_supporter/part/update", entry_id: rig.entry_id, part_id: filter.id, name: filter.name, doc_id: manual.id });
  // A catalog adoption through the real path: one demo robot's duties, with
  // their fingerprints and the reset buttons as completion actions.
  const setups = await src.ws.call({ type: "maintenance_supporter/integration_setups/discover" });
  const robot = (setups.setups || setups).find((s) => s.integration === "roborock" && (s.tasks || []).length);
  if (!robot) throw new Error("no roborock suggestion to adopt");
  const adopted = await src.ws.call({ type: "maintenance_supporter/integration_setups/adopt", selections: [{ device_id: robot.device_id }] });
  if (!adopted.tasks_created) throw new Error("adoption created nothing: " + JSON.stringify(adopted));
  log(`source seeded (adopted ${adopted.tasks_created} robot duties)`);
}

async function exportAll(src) {
  exportedAt = new Date().toISOString();
  const objects = await src.ws.call({ type: "maintenance_supporter/export", format: "json", include_history: true });
  const settings = await src.ws.call({ type: "maintenance_supporter/settings/export" });
  const r = await fetch(src.base + "/api/maintenance_supporter/documents/archive", { headers: { authorization: "Bearer " + src.token } });
  if (!r.ok) throw new Error("archive export: " + r.status);
  const archive = Buffer.from(await r.arrayBuffer());
  writeFileSync(join(RUN, "export.json"), objects.data);
  writeFileSync(join(RUN, "settings.json"), settings.data);
  writeFileSync(join(RUN, "documents.zip"), archive);
  log(`exported: objects ${objects.data.length} B, settings ${settings.data.length} B, archive ${archive.length} B`);
  return { objects: objects.data, settings: settings.data, archive };
}

async function importAll(dst, files) {
  const order = process.env.ORDER === "objects-first" ? [files.objects, files.settings] : [files.settings, files.objects];
  for (const content of order) {
    const res = await dst.ws.call({ type: "maintenance_supporter/json/import", json_content: content });
    if (res.unmatched_users?.length) throw new Error("people not matched: " + res.unmatched_users.join(", "));
    if (res.errors?.length) throw new Error("import errors: " + JSON.stringify(res.errors));
  }
  await new Promise((r) => setTimeout(r, 8000));
  const form = new FormData();
  form.append("file", new Blob([files.archive], { type: "application/zip" }), "documents.zip");
  const r = await fetch(dst.base + "/api/maintenance_supporter/documents/archive", { method: "POST", headers: { authorization: "Bearer " + dst.token }, body: form });
  const res = await r.json();
  if (!r.ok || res.error) throw new Error("archive import: " + JSON.stringify(res));
  log("imported:", JSON.stringify(res));
  await new Promise((r) => setTimeout(r, 5000));
}

function clearRunFolder() {
  try {
    rmSync(RUN, { recursive: true, force: true });
  } catch {
    // Left root-owned by an aborted run on a Linux host: delete through docker.
    docker("run", "--rm", "--entrypoint", "rm", "-v", `${HERE}:/m`, IMAGE, "-rf", "/m/.run");
  }
  mkdirSync(RUN, { recursive: true });
}

async function main() {
  clearRunFolder();
  let src;
  if (EXTERNAL) {
    const base = process.env.SOURCE_URL;
    const token = await login(base, process.env.SOURCE_USER, process.env.SOURCE_PASS);
    const mount = JSON.parse(docker("inspect", EXTERNAL, "--format", "{{json .Mounts}}")).find((m) => m.Destination === "/config");
    src = { name: EXTERNAL, base, token, ws: await connect(base, token), config: mount.Source };
  } else {
    src = await freshInstance("ms-migration-source", SOURCE_PORT, PEOPLE);
    for (const [id, state, attrs] of STATES) await setState(src.base, src.token, id, state, attrs);
    await seed(src);
  }
  const files = await exportAll(src);
  src.ws.close();

  // The same people exist on the target, under their own (new) user ids.
  const people = [...new Set(Object.values(JSON.parse(files.objects).users || {}))];
  const dst = await freshInstance("ms-migration-target", TARGET_PORT, people);
  log(`target: ${people.length} people, ${await copyStates(src, dst, files.objects)} entity states copied`);
  await importAll(dst, files);
  dst.ws.close();

  // Home Assistant writes its stores on stop — compare what is on disk.
  docker("stop", "-t", "60", src.name, dst.name);
  if (EXTERNAL) docker("start", src.name);
  // The containers write as root: on a Linux host some .storage files are
  // root-only (0600) and nothing is deletable by the runner. Open the folders
  // this run created through the image itself (no sudo) — for reading now
  // and for the next run's cleanup. An existing source is left as it is,
  // unless its owner asks (SOURCE_CHMOD=1 — the timelapse's own folder).
  for (const config of EXTERNAL && process.env.SOURCE_CHMOD !== "1" ? [dst.config] : [src.config, dst.config]) {
    docker("run", "--rm", "--entrypoint", "chmod", "-v", `${config}:/c`, IMAGE, "-R", "a+rwX", "/c");
  }
  const before = snapshot(src.config, EXPECT, exportedAt);
  const after = snapshot(dst.config, EXPECT, exportedAt);
  writeFileSync(join(RUN, "snapshot-source.json"), JSON.stringify(before, null, 2));
  writeFileSync(join(RUN, "snapshot-target.json"), JSON.stringify(after, null, 2));
  const diffs = diff(before, after).filter((d) => !Object.keys(EXPECT.expected_diffs).some((k) => d.includes(k)));
  if (process.env.KEEP !== "1") {
    for (const name of ["ms-migration-source", "ms-migration-target"]) {
      if (name !== EXTERNAL) docker("rm", "-f", name);
    }
  }
  const objects = Object.keys(before.objects).length;
  const docs = Object.keys(before.documents).length;
  if (diffs.length) {
    console.log(diffs.join("\n"));
    console.error(`[migration] FAILED: ${diffs.length} difference(s) over ${objects} objects / ${docs} documents (snapshots in e2e/migration/.run)`);
    process.exit(1);
  }
  log(`OK: ${objects} objects, ${docs} documents, every stored key equal after the move`);
}

main().catch((err) => {
  console.error("[migration] ERROR:", err.message);
  process.exit(2);
});
