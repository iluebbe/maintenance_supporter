/**
 * GitHub issues answered 2026-11-17.
 *
 * #274: a task on a weekdays / nth-weekday / day-of-month / calendar schedule
 * showed its days left in the task list but no bar under them. The bar ran
 * over the task's interval, and those schedules have none. The server now
 * sends one cycle of them (`cycle_days`, the length that caps their warning
 * window too), and the list and the task's page run the bar over it.
 *
 * #265 (stage 2): a supplier without a web shop takes orders by e-mail. A part
 * whose link is a mailto: address opened an e-mail for that part alone; with
 * two or more such parts on an object, they can be ticked, and the ticked ones
 * go into one e-mail per address.
 */

import { expect, fixture, html, waitUntil } from "@open-wc/testing";
import { cycleSpanDays } from "../helpers/interval";
import { mailAddress, orderMails } from "../helpers/order-mail";
import "../components/parts-section.js";
import type { MaintenancePartsSection } from "../components/parts-section";
import { renderDaysProgress } from "../renderers/progress.js";
import { mountPanel, obj, task } from "./_panel-utils.js";
import type { MaintenancePart, MaintenanceTask } from "../types";

describe("#274 the due bar of a calendar schedule", () => {
  it("one cycle: the interval's, else the one the server measured", () => {
    expect(cycleSpanDays({ interval_days: 2, interval_unit: "weeks" })).to.equal(14);
    expect(cycleSpanDays({ interval_days: null, cycle_days: 30 })).to.equal(30);
    expect(cycleSpanDays({ interval_days: 7, cycle_days: 30 }), "an interval wins").to.equal(7);
    expect(cycleSpanDays({ interval_days: null, cycle_days: null })).to.equal(0);
    expect(cycleSpanDays({ interval_days: null, cycle_days: 0 })).to.equal(0);
  });

  const rowOf = (el: HTMLElement, name: string) =>
    [...el.shadowRoot!.querySelectorAll<HTMLElement>(".task-row:not(.virt-sizer)")].find((r) => r.textContent!.includes(name)) ?? null;
  const barWidth = (row: HTMLElement | null) => {
    const fill = row?.querySelector<HTMLElement>(".days-bar-fill");
    return fill ? parseFloat(fill.style.width) : null;
  };

  it("the task list draws it for every calendar kind, and still for an interval", async () => {
    const { el } = await mountPanel([obj("e274", [
      task({ name: "Test the alarm", schedule_type: "nth_weekday", interval_days: null, cycle_days: 30, days_until_due: 20 }),
      task({ name: "Read the meter", schedule_type: "day_of_month", interval_days: null, cycle_days: 30, days_until_due: 3, status: "due_soon" }),
      task({ name: "Water the plants", schedule_type: "weekdays", interval_days: null, cycle_days: 3, days_until_due: 1 }),
      task({ name: "Bin day", schedule_type: "calendar", interval_days: null, cycle_days: 7, days_until_due: 7 }),
      task({ name: "Clean the filter", schedule_type: "time_based", interval_days: 30, days_until_due: 10 }),
    ])]);
    await waitUntil(() => rowOf(el, "Clean the filter"), "the list is drawn");
    expect(barWidth(rowOf(el, "Test the alarm"))).to.be.closeTo(33.3, 0.1);
    expect(barWidth(rowOf(el, "Read the meter"))).to.be.closeTo(90, 0.1);
    expect(barWidth(rowOf(el, "Water the plants"))).to.be.closeTo(66.7, 0.1);
    expect(barWidth(rowOf(el, "Bin day")), "a fresh cycle is an empty bar, not none").to.equal(0);
    expect(barWidth(rowOf(el, "Clean the filter"))).to.be.closeTo(66.7, 0.1);
    el.remove();
  });

  it("no bar without a cycle: a sensor task, a manual one, an old summary", async () => {
    const { el } = await mountPanel([obj("e274b", [
      task({ name: "Refill the salt", schedule_type: "sensor_based", interval_days: null, cycle_days: null, days_until_due: 20 }),
      task({ name: "Descale", schedule_type: "manual", interval_days: 30, days_until_due: null }),
      task({ name: "Old server", schedule_type: "nth_weekday", interval_days: null, days_until_due: 20 }),
    ])]);
    await waitUntil(() => rowOf(el, "Old server"), "the list is drawn");
    for (const name of ["Refill the salt", "Descale", "Old server"]) {
      expect(!!rowOf(el, name)!.querySelector(".days-bar"), name).to.be.false;
    }
    el.remove();
  });

  const detailBar = async (t: Partial<MaintenanceTask>): Promise<number | null> => {
    const el = await fixture(html`<div>${renderDaysProgress({
      id: "t", name: "x", status: "ok", schedule_type: "day_of_month", interval_days: null,
      last_performed: null, next_due: "2026-12-15", ...t,
    } as unknown as MaintenanceTask, "en")}</div>`);
    const bar = el.querySelector(".days-progress-bar");
    return bar ? Number(bar.getAttribute("aria-valuenow")) : null;
  };

  it("the task's page draws it too", async () => {
    expect(await detailBar({ cycle_days: 30, days_until_due: 20 })).to.equal(33);
    expect(await detailBar({ cycle_days: null, days_until_due: 20 }), "no cycle, no bar").to.equal(null);
    expect(await detailBar({ cycle_days: 30, days_until_due: null }), "no date, no bar").to.equal(null);
  });
});

// ─── #265: several parts in one order e-mail ─────────────────────────────

/** The fields of a mailto: link, decoded. */
function fieldsOf(url: string): Record<string, string> {
  const query = url.slice(url.indexOf("?") + 1);
  return Object.fromEntries(query.split("&").map((kv) => kv.split("=").map(decodeURIComponent) as [string, string]));
}

const oil = { id: "p1", name: "Oil filter", product_url: "mailto:parts@supplier.example", order_lines: ["2× Oil filter", "ACME · MPN: OF-12"] };
const air = { id: "p2", name: "Air filter", product_url: "mailto:Parts@Supplier.example", order_lines: ["1× Air filter"] };
const plug = { id: "p3", name: "Spark plug", product_url: "mailto:other@dealer.example", order_lines: ["4× Spark plug"] };
const web = { id: "p4", name: "Belt", product_url: "https://shop.example/belt", order_lines: null };

describe("#265 one e-mail for several parts", () => {
  it("one e-mail per address, the parts in it one after the other", () => {
    const mails = orderMails([oil, air, plug, web]);
    expect(mails.map((m) => [m.address, m.partIds])).to.deep.equal([
      ["parts@supplier.example", ["p1", "p2"]], // an address in other case is the same supplier
      ["other@dealer.example", ["p3"]],
    ]);
    expect(mails[0].url.startsWith("mailto:parts@supplier.example?")).to.be.true;
    expect(fieldsOf(mails[0].url)).to.deep.equal({
      subject: "Oil filter, Air filter",
      body: "2× Oil filter\nACME · MPN: OF-12\n\n1× Air filter",
    });
  });

  it("a link's own subject, text and copy stay", () => {
    const own = { ...oil, product_url: "mailto:parts@supplier.example?subject=Order%20ACME&body=Customer%20no.%2042&cc=me@home.example" };
    const [mail] = orderMails([own, air]);
    expect(fieldsOf(mail.url)).to.deep.equal({
      subject: "Order ACME",
      cc: "me@home.example",
      body: "Customer no. 42\n\n2× Oil filter\nACME · MPN: OF-12\n\n1× Air filter",
    });
  });

  it("only a mailto: link with its lines counts", () => {
    expect(mailAddress("mailto:a@b.example?subject=x")).to.equal("a@b.example");
    expect(mailAddress("https://a@b.example")).to.equal(null);
    expect(mailAddress("mailto:nobody")).to.equal(null);
    expect(orderMails([web, { ...oil, order_lines: [] }])).to.deep.equal([]);
  });

  const mount = async (parts: Partial<MaintenancePart>[]) => {
    const el = await fixture<MaintenancePartsSection>(html`
      <maintenance-parts-section .hass=${{ language: "en", connection: { sendMessagePromise: async () => ({}) } } as never}
        .entryId=${"e265"} .parts=${parts as MaintenancePart[]} .canWrite=${false}></maintenance-parts-section>
    `);
    await el.updateComplete;
    return el;
  };
  const rows = (el: HTMLElement) => [...el.shadowRoot!.querySelectorAll<HTMLElement>(".part-row")];
  const tick = async (el: MaintenancePartsSection, row: HTMLElement) => {
    const box = row.querySelector<HTMLInputElement>("input.mail-pick")!;
    box.checked = !box.checked;
    box.dispatchEvent(new Event("change"));
    await el.updateComplete;
  };

  it("the parts section ticks parts and offers one e-mail per supplier", async () => {
    const el = await mount([oil, web, air, plug]);
    const [r1, r2, r3, r4] = rows(el);
    expect([r1, r2, r3, r4].map((r) => !!r.querySelector("input.mail-pick"))).to.deep.equal([true, false, true, true]);
    expect(!!r2.querySelector("span.mail-pick"), "a part without e-mail keeps the room").to.be.true;
    expect(!!el.shadowRoot!.querySelector(".mail-bar"), "nothing ticked, nothing to send").to.be.false;

    await tick(el, r1);
    await tick(el, r3);
    let links = [...el.shadowRoot!.querySelectorAll<HTMLAnchorElement>("a.mail-order")];
    expect(links.map((a) => a.textContent!.trim())).to.deep.equal(["E-mail the order (2) to parts@supplier.example"]);
    expect(fieldsOf(links[0].getAttribute("href")!).subject).to.equal("Oil filter, Air filter");

    await tick(el, r4);
    links = [...el.shadowRoot!.querySelectorAll<HTMLAnchorElement>("a.mail-order")];
    expect(links).to.have.length(2);

    el.shadowRoot!.querySelector<HTMLElement>(".mail-clear")!.click();
    await el.updateComplete;
    expect(!!el.shadowRoot!.querySelector(".mail-bar"), "unticked").to.be.false;
  });

  it("a sent e-mail unticks its parts, after the click", async () => {
    const el = await mount([oil, air, plug]);
    const [r1, r2, r3] = rows(el);
    await tick(el, r1);
    await tick(el, r2);
    await tick(el, r3);
    const link = el.shadowRoot!.querySelector<HTMLAnchorElement>("a.mail-order")!;
    const href = link.getAttribute("href");
    link.addEventListener("click", (e) => e.preventDefault()); // no mail program in the test
    link.click();
    // The browser follows a link after the click's microtasks: one taken out
    // of the page by then is not followed, and one redrawn for the other
    // supplier would open that supplier's e-mail.
    await el.updateComplete;
    await Promise.resolve();
    expect(link.isConnected, "the link stays until the browser has followed it").to.be.true;
    expect(link.getAttribute("href"), "with the e-mail that was clicked").to.equal(href);
    await waitUntil(() => el.shadowRoot!.querySelectorAll("a.mail-order").length === 1, "the sent supplier's parts are unticked");
    expect(el.shadowRoot!.querySelector("a.mail-order")!.textContent).to.include("other@dealer.example");
  });

  it("a single part ordered by e-mail has its own link and no tick", async () => {
    const el = await mount([oil, web]);
    expect(!!el.shadowRoot!.querySelector(".mail-pick"), "no tick").to.be.false;
  });

  it("another object's page starts unticked", async () => {
    const el = await mount([oil, air]);
    await tick(el, rows(el)[0]);
    expect(!!el.shadowRoot!.querySelector(".mail-bar"), "ticked").to.be.true;
    el.entryId = "other";
    await el.updateComplete;
    expect(!!el.shadowRoot!.querySelector(".mail-bar"), "unticked on another object").to.be.false;
  });
});
