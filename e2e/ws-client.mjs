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
  await new Promise((res, rej) => {
    ws.onmessage = (ev) => {
      const m = JSON.parse(ev.data);
      if (m.type === "auth_required") ws.send(JSON.stringify({ type: "auth", access_token: token }));
      else if (m.type === "auth_ok") res();
      else if (m.type === "auth_invalid") rej(new Error("ws auth invalid"));
      else if (m.type === "result") {
        const p = pend.get(m.id);
        if (p) {
          pend.delete(m.id);
          m.success ? p.res(m.result) : p.rej(new Error(JSON.stringify(m.error)));
        }
      }
    };
  });
  return {
    send: (msg) =>
      new Promise((res, rej) => {
        const i = id++;
        pend.set(i, { res, rej });
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
