/** Live E2E: selective export + the documents archive HTTP views (ZIP+blobs).
 *  Uploads a file, downloads the archive, verifies the ZIP carries the blob,
 *  re-uploads it, checks the restore counts, and checks selective JSON export.
 *  Pure Node (fetch + WS), no browser. */
import fs from "fs";
import { wsClient, loadToken } from "./ws-client.mjs";

const REST = "http://127.0.0.1:8125";
const token = loadToken();
const auth = { Authorization: "Bearer " + token };
const log = (...a) => console.log(...a);
setTimeout(() => { console.error("WATCHDOG"); process.exit(3); }, 3 * 60e3);

const svc = await fetch(REST + "/api/services/maintenance_supporter/add_object?return_response", {
  method: "POST", headers: { ...auth, "Content-Type": "application/json" },
  body: JSON.stringify({ name: "Archive Live " + (Date.now() % 100000) }),
}).then((r) => r.json());
const entryId = (svc.service_response ?? svc).entry_id;
log("object", entryId);

// Upload a small file.
const fd = new FormData();
fd.append("entry_id", entryId);
fd.append("file", new Blob([Buffer.from("%PDF-1.4 live archive test bytes")], { type: "application/pdf" }), "manual.pdf");
fd.append("title", "Live manual");
const up = await fetch(REST + "/api/maintenance_supporter/document/upload", { method: "POST", headers: auth, body: fd }).then((r) => r.json());
log("uploaded doc", up.id, "hash", (up.hash || "").slice(0, 12));
const digest = up.hash;

// Selective JSON export (entry_ids) — should contain only our object.
const api = await wsClient(REST, token);
const exp = await api.send({ type: "maintenance_supporter/export", format: "json", entry_ids: [entryId] });
const parsed = JSON.parse(exp.data);
if (parsed.objects.length !== 1) throw new Error("selective export returned " + parsed.objects.length + " objects, want 1");
log("selective export OK — 1 object");

// Download the documents archive (all objects) and confirm the blob is in it.
const zipBuf = Buffer.from(await fetch(REST + "/api/maintenance_supporter/documents/archive", { headers: auth }).then((r) => r.arrayBuffer()));
if (zipBuf.slice(0, 2).toString() !== "PK") throw new Error("archive is not a ZIP");
if (!zipBuf.includes(Buffer.from(digest))) throw new Error("archive ZIP does not reference the blob hash");
log("archive downloaded", zipBuf.length, "bytes, contains blob hash");

// Re-upload the archive → restore. Idempotent: doc already present, but the
// blob write is a no-op (already on disk) — counts come back without error.
const fd2 = new FormData();
fd2.append("file", new Blob([zipBuf], { type: "application/zip" }), "docs.zip");
const imp = await fetch(REST + "/api/maintenance_supporter/documents/archive", { method: "POST", headers: auth, body: fd2 }).then((r) => r.json());
log("archive import result", JSON.stringify(imp));
if (imp.error) throw new Error("import errored: " + imp.error);
if (typeof imp.objects_matched !== "number") throw new Error("import result missing objects_matched");

// Cleanup.
await api.send({ type: "maintenance_supporter/object/delete", entry_id: entryId });
api.close();
log("cleanup done");
log("ALL OK");
process.exit(0);
