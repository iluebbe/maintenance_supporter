/** Shared helpers for the live e2e scripts + seeders — single source for the
 * HA WebSocket client, token loading and the playwright auth bootstrap.
 *
 * A DRY audit (2026-07-10) found the wsClient copy-pasted across nine
 * scripts, already diverged (close() present or not, different error texts,
 * one copy buried inline). Import from here instead:
 *
 *   import { loadToken, wsClient, watchdog, hassTokensInit } from "./ws-client.mjs";
 */
import fs from "fs";

/** HA long-lived token: $HA_TOKEN env wins, then docker/.env (ha-maint). */
export function loadToken() {
  if (process.env.HA_TOKEN) return process.env.HA_TOKEN;
  const env = new URL("../docker/.env", import.meta.url);
  if (fs.existsSync(env)) {
    const m = fs.readFileSync(env, "utf-8").match(/HA_TOKEN=(\S+)/);
    if (m) return m[1];
  }
  console.error("ERROR: No HA_TOKEN found (env var or docker/.env)");
  process.exit(1);
}

/** Kill the run if it exceeds `ms` — turns a silent hang (wedged browser,
 * dead WS) into a loggable failure. Returns the timer (unref'd). */
export function watchdog(ms, label = "run") {
  const t = setTimeout(() => {
    console.error(`WATCHDOG: ${label} exceeded ${Math.round(ms / 1000)}s — aborting`);
    process.exit(3);
  }, ms);
  t.unref?.();
  return t;
}

/** Authenticated HA WebSocket client.
 * @param {string} restUrl  e.g. "http://127.0.0.1:8125"
 * @param {string} token    long-lived or session access token
 * @returns {Promise<{send: (msg: object) => Promise<any>, close: () => void}>}
 *   send() resolves with the command result or rejects with the WS error.
 */
export async function wsClient(restUrl, token) {
  const ws = new WebSocket(restUrl.replace(/^http/, "ws") + "/api/websocket");
  await new Promise((res, rej) => {
    ws.onopen = res;
    ws.onerror = () => rej(new Error("ws connect failed"));
  });
  let id = 1;
  const pend = new Map();
  const subs = new Map();
  await new Promise((res, rej) => {
    ws.onmessage = (ev) => {
      const m = JSON.parse(ev.data);
      if (m.type === "auth_required") ws.send(JSON.stringify({ type: "auth", access_token: token }));
      else if (m.type === "auth_ok") res();
      else if (m.type === "auth_invalid") rej(new Error("ws auth invalid"));
      else if (m.type === "event") {
        const handler = subs.get(m.id);
        if (handler) handler(m.event);
      } else if (m.type === "result") {
        const p = pend.get(m.id);
        if (p) {
          pend.delete(m.id);
          m.success ? p.res(m.result) : p.rej(new Error(JSON.stringify(m.error)));
        }
      }
    };
  });
  const send = (msg) =>
    new Promise((res, rej) => {
      const i = id++;
      pend.set(i, { res, rej });
      ws.send(JSON.stringify({ ...msg, id: i }));
    });
  return {
    send,
    /** Subscribe to HA events; resolves to an unsubscribe function.
     *  Lets a live check assert on what HA ACTUALLY did (which service was
     *  called) rather than on what a command claims it did. */
    subscribe: (msg, onEvent) =>
      new Promise((res, rej) => {
        const i = id++;
        pend.set(i, {
          res: () => {
            subs.set(i, onEvent);
            res(async () => {
              subs.delete(i);
              await send({ type: "unsubscribe_events", subscription: i }).catch(() => {});
            });
          },
          rej,
        });
        ws.send(JSON.stringify({ ...msg, id: i }));
      }),
    close: () => ws.close(),
  };
}

/** addInitScript payload that logs the playwright page into HA via a token.
 * Usage: await ctx.addInitScript(hassTokensInit, { t: token, ha: HA }); */
export function hassTokensInit({ t, ha }) {
  localStorage.setItem(
    "hassTokens",
    JSON.stringify({
      access_token: t,
      token_type: "Bearer",
      expires_in: 1800,
      hassUrl: ha,
      clientId: ha + "/",
      expires: Date.now() + 9e11,
      refresh_token: "",
    })
  );
}

/** Deep shadow-DOM accessor for the panel — THE canonical copy (DRY audit
 *  2026-08: seven live-* scripts carried this chain inline). Runs IN THE
 *  BROWSER: pass `panelOf.toString()` into page.evaluate and eval it there,
 *  or reference it from an addInitScript. gifs/shots keep their own
 *  BFS-based finders on purpose (they survive DOM-order changes).
 */
export const panelOf = () => document
  .querySelector("home-assistant")?.shadowRoot
  ?.querySelector("home-assistant-main")?.shadowRoot
  ?.querySelector("ha-drawer partial-panel-resolver ha-panel-custom maintenance-supporter-panel");

/** Shadow-DOM walker SOURCE for page.evaluate contexts. 53 scripts carried
 * inline copies (drift audit 2026-08); new scripts should embed this string:
 *   await page.evaluate(`${DEEP_SRC} deep(el => ...)`) — or interpolate it
 * into an evaluate function body. Existing scripts keep their working
 * copies; migrate opportunistically when touching one.
 */
export const DEEP_SRC = `const deep = (pred) => { const st = [document.documentElement]; const o = []; let n = 0;
  while (st.length && n < 80000) { const el = st.pop(); n++; if (!el) continue;
    if (pred(el)) o.push(el); if (el.shadowRoot) st.push(el.shadowRoot);
    for (const k of (el.children || [])) st.push(k); } return o; };`;

/** login_flow + auth/token against an HA instance (17 named copies existed).
 * cid MUST be the origin the BROWSER uses (client_id trap: the frontend
 * bounces to /auth/authorize when localStorage clientId disagrees). */
export async function haLogin(rest, { user, pass, cid }) {
  const j = (r) => r.json();
  const f = await fetch(rest + "/auth/login_flow", {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ client_id: cid, handler: ["homeassistant", null], redirect_uri: cid }),
  }).then(j);
  const s = await fetch(rest + "/auth/login_flow/" + f.flow_id, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ client_id: cid, username: user, password: pass }),
  }).then(j);
  const t = await fetch(rest + "/auth/token", {
    method: "POST",
    body: new URLSearchParams({ grant_type: "authorization_code", code: s.result, client_id: cid }),
  }).then(j);
  if (!t.access_token) throw new Error("login failed: " + JSON.stringify(t));
  return t.access_token;
}
