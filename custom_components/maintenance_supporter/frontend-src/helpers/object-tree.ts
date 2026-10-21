/**
 * #225: objects inside other objects. An object names its parent with
 * `parent_entry_id` (2.19, the object dialog's *Parent object*); the lists of
 * objects show a sub-object inside its parent (Vehicles holding both cars,
 * Lawn & Garden the mower, the trimmer and the snow blower), the object page
 * lists its sub-objects and the breadcrumb climbs the chain.
 *
 * Pure functions over the panel's object list. The server refuses a cycle
 * (object/update walks the chain), but an import of hand-edited data could
 * still hold one: an object on a cycle counts as top level, so nothing
 * disappears and nothing is drawn twice.
 */

import type { MaintenanceObjectResponse } from "../types";

type Obj = MaintenanceObjectResponse;

export interface ObjectTree {
  /** Objects with no parent in the list (none set, or it is not shown —
   *  archived and hidden, deleted, in another area group): the top level,
   *  in the order given. */
  roots: Obj[];
  /** entry_id → the objects directly inside it, in the order given. */
  children: Map<string, Obj[]>;
}

function parentOf(o: Obj): string | null {
  return o.object.parent_entry_id || null;
}

/** The tree of `objs`: a parent counts only when it is in `objs` too. */
export function buildObjectTree(objs: readonly Obj[]): ObjectTree {
  const byId = new Map(objs.map((o) => [o.entry_id, o] as const));
  // On a cycle: the chain of parents (within the list) comes back to it.
  const onCycle = (start: Obj): boolean => {
    const seen = new Set<string>();
    let cur = parentOf(start);
    while (cur && byId.has(cur) && !seen.has(cur)) {
      if (cur === start.entry_id) return true;
      seen.add(cur);
      cur = parentOf(byId.get(cur)!);
    }
    return false;
  };

  const roots: Obj[] = [];
  const children = new Map<string, Obj[]>();
  for (const o of objs) {
    const parent = parentOf(o);
    if (!parent || !byId.has(parent) || onCycle(o)) {
      roots.push(o);
      continue;
    }
    // An object hanging off a cycle stays below its parent, which is a root.
    if (!children.has(parent)) children.set(parent, []);
    children.get(parent)!.push(o);
  }
  return { roots, children };
}

/** `obj` and every object below it, `obj` first (depth first). */
export function subtreeOf(tree: ObjectTree, obj: Obj): Obj[] {
  const out: Obj[] = [];
  const seen = new Set<string>();
  const walk = (o: Obj): void => {
    if (seen.has(o.entry_id)) return;
    seen.add(o.entry_id);
    out.push(o);
    for (const c of tree.children.get(o.entry_id) ?? []) walk(c);
  };
  walk(obj);
  return out;
}

/** The objects `entryId` sits inside, outermost first, from the full list
 *  (an archived parent too: the chain is what is stored). */
export function ancestorsOf(objs: readonly Obj[], entryId: string): Obj[] {
  const byId = new Map(objs.map((o) => [o.entry_id, o] as const));
  const chain: Obj[] = [];
  const seen = new Set<string>([entryId]);
  let cur = byId.get(entryId);
  while (cur) {
    const parent = parentOf(cur);
    if (!parent || seen.has(parent)) break;
    const next = byId.get(parent);
    if (!next) break;
    seen.add(parent);
    chain.unshift(next);
    cur = next;
  }
  return chain;
}

/** Every object below `entryId` in the full list — what may not become its
 *  parent (the server refuses the cycle; the picker does not offer it). */
export function descendantIds(objs: readonly Obj[], entryId: string): Set<string> {
  const kids = new Map<string, string[]>();
  for (const o of objs) {
    const parent = parentOf(o);
    if (parent) {
      if (!kids.has(parent)) kids.set(parent, []);
      kids.get(parent)!.push(o.entry_id);
    }
  }
  const out = new Set<string>();
  const stack = [...(kids.get(entryId) ?? [])];
  while (stack.length) {
    const id = stack.pop()!;
    if (id === entryId || out.has(id)) continue;
    out.add(id);
    stack.push(...(kids.get(id) ?? []));
  }
  return out;
}

/** Sort the top level and every list of sub-objects in place. */
export function sortTree(tree: ObjectTree, compare: (a: Obj, b: Obj) => number): void {
  tree.roots.sort(compare);
  for (const list of tree.children.values()) list.sort(compare);
}

/** The rows of a table drawn as a tree: depth first, a parent's rows only
 *  while it is open. */
export function treeRows(tree: ObjectTree, isOpen: (entryId: string) => boolean): Array<{ obj: Obj; depth: number }> {
  const rows: Array<{ obj: Obj; depth: number }> = [];
  const seen = new Set<string>();
  const walk = (o: Obj, depth: number): void => {
    if (seen.has(o.entry_id)) return;
    seen.add(o.entry_id);
    rows.push({ obj: o, depth });
    if (!isOpen(o.entry_id)) return;
    for (const c of tree.children.get(o.entry_id) ?? []) walk(c, depth + 1);
  };
  for (const r of tree.roots) walk(r, 0);
  return rows;
}
