/**
 * Typed date entry (forum #23): parseTypedDate honours the profile's date
 * order for slash/dash input, treats dots as day-first, accepts a bare year
 * and month/year, refuses non-dates; and <ms-date-field kind="date"> offers a
 * keyboard toggle whose text input commits on Enter as a `value-changed`.
 */
import { expect, fixture, html } from "@open-wc/testing";
import "../components/ms-date-field.js";
import type { MsDateField } from "../components/ms-date-field";
import { detectDateOrder, parseTypedDate } from "../helpers/date-parse.js";
import { setProfilePrefs } from "../styles.js";

describe("parseTypedDate (#23)", () => {
  afterEach(() => setProfilePrefs({ date_format: "language" }));

  it("ISO, bare year and month/year", () => {
    expect(parseTypedDate("1978-03-15")).to.equal("1978-03-15");
    expect(parseTypedDate(" 1978-3-5 ")).to.equal("1978-03-05");
    expect(parseTypedDate("1978")).to.equal("1978-01-01");
    expect(parseTypedDate("03/1978")).to.equal("1978-03-01");
    expect(parseTypedDate("3.1978")).to.equal("1978-03-01");
  });

  it("dots are day-first regardless of profile; slashes follow the profile order", () => {
    setProfilePrefs({ date_format: "MDY" });
    expect(detectDateOrder("en")).to.equal("MDY");
    expect(parseTypedDate("15.03.1978", "en")).to.equal("1978-03-15");
    expect(parseTypedDate("03/15/1978", "en")).to.equal("1978-03-15");
    setProfilePrefs({ date_format: "DMY" });
    expect(detectDateOrder("en")).to.equal("DMY");
    expect(parseTypedDate("15/03/1978", "en")).to.equal("1978-03-15");
    expect(parseTypedDate("15-03-1978", "en")).to.equal("1978-03-15");
    setProfilePrefs({ date_format: "YMD" });
    expect(detectDateOrder("en")).to.equal("YMD");
  });

  it("refuses non-dates and impossible calendar dates", () => {
    expect(parseTypedDate("")).to.equal(null);
    expect(parseTypedDate("yesterday")).to.equal(null);
    expect(parseTypedDate("1978-02-31")).to.equal(null);
    expect(parseTypedDate("31.13.1978")).to.equal(null);
    expect(parseTypedDate("978")).to.equal(null);
  });
});

describe("ms-date-field: type the date (#23)", () => {
  async function mount(value = ""): Promise<{ el: MsDateField; events: string[] }> {
    const events: string[] = [];
    const el = await fixture<MsDateField>(html`<ms-date-field kind="date" lang="en" clearable .value=${value}
      @value-changed=${(e: CustomEvent) => events.push(e.detail.value)}></ms-date-field>`);
    await el.updateComplete;
    return { el, events };
  }

  it("the keyboard toggle swaps in a text input that commits on Enter", async () => {
    const { el, events } = await mount();
    const toggle = el.shadowRoot!.querySelector<HTMLButtonElement>("button.type-toggle");
    expect(toggle, "toggle present for kind=date").to.exist;
    toggle!.click();
    await el.updateComplete;
    const input = el.shadowRoot!.querySelector<HTMLInputElement>("input.typed")!;
    expect(input).to.exist;
    input.value = "15.03.1978";
    input.dispatchEvent(new Event("input"));
    input.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
    await el.updateComplete;
    expect(events).to.deep.equal(["1978-03-15"]);
    expect(el.value).to.equal("1978-03-15");
    expect(el.shadowRoot!.querySelector("input.typed"), "back to the picker after a valid date").to.not.exist;
  });

  it("an invalid entry shows the hint and keeps the input open; Escape cancels", async () => {
    const { el, events } = await mount("2020-01-01");
    el.shadowRoot!.querySelector<HTMLButtonElement>("button.type-toggle")!.click();
    await el.updateComplete;
    const input = el.shadowRoot!.querySelector<HTMLInputElement>("input.typed")!;
    expect(input.value, "prefilled with the current ISO value").to.equal("2020-01-01");
    input.value = "not a date";
    input.dispatchEvent(new Event("input"));
    input.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
    await el.updateComplete;
    expect(events).to.deep.equal([]);
    expect(el.shadowRoot!.querySelector("input.typed")).to.exist;
    expect(el.shadowRoot!.textContent).to.contain("1978-03-15");
    input.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector("input.typed")).to.not.exist;
    expect(el.value).to.equal("2020-01-01");
  });

  it("no toggle for time fields", async () => {
    const el = await fixture<MsDateField>(html`<ms-date-field kind="time" lang="en"></ms-date-field>`);
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector("button.type-toggle")).to.not.exist;
  });
});
