/** Area history and costs (#191) — the object lifecycle history (#138)
 * lifted one level up: every object of a Home Assistant area, merged.
 *
 * Pure functions over the objects list payload plus the per-task histories
 * (the caller passes `historyOf`, normally helpers/full-history). Objects
 * are grouped by their `area_id`; objects without one land in the NO_AREA
 * bucket, so nothing silently drops out of the totals.
 */

import type { HistoryEntry } from "../types";
import { isoDateLocal } from "./calendar-bucket";
import {
  filterObjectHistory,
  mergeObjectHistory,
  objectHistoryTotals,
  type ObjectHistoryEntry,
} from "./object-history";
import { matchesQuery } from "./search-match";

/** Key of the "No area" bucket. HA builds area ids with slugify, which never
 *  yields a leading underscore — this can not collide with a real area. */
export const NO_AREA = "__none__";

/** Above this many months the cost chart buckets by year instead. */
export const MAX_MONTH_BUCKETS = 36;

type AreaRegistry = Record<string, { name: string; icon?: string | null }> | undefined;

interface TaskLike {
  id: string;
  name: string;
  status?: string;
  archived?: boolean;
  history?: HistoryEntry[] | null;
  history_count?: number | null;
  phases?: Record<string, { name: string }> | null;
  ref_no?: number | null;
  reading_unit?: string | null;
}

export interface AreaObjectLike {
  entry_id: string;
  object: { name: string; area_id?: string | null; archived?: boolean };
  tasks: ReadonlyArray<TaskLike>;
}

export type HistoryOf = (entryId: string, task: TaskLike) => HistoryEntry[];

export function areaKeyOf(o: { area_id?: string | null }): string {
  return o.area_id || NO_AREA;
}

/** The area's HA name; the raw id for an area HA no longer knows (deleted
 *  since — the objects still point at it); the caller's "No area" label for
 *  the bucket. */
export function areaDisplayName(key: string, areas: AreaRegistry, noAreaLabel: string): string {
  if (key === NO_AREA) return noAreaLabel;
  return areas?.[key]?.name || key;
}

export function areaIcon(key: string, areas: AreaRegistry): string {
  if (key === NO_AREA) return "mdi:map-marker-off-outline";
  return areas?.[key]?.icon || "mdi:map-marker-outline";
}

/** Archived objects follow the panel's show-archived toggle — the All
 *  objects convention (hidden until the toggle is on). */
export function objectsInArea<T extends AreaObjectLike>(objects: ReadonlyArray<T>, key: string, showArchived: boolean): T[] {
  return objects.filter((o) => (showArchived || !o.object.archived) && areaKeyOf(o.object) === key);
}

/** One merged row: an object history entry tagged with its object. */
export interface AreaHistoryEntry extends ObjectHistoryEntry {
  entryId: string;
  objectName: string;
}

/** Every lifecycle entry of every task of the given objects, newest first;
 *  equal timestamps keep a stable object → task order. */
export function mergeAreaHistory(objects: ReadonlyArray<AreaObjectLike>, historyOf: HistoryOf): AreaHistoryEntry[] {
  const out: AreaHistoryEntry[] = [];
  for (const o of objects) {
    const merged = mergeObjectHistory(
      o.tasks.map((task) => ({
        id: task.id,
        name: task.name,
        history: historyOf(o.entry_id, task),
        phases: task.phases,
        ref_no: task.ref_no,
        reading_unit: task.reading_unit,
      })),
    );
    for (const e of merged) out.push({ ...e, entryId: o.entry_id, objectName: o.object.name });
  }
  out.sort((a, b) => b.ts - a.ts || a.objectName.localeCompare(b.objectName) || a.taskName.localeCompare(b.taskName));
  return out;
}

export interface AreaHistoryFilter {
  /** Inclusive local dates (YYYY-MM-DD). */
  from?: string | null;
  to?: string | null;
  /** One object of the area; empty = all. */
  entryId?: string | null;
  /** Task name, matched like the global search (folded, typo-tolerant). */
  taskQuery?: string | null;
}

export function filterAreaHistory(entries: ReadonlyArray<AreaHistoryEntry>, f: AreaHistoryFilter): AreaHistoryEntry[] {
  const query = (f.taskQuery ?? "").trim();
  return filterObjectHistory(entries, { from: f.from, to: f.to }).filter(
    (e) => (!f.entryId || e.entryId === f.entryId) && (!query || matchesQuery(e.taskName, query)),
  );
}

export interface AreaTotals {
  completions: number;
  totalCost: number;
  /** What a completion costs on average — the task detail's "Avg cost"
   *  rule (the backend's average_cost): credits (#200) left out on both
   *  sides, a sale is no job. Null without such a completion. */
  avgCost: number | null;
  /** Minutes, completed entries only. */
  totalDuration: number;
}

export function areaTotals(entries: ReadonlyArray<AreaHistoryEntry>): AreaTotals {
  const { completed, totalCost } = objectHistoryTotals(entries);
  let totalDuration = 0;
  let jobs = 0;
  let jobsCost = 0;
  for (const e of entries) {
    if (e.type !== "completed") continue;
    if (e.duration != null) totalDuration += e.duration;
    if ((e.cost ?? 0) < 0) continue;
    jobs++;
    jobsCost += e.cost ?? 0;
  }
  return { completions: completed, totalCost, avgCost: jobs ? jobsCost / jobs : null, totalDuration };
}

export interface ObjectCostRow {
  entryId: string;
  objectName: string;
  completions: number;
  /** Net of credits (#200) — below zero when more came back than went out. */
  cost: number;
  /** Share of what the listed objects spent, 0..1 — 0 for an object that
   *  spent nothing or got more back than it cost. */
  share: number;
}

/** Completed work per object — every listed object gets a row (one that
 *  cost nothing in the period says so), most expensive first. */
export function costByObject(
  entries: ReadonlyArray<AreaHistoryEntry>,
  objects: ReadonlyArray<{ entry_id: string; object: { name: string } }>,
): ObjectCostRow[] {
  const rows = new Map<string, ObjectCostRow>();
  for (const o of objects) rows.set(o.entry_id, { entryId: o.entry_id, objectName: o.object.name, completions: 0, cost: 0, share: 0 });
  for (const e of entries) {
    if (e.type !== "completed") continue;
    const row = rows.get(e.entryId);
    if (!row) continue;
    row.completions++;
    if (e.cost != null) row.cost += e.cost;
  }
  // Shares of the spending: an object in credit would drive a share below
  // zero and push the others past 100 %.
  const total = [...rows.values()].reduce((n, r) => n + Math.max(r.cost, 0), 0);
  const out = [...rows.values()].map((r) => ({ ...r, share: total > 0 ? Math.max(r.cost, 0) / total : 0 }));
  out.sort((a, b) => b.cost - a.cost || b.completions - a.completions || a.objectName.localeCompare(b.objectName));
  return out;
}

export interface CostBucket {
  /** "YYYY-MM" (month buckets) or "YYYY" (year buckets). */
  key: string;
  year: number;
  /** 0–11; null for a year bucket. */
  month: number | null;
  cost: number;
  completions: number;
}

export interface CostBuckets {
  unit: "month" | "year";
  buckets: CostBucket[];
}

function ymOf(iso: string): [number, number] {
  const [y, m] = iso.split("-").map(Number);
  return [y, m - 1];
}

function monthKey(year: number, month: number): string {
  return `${year}-${String(month + 1).padStart(2, "0")}`;
}

/** Cost over time for the filtered range, in calendar months — or years
 *  when the range spans more than MAX_MONTH_BUCKETS months. Every bucket of
 *  the range is present (an empty month is a zero, not a gap). An open
 *  range end falls back to the data: the oldest completion / today. */
export function costBuckets(
  entries: ReadonlyArray<AreaHistoryEntry>,
  range: { from?: string | null; to?: string | null },
  now: Date = new Date(),
): CostBuckets {
  const done = entries.filter((e) => e.type === "completed");
  const localDates = done.map((e) => isoDateLocal(new Date(e.ts)));
  const today = isoDateLocal(now);
  const earliest = localDates.reduce((min, d) => (d < min ? d : min), today);
  const latest = localDates.reduce((max, d) => (d > max ? d : max), today);
  const [fy, fm] = ymOf(range.from || earliest);
  const [ty, tm] = ymOf(range.to || latest);
  const months = (ty * 12 + tm) - (fy * 12 + fm) + 1;
  if (months <= 0) return { unit: "month", buckets: [] };
  const unit: CostBuckets["unit"] = months > MAX_MONTH_BUCKETS ? "year" : "month";
  const buckets: CostBucket[] = [];
  const index = new Map<string, CostBucket>();
  if (unit === "month") {
    for (let i = 0; i < months; i++) {
      const year = fy + Math.floor((fm + i) / 12);
      const month = (fm + i) % 12;
      const b: CostBucket = { key: monthKey(year, month), year, month, cost: 0, completions: 0 };
      buckets.push(b);
      index.set(b.key, b);
    }
  } else {
    for (let year = fy; year <= ty; year++) {
      const b: CostBucket = { key: String(year), year, month: null, cost: 0, completions: 0 };
      buckets.push(b);
      index.set(b.key, b);
    }
  }
  done.forEach((e, i) => {
    const d = localDates[i];
    const b = index.get(unit === "month" ? d.slice(0, 7) : d.slice(0, 4));
    if (!b) return;
    b.completions++;
    if (e.cost != null) b.cost += e.cost;
  });
  return { unit, buckets };
}

/** The default range: the last twelve calendar months including this one. */
export function lastTwelveMonths(now: Date = new Date()): { from: string; to: string } {
  return { from: isoDateLocal(new Date(now.getFullYear(), now.getMonth() - 11, 1)), to: isoDateLocal(now) };
}

/** One calendar year — the annual overview. */
export function calendarYear(year: number): { from: string; to: string } {
  return { from: `${year}-01-01`, to: `${year}-12-31` };
}

/** Years with completed work, newest first, always including `current`. */
export function historyYears(entries: ReadonlyArray<AreaHistoryEntry>, current: number): number[] {
  const years = new Set<number>([current]);
  for (const e of entries) if (e.type === "completed") years.add(new Date(e.ts).getFullYear());
  return [...years].sort((a, b) => b - a);
}

/** One row of the areas table. */
export interface AreaSummary {
  key: string;
  name: string;
  icon: string;
  objects: number;
  tasks: number;
  /** Overdue OR triggered — the object cards' "needs attention" rule. */
  overdue: number;
  dueSoon: number;
  /** Completed-work cost in the given calendar year. */
  costYear: number;
  /** Completed-work cost, all time. */
  costTotal: number;
  /** Timestamp of the newest completion, null without one. */
  lastCompletion: string | null;
}

/** Areas that contain objects (plus the NO_AREA bucket when some object has
 *  no area), with their counts and costs. Archived objects follow the
 *  show-archived toggle; archived tasks count toward neither the task nor
 *  the status columns, but their history stays in the costs — money spent
 *  on a task retired since was still spent. Ordered by name, "No area" last. */
export function summarizeAreas(
  objects: ReadonlyArray<AreaObjectLike>,
  opts: { showArchived: boolean; areas: AreaRegistry; noAreaLabel: string; year: number; historyOf: HistoryOf },
): AreaSummary[] {
  const groups = new Map<string, AreaObjectLike[]>();
  for (const o of objects) {
    if (!opts.showArchived && o.object.archived) continue;
    const key = areaKeyOf(o.object);
    const list = groups.get(key);
    if (list) list.push(o);
    else groups.set(key, [o]);
  }
  const out: AreaSummary[] = [];
  for (const [key, objs] of groups) {
    const live = objs.flatMap((o) => o.tasks.filter((task) => opts.showArchived || !task.archived));
    const active = live.filter((task) => !task.archived);
    let costYear = 0;
    let costTotal = 0;
    let last = -Infinity;
    let lastIso: string | null = null;
    for (const e of mergeAreaHistory(objs, opts.historyOf)) {
      if (e.type !== "completed") continue;
      if (e.cost != null) {
        costTotal += e.cost;
        if (new Date(e.ts).getFullYear() === opts.year) costYear += e.cost;
      }
      if (e.ts > last) {
        last = e.ts;
        lastIso = e.timestamp;
      }
    }
    out.push({
      key,
      name: areaDisplayName(key, opts.areas, opts.noAreaLabel),
      icon: areaIcon(key, opts.areas),
      objects: objs.length,
      tasks: live.length,
      overdue: active.filter((task) => task.status === "overdue" || task.status === "triggered").length,
      dueSoon: active.filter((task) => task.status === "due_soon").length,
      costYear,
      costTotal,
      lastCompletion: lastIso,
    });
  }
  out.sort((a, b) => Number(a.key === NO_AREA) - Number(b.key === NO_AREA) || a.name.localeCompare(b.name));
  return out;
}

export type AreaSortKey = "name" | "objects" | "tasks" | "overdue" | "due_soon" | "cost_year" | "cost_total" | "last";
export const AREA_SORT_KEYS: readonly AreaSortKey[] = ["name", "objects", "tasks", "overdue", "due_soon", "cost_year", "cost_total", "last"];

export interface AreaSort {
  key: AreaSortKey;
  dir: "asc" | "desc";
}

export const DEFAULT_AREA_SORT: AreaSort = { key: "name", dir: "asc" };

/** "cost_year:desc" (the stored form) → a validated sort; anything else →
 *  the default. */
export function parseAreaSort(raw: string | null | undefined): AreaSort {
  const [key, dir] = (raw ?? "").split(":");
  return (AREA_SORT_KEYS as readonly string[]).includes(key) && (dir === "asc" || dir === "desc")
    ? { key: key as AreaSortKey, dir }
    : DEFAULT_AREA_SORT;
}

/** A header click: the same column flips direction; a new column starts
 *  where it is most useful — names A→Z, figures largest first. */
export function nextAreaSort(current: AreaSort, key: AreaSortKey): AreaSort {
  if (current.key === key) return { key, dir: current.dir === "asc" ? "desc" : "asc" };
  return { key, dir: key === "name" ? "asc" : "desc" };
}

function sortValue(a: AreaSummary, key: AreaSortKey): number | string {
  switch (key) {
    case "name": return a.name;
    case "objects": return a.objects;
    case "tasks": return a.tasks;
    case "overdue": return a.overdue;
    case "due_soon": return a.dueSoon;
    case "cost_year": return a.costYear;
    case "cost_total": return a.costTotal;
    case "last": return a.lastCompletion ? new Date(a.lastCompletion).getTime() : -Infinity;
  }
}

/** Sort a copy of the rows; ties fall back to the name (A→Z). The "No
 *  area" bucket stays last in the name order, where it is not an area. */
export function sortAreas(rows: ReadonlyArray<AreaSummary>, sort: AreaSort): AreaSummary[] {
  const sign = sort.dir === "asc" ? 1 : -1;
  return [...rows].sort((a, b) => {
    if (sort.key === "name") {
      const bucket = Number(a.key === NO_AREA) - Number(b.key === NO_AREA);
      if (bucket) return bucket;
    }
    const va = sortValue(a, sort.key);
    const vb = sortValue(b, sort.key);
    const cmp = typeof va === "string" ? va.localeCompare(vb as string) : (va as number) - (vb as number);
    return sign * cmp || a.name.localeCompare(b.name);
  });
}

/** The text filter over area names (folded, typo-tolerant like the search). */
export function filterAreas(rows: ReadonlyArray<AreaSummary>, query: string): AreaSummary[] {
  const q = query.trim();
  return q ? rows.filter((r) => matchesQuery(r.name, q)) : [...rows];
}
