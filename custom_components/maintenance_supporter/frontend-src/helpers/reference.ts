/**
 * Reference numbers (#170) — the panel side of helpers/reference_numbers.py.
 *
 * Object `8`, task `8.3`, completion `8.3-2`: assigned once by the backend,
 * never reused, so a printed booklet, a photo caption or a note can name a
 * task or a completion and the search jumps straight there. The panel only
 * formats and parses; it never invents a number.
 */

import { html, nothing } from "lit";

export interface HasRef { ref_no?: number | null }

const isRef = (v: unknown): v is number => typeof v === "number" && Number.isInteger(v) && v > 0;

export function objectRef(obj: HasRef | null | undefined): string | null {
  return obj && isRef(obj.ref_no) ? String(obj.ref_no) : null;
}

export function taskRef(obj: HasRef | null | undefined, task: HasRef | null | undefined): string | null {
  const o = objectRef(obj);
  return o && task && isRef(task.ref_no) ? `${o}.${task.ref_no}` : null;
}

export function entryRef(obj: HasRef | null | undefined, task: HasRef | null | undefined, entry: HasRef | null | undefined): string | null {
  const t = taskRef(obj, task);
  return t && entry && isRef(entry.ref_no) ? `${t}-${entry.ref_no}` : null;
}

export interface ParsedRef { object: number; task: number | null; entry: number | null }

/** `"8.3-2"` → {8, 3, 2}; `"8"` → {8, null, null}; anything else → null. */
export function parseRef(text: string): ParsedRef | null {
  const m = /^(\d+)(?:\.(\d+)(?:-(\d+))?)?$/.exec(text.trim());
  if (!m) return null;
  return { object: Number(m[1]), task: m[2] ? Number(m[2]) : null, entry: m[3] ? Number(m[3]) : null };
}

/** The muted `#8.3` chip every surface uses; `nothing` without a number. */
export function renderRefChip(ref: string | null, title?: string) {
  if (!ref) return nothing;
  return html`<span class="ref-chip" title=${title ?? ""}>#${ref}</span>`;
}
