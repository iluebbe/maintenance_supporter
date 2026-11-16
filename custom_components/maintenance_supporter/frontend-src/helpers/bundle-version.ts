/** The integration version this bundle was BUILT from (roadmap guard 2).
 *
 * esbuild stamps `__MS_BUNDLE_VERSION__` at build time (see esbuild.mjs);
 * under tsc/web-test-runner the identifier stays undefined and we fall back
 * to "dev", which disables the staleness comparison entirely.
 */

declare const __MS_BUNDLE_VERSION__: string | undefined;

export const BUNDLE_VERSION: string =
  typeof __MS_BUNDLE_VERSION__ !== "undefined" ? __MS_BUNDLE_VERSION__ : "dev";

/** Every version of our bundles that has run in this window. The panel, the
 *  cards and the dashboard strategy each carry their own copy of this module,
 *  so the list lives on window, and every copy adds its version on load.
 *
 *  A window keeps the code it loaded until it reloads: after an update, a
 *  card loaded before it runs next to a panel loaded after it, and Home
 *  Assistant's restart does not change that (2026-11-16: the 2.123.0 panel
 *  read the 2.122.0 card's German table, and its new texts were English). */
const _bundleVersions: string[] = (() => {
  const w = window as unknown as { __msBundleVersions?: string[] };
  if (!Array.isArray(w.__msBundleVersions)) w.__msBundleVersions = [];
  if (!w.__msBundleVersions.includes(BUNDLE_VERSION)) w.__msBundleVersions.push(BUNDLE_VERSION);
  return w.__msBundleVersions;
})();

/** The versions of our other bundles in this window ("dev" builds aside). */
export function otherBundleVersions(own: string = BUNDLE_VERSION): string[] {
  return _bundleVersions.filter((v) => v !== own && v !== "dev");
}

/** True when the SERVER runs a different integration version than this
 *  bundle — i.e. the browser holds a stale cached frontend. Conservative:
 *  dev builds and missing data never flag. */
export function isStaleBundle(serverVersion: string | null | undefined, bundleVersion: string = BUNDLE_VERSION): boolean {
  if (!serverVersion || !bundleVersion || bundleVersion === "dev") return false;
  return serverVersion !== bundleVersion;
}

/** The answer of `maintenance_supporter/version`: the running version, the
 *  one on disk, and whether Home Assistant still runs the older code (an
 *  older backend answers `version` only). */
export interface ServerVersion {
  version?: string;
  installed_version?: string | null;
  restart_pending?: boolean;
}

/** The installed version when an update waits for Home Assistant's restart
 *  (helpers/update_state.py), else null. Until then, an action can fail with
 *  "Unknown error", and reloading the page does not help. */
export function pendingRestartVersion(v: ServerVersion | null | undefined): string | null {
  return v?.restart_pending && v.installed_version ? v.installed_version : null;
}
