/**
 * <ms-date-field> (#163): the date / time / datetime input that follows the
 * HA profile format. Native `<input type="date|time|datetime-local">` renders
 * in the BROWSER locale no matter what the user picked under Profile → Date
 * format, so every form now goes through <ha-selector>. The wrapper owns the
 * one conversion between HA's selector values and the value contract the
 * consumers store ("YYYY-MM-DD", "HH:MM", "YYYY-MM-DDTHH:MM:SS", "" = empty).
 *
 * ha-selector is an HA element and stays undefined here; what is under test is
 * the wiring around it — value in, event out, clear affordance.
 */

import { expect, fixture, html, oneEvent } from "@open-wc/testing";
import "../components/ms-date-field.js";
import { fromSelectorValue, toSelectorValue } from "../components/ms-date-field";
import type { MsDateField } from "../components/ms-date-field";
import { pickDateField } from "./_test-utils.js";

type SelectorEl = HTMLElement & { selector?: unknown; value?: unknown; required?: boolean; disabled?: boolean };

const inner = (el: MsDateField) => el.shadowRoot!.querySelector<SelectorEl>("ha-selector")!;

describe("ms-date-field conversions", () => {
  it("date: contract ↔ selector are both YYYY-MM-DD; a datetime is trimmed to its day", () => {
    expect(toSelectorValue("date", "2026-09-03")).to.equal("2026-09-03");
    expect(toSelectorValue("date", "2026-09-03T10:00:00")).to.equal("2026-09-03");
    expect(toSelectorValue("date", "")).to.equal(undefined);
    expect(fromSelectorValue("date", "2026-09-03")).to.equal("2026-09-03");
    expect(fromSelectorValue("date", undefined)).to.equal("");
  });

  it("time: the selector speaks HH:MM:SS, the contract HH:MM", () => {
    expect(toSelectorValue("time", "07:30")).to.equal("07:30:00");
    expect(toSelectorValue("time", "07:30:15")).to.equal("07:30:15");
    expect(fromSelectorValue("time", "07:30:00")).to.equal("07:30");
    // ha-time-input reports undefined when cleared.
    expect(fromSelectorValue("time", undefined)).to.equal("");
  });

  it("datetime: the selector joins with a space, the contract with a T, seconds always present", () => {
    expect(toSelectorValue("datetime", "2026-01-10T14:30:00")).to.equal("2026-01-10 14:30:00");
    expect(toSelectorValue("datetime", "2026-01-10T14:30")).to.equal("2026-01-10 14:30:00");
    expect(fromSelectorValue("datetime", "2026-01-10 14:30:00")).to.equal("2026-01-10T14:30:00");
    expect(fromSelectorValue("datetime", "2026-01-10 14:30")).to.equal("2026-01-10T14:30:00");
    expect(fromSelectorValue("datetime", 42)).to.equal("");
  });
});

describe("ms-date-field element", () => {
  it("hands ha-selector the kind-specific selector and the converted value", async () => {
    const el = await fixture<MsDateField>(html`
      <ms-date-field kind="time" .value=${"07:30"} required></ms-date-field>
    `);
    const sel = inner(el);
    expect(sel, "ha-selector rendered").to.exist;
    expect(sel.selector).to.deep.equal({ time: { no_second: true } });
    expect(sel.value).to.equal("07:30:00");
    expect(sel.required).to.equal(true);

    const dt = await fixture<MsDateField>(html`
      <ms-date-field kind="datetime" .value=${"2026-01-10T14:30:00"}></ms-date-field>
    `);
    expect(inner(dt).selector).to.deep.equal({ datetime: {} });
    expect(inner(dt).value).to.equal("2026-01-10 14:30:00");
    expect(inner(dt).required).to.equal(false);
  });

  it("re-emits the selector's value-changed in the contract format and swallows the raw event", async () => {
    const el = await fixture<MsDateField>(html`<ms-date-field kind="datetime"></ms-date-field>`);
    const seen: unknown[] = [];
    el.addEventListener("value-changed", (e) => seen.push((e as CustomEvent).detail.value));
    pickDateField(el, "2026-01-10 14:30:00");
    expect(seen, "exactly one event, in the contract format").to.deep.equal(["2026-01-10T14:30:00"]);
    expect(el.value).to.equal("2026-01-10T14:30:00");
  });

  it("does not re-emit when the selector reports the value it already holds", async () => {
    const el = await fixture<MsDateField>(html`<ms-date-field kind="date" .value=${"2026-09-03"}></ms-date-field>`);
    let n = 0;
    el.addEventListener("value-changed", () => n++);
    pickDateField(el, "2026-09-03");
    expect(n).to.equal(0);
  });

  it("shows the ✕ only when clearable AND holding a value; clicking it emits an empty value", async () => {
    const el = await fixture<MsDateField>(html`<ms-date-field kind="date" clearable></ms-date-field>`);
    expect(el.shadowRoot!.querySelector(".clear"), "empty field: no clear").to.be.null;

    el.value = "2026-09-03";
    await el.updateComplete;
    const clear = el.shadowRoot!.querySelector<HTMLButtonElement>(".clear")!;
    expect(clear, "clear appears with a value").to.exist;
    expect(clear.getAttribute("aria-label")).to.equal("Clear");

    setTimeout(() => clear.click());
    const ev = await oneEvent(el, "value-changed");
    expect((ev as CustomEvent).detail.value).to.equal("");
    expect(el.value).to.equal("");
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector(".clear"), "clear gone again").to.be.null;
  });

  it("a non-clearable or disabled field never offers the ✕", async () => {
    const plain = await fixture<MsDateField>(html`<ms-date-field kind="date" .value=${"2026-09-03"}></ms-date-field>`);
    expect(plain.shadowRoot!.querySelector(".clear")).to.be.null;
    const off = await fixture<MsDateField>(html`<ms-date-field kind="date" clearable disabled .value=${"2026-09-03"}></ms-date-field>`);
    expect(off.shadowRoot!.querySelector(".clear")).to.be.null;
    expect(inner(off).disabled).to.equal(true);
  });

  it("renders label, required marker and helper text", async () => {
    const el = await fixture<MsDateField>(html`
      <ms-date-field kind="date" label="Due" required helper="Pick a day"></ms-date-field>
    `);
    const sr = el.shadowRoot!;
    expect(sr.querySelector(".label")!.textContent).to.include("Due");
    expect(sr.querySelector(".req"), "required marker").to.exist;
    expect(sr.querySelector(".helper")!.textContent).to.equal("Pick a day");
  });
});
