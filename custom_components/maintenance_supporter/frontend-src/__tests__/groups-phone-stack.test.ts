/**
 * #206 — the panel's groups on a phone.
 *
 * Before: `.group-card` kept `flex: 1` and dropped its min-width at ≤ 600 px,
 * so every group shared ONE row — three groups were 96 px each on a 360 px
 * phone, the 28 px edit + delete pair did not fit, and the delete button of
 * one group lay over the next group's card. Now each group gets its own row
 * on a phone, with 44 px buttons 8 px apart, and the desktop row is unchanged.
 *
 * Mounts the real panel at real viewport widths (web-test-runner drives a
 * real Chromium) and measures the cards and their buttons.
 */

import { expect, waitUntil } from "@open-wc/testing";
import { setViewport } from "@web/test-runner-commands";
import { DEFAULT_SETTINGS_RESPONSE } from "./_test-utils.js";
import { mountPanel, obj, resetTaskSeq, task } from "./_panel-utils.js";

// HA's ha-icon-button sizes itself by --ha-icon-button-size; the stand-in
// does the same, so the test measures the tap targets a phone shows.
if (!customElements.get("ha-icon-button")) {
  customElements.define(
    "ha-icon-button",
    class extends HTMLElement {
      connectedCallback() {
        if (this.shadowRoot) return;
        this.attachShadow({ mode: "open" }).innerHTML =
          "<style>:host{display:inline-block;width:var(--ha-icon-button-size,48px);height:var(--ha-icon-button-size,48px)}</style>";
      }
    },
  );
}

type Box = { l: number; r: number; t: number; b: number; w: number; h: number };
const box = (el: Element): Box => {
  const r = el.getBoundingClientRect();
  return { l: r.left, r: r.right, t: r.top, b: r.bottom, w: r.width, h: r.height };
};
const inside = (a: Box, outer: Box) => a.l >= outer.l - 0.5 && a.r <= outer.r + 0.5 && a.t >= outer.t - 0.5 && a.b <= outer.b + 0.5;
const intersects = (a: Box, b: Box) => a.l < b.r && b.l < a.r && a.t < b.b && b.t < a.b;

const GROUPS = (names: string[]) => ({
  groups: Object.fromEntries(
    names.map((name, i) => [
      `g${i}`,
      {
        name,
        description: i === 1 ? "Everything that has to be done before the first frost" : "",
        task_refs: i === 2 ? [] : [{ entry_id: "e1", task_id: "t1" }, { entry_id: "e1", task_id: "t2" }],
      },
    ]),
  ),
});

async function mountGroups(width: number, names = ["Weekly", "Outdoor and garden equipment before winter", "Car"]) {
  await setViewport({ width, height: 800 });
  const objects = [obj("e1", [task(), task({ name: "Filter Replacement" })])];
  const { el } = await mountPanel(objects, {
    "maintenance_supporter/settings": () => ({
      ...DEFAULT_SETTINGS_RESPONSE,
      features: { ...DEFAULT_SETTINGS_RESPONSE.features, groups: true },
    }),
    "maintenance_supporter/groups": () => GROUPS(names),
  });
  const sr = el.shadowRoot!;
  await waitUntil(() => sr.querySelectorAll(".group-card").length === names.length, "group cards rendered");
  await el.updateComplete;
  return [...sr.querySelectorAll(".group-card")].map((card) => ({
    card: box(card),
    buttons: [...card.querySelectorAll(".group-card-actions ha-icon-button")].map(box),
  }));
}

describe("#206 groups on a phone", () => {
  beforeEach(() => {
    resetTaskSeq();
    localStorage.clear();
    localStorage.setItem("msp-overview-tab", "dashboard");
  });
  after(async () => {
    await setViewport({ width: 1280, height: 800 });
  });

  for (const width of [360, 412]) {
    it(`gives every group its own row at ${width} px, its buttons inside its own card`, async () => {
      const cards = await mountGroups(width);
      const tops = cards.map((c) => c.card.t);
      expect(new Set(tops).size, "one row per group").to.equal(cards.length);
      for (let i = 1; i < cards.length; i++) expect(cards[i].card.t).to.be.at.least(cards[i - 1].card.b);
      // All groups equally wide: the full row, not a third of it.
      for (const c of cards) expect(c.card.w).to.be.closeTo(cards[0].card.w, 1);
      expect(cards[0].card.w).to.be.greaterThan(width * 0.75);
      cards.forEach((c, i) => {
        expect(c.buttons).to.have.length(2);
        for (const b of c.buttons) {
          expect(inside(b, c.card), `group ${i}: a button outside its card`).to.equal(true);
          cards.forEach((o, j) => {
            if (j !== i) expect(intersects(b, o.card), `group ${i}: a button over group ${j}`).to.equal(false);
          });
        }
        // Phone-sized tap targets, apart from each other.
        expect(c.buttons.map((b) => Math.round(b.w))).to.deep.equal([44, 44]);
        expect(c.buttons[1].l - c.buttons[0].r).to.be.at.least(8);
      });
    });
  }

  it("keeps the buttons in the card when the name is one long word (360 px)", async () => {
    const cards = await mountGroups(360, ["Gartengeräteüberwinterungsvorbereitungsliste", "Car"]);
    for (const c of cards) for (const b of c.buttons) expect(inside(b, c.card)).to.equal(true);
  });

  it("leaves the desktop row alone (groups side by side, 28 px buttons)", async () => {
    const cards = await mountGroups(1280);
    expect(cards[0].card.t).to.equal(cards[1].card.t);
    expect(cards[0].buttons.map((b) => Math.round(b.w))).to.deep.equal([28, 28]);
    for (const c of cards) for (const b of c.buttons) expect(inside(b, c.card)).to.equal(true);
  });
});
