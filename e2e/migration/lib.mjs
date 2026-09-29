// Helpers for the two-instance migration round trip (run.mjs): Home Assistant
// onboarding + auth, a minimal WebSocket client, docker CLI calls.
// Node >= 22 only (global fetch + WebSocket), no dependencies.
import { execFileSync } from "node:child_process";

export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export function docker(...args) {
  return execFileSync("docker", args, { encoding: "utf8", env: { ...process.env, MSYS_NO_PATHCONV: "1" } }).trim();
}

export async function waitForHttp(url, seconds = 300) {
  for (let i = 0; i < seconds / 2; i++) {
    try {
      const r = await fetch(url);
      if (r.ok) return;
    } catch {
      /* not up yet */
    }
    await sleep(2000);
  }
  throw new Error(`${url} did not answer within ${seconds}s`);
}

async function exchangeCode(base, clientId, code) {
  const body = new URLSearchParams({ grant_type: "authorization_code", code, client_id: clientId });
  const t = await (await fetch(base + "/auth/token", { method: "POST", body })).json();
  if (!t.access_token) throw new Error("token exchange failed: " + JSON.stringify(t));
  return t.access_token;
}

async function postJson(base, path, body, token) {
  const r = await fetch(base + path, {
    method: "POST",
    headers: { "content-type": "application/json", ...(token ? { authorization: "Bearer " + token } : {}) },
    body: JSON.stringify(body),
  });
  const text = await r.text();
  try {
    return JSON.parse(text);
  } catch {
    return { status: r.status, text };
  }
}

/** A fresh instance: create the owner, finish onboarding, return a token. */
export async function onboard(base, username = "owner", password = "migration-pass-1") {
  const clientId = base + "/";
  const user = await postJson(base, "/api/onboarding/users", { client_id: clientId, name: "Owner", username, password, language: "en" });
  if (!user.auth_code) throw new Error("onboarding failed: " + JSON.stringify(user));
  const token = await exchangeCode(base, clientId, user.auth_code);
  await postJson(base, "/api/onboarding/core_config", {}, token);
  await postJson(base, "/api/onboarding/analytics", {}, token);
  await postJson(base, "/api/onboarding/integration", { client_id: clientId, redirect_uri: clientId }, token);
  return token;
}

/** An existing instance: log in with a local user. */
export async function login(base, username, password) {
  const clientId = base + "/";
  const flow = await postJson(base, "/auth/login_flow", { client_id: clientId, handler: ["homeassistant", null], redirect_uri: clientId });
  const res = await postJson(base, "/auth/login_flow/" + flow.flow_id, { client_id: clientId, username, password });
  if (!res.result) throw new Error("login failed: " + JSON.stringify(res));
  return exchangeCode(base, clientId, res.result);
}

/** Add an integration through its config flow (every step accepts {}). */
export async function addIntegration(base, token, handler = "maintenance_supporter") {
  let flow = await postJson(base, "/api/config/config_entries/flow", { handler, show_advanced_options: false }, token);
  for (let i = 0; i < 6 && flow.type === "form"; i++) {
    flow = await postJson(base, "/api/config/config_entries/flow/" + flow.flow_id, {}, token);
  }
  if (flow.type !== "create_entry") throw new Error("integration setup failed: " + JSON.stringify(flow));
}

export async function setState(base, token, entityId, state, attributes) {
  await postJson(base, "/api/states/" + entityId, { state, attributes }, token);
}

export async function connect(base, token) {
  const sock = new WebSocket(base.replace(/^http/, "ws") + "/api/websocket");
  const pending = new Map();
  let id = 0;
  const client = {
    call(msg) {
      return new Promise((res, rej) => {
        const mid = ++id;
        pending.set(mid, { res, rej });
        sock.send(JSON.stringify({ ...msg, id: mid }));
      });
    },
    close: () => sock.close(),
    // Set by a caller that subscribed to events.
    onEvent: null,
  };
  await new Promise((resolve, reject) => {
    sock.onmessage = (ev) => {
      const m = JSON.parse(ev.data);
      if (m.type === "auth_required") sock.send(JSON.stringify({ type: "auth", access_token: token }));
      else if (m.type === "auth_ok") resolve();
      else if (m.type === "auth_invalid") reject(new Error("auth_invalid"));
      else if (m.type === "result" && pending.has(m.id)) {
        const { res, rej } = pending.get(m.id);
        pending.delete(m.id);
        if (m.success) res(m.result);
        else rej(new Error(JSON.stringify(m.error)));
      } else if (m.type === "event" && client.onEvent) client.onEvent(m.event);
    };
    sock.onerror = () => reject(new Error("websocket error"));
  });
  return client;
}

export async function upload(base, token, entryId, filename, mime, bytes, tags) {
  const form = new FormData();
  form.append("entry_id", entryId);
  for (const t of tags) form.append("tags", t);
  form.append("file", new Blob([bytes], { type: mime }), filename);
  const r = await fetch(base + "/api/maintenance_supporter/document/upload", { method: "POST", headers: { authorization: "Bearer " + token }, body: form });
  const j = await r.json();
  if (!r.ok) throw new Error("upload failed: " + JSON.stringify(j));
  return j;
}
