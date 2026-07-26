/** The integration version this bundle was BUILT from (roadmap guard 2).
 *
 * esbuild stamps `__MS_BUNDLE_VERSION__` at build time (see esbuild.mjs);
 * under tsc/web-test-runner the identifier stays undefined and we fall back
 * to "dev", which disables the staleness comparison entirely.
 */

declare const __MS_BUNDLE_VERSION__: string | undefined;

export const BUNDLE_VERSION: string =
  typeof __MS_BUNDLE_VERSION__ !== "undefined" ? __MS_BUNDLE_VERSION__ : "dev";

/** True when the SERVER runs a different integration version than this
 *  bundle — i.e. the browser holds a stale cached frontend. Conservative:
 *  dev builds and missing data never flag. */
export function isStaleBundle(serverVersion: string | null | undefined, bundleVersion: string = BUNDLE_VERSION): boolean {
  if (!serverVersion || !bundleVersion || bundleVersion === "dev") return false;
  return serverVersion !== bundleVersion;
}
