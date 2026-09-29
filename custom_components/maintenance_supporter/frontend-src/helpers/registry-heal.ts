/** Self-heal for the Lovelace card bundles after HA's registry swap.
 *
 * HA's frontend swaps a scoped custom-element registry in during boot (the
 * strategy shim's self-heal describes it). A card bundle evaluated before the
 * swap defines its elements on the registry HA then discards: the dashboard
 * shows "Configuration error" for every one of our cards until a reload.
 * Measured 2026-09-29 on HA 2026.7: about one dashboard load in three right
 * after the panel was open; `customElements.get(tag)` reads false there and
 * `customElements.define` is no longer the native one.
 *
 * Re-importing the bundle under a fresh URL re-evaluates it, so every
 * guarded `define` in it — the card and all the elements it renders inside
 * its shadow root — runs again on the registry that is current now; HA's
 * error card waits on `whenDefined` and rebuilds itself. A guarded re-define
 * of the top-level tag alone would leave the inner elements on the old
 * registry, which is why the shim re-imports too.
 *
 * Only the first evaluation schedules the checks; the healed copy sees the
 * flag and stays quiet. On a healthy load the tags are there and nothing
 * happens but a handful of cheap `customElements.get` calls.
 */

const MAX_REIMPORTS = 3;

export function healCardRegistry(
  tags: readonly string[],
  moduleUrl: string,
  // Injectable for tests; the bundles pass nothing.
  importer: (url: string) => Promise<unknown> = (url) => import(/* @vite-ignore */ url),
): void {
  const w = window as unknown as Record<string, unknown>;
  // Per bundle file (the query dropped, so the healed copy finds it set): the
  // panel bundle carries the calendar card too, and a flag per TAG let
  // whichever bundle ran first silence the other's watch.
  let file: string;
  try {
    const parsed = new URL(moduleUrl);
    file = parsed.origin + parsed.pathname;
  } catch {
    return;
  }
  const flag = `__msCardHeal:${tags[0]}:${file}`;
  if (w[flag]) return;
  w[flag] = true;

  let checks = 0;
  let reimports = 0;
  // One re-import at a time: a slow phone used to start the next one on every
  // check while the first was still loading — three parallel fetches and
  // evaluations of a ~450 KB bundle during boot (bug audit 2026-09-29).
  let loading = false;
  const check = (): void => {
    checks += 1;
    const missing = tags.some((tag) => !customElements.get(tag));
    if (missing && reimports < MAX_REIMPORTS && !loading) {
      reimports += 1;
      loading = true;
      try {
        const url = new URL(moduleUrl);
        url.searchParams.set("heal", `${Date.now()}`);
        void importer(url.href)
          .catch(() => undefined)
          .finally(() => { loading = false; });
      } catch {
        return;
      }
    }
    // The swap happens during boot: look closely for a few seconds, then
    // now and then for half a minute.
    if (checks < 20) window.setTimeout(check, checks < 8 ? 500 : 2000);
  };
  window.setTimeout(check, 250);
}
