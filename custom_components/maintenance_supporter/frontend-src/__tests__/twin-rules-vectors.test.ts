/**
 * Rules the panel and the server each implement: tests/test_frontend_const_parity.py
 * reads the same vectors for the Python side (DRY audit 2026-10-30, X6-B8 /
 * X6-B10 / X6-B13).
 */

import { expect } from "@open-wc/testing";
import { mirrorListsOf } from "../helpers/mirror-lists.js";
import { taskUserIds } from "../helpers/assignees.js";
import { quickCompleteOn } from "../helpers/quick-complete.js";
import fixture from "./fixtures/twin-rules-vectors.json";

describe("twin rules, the shared vectors", () => {
  it("which lists a task is mirrored into", () => {
    for (const c of fixture.mirror_lists) {
      expect(mirrorListsOf(c.task as never, c.defaults), JSON.stringify(c.task)).to.deep.equal(c.lists);
    }
  });

  it("who a task is for", () => {
    for (const c of fixture.task_user_ids) {
      expect(taskUserIds(c.task as never), JSON.stringify(c.task)).to.deep.equal(c.ids);
    }
  });

  it("whether Quick complete is on", () => {
    for (const c of fixture.quick_complete_on) {
      expect(quickCompleteOn(c.task as never), JSON.stringify(c.task)).to.equal(c.on);
    }
  });
});
