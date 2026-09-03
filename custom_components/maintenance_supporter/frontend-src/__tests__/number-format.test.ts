/** formatNumber / formatCost honour HA's per-user profile number format
 *  (Profile → Number format) exactly like the frontend's own formatNumber —
 *  the number_format half of #163: costs rendered via toFixed(2) showed
 *  "12.50 €" to a user whose entity cards all say "12,50 €". */

import { expect } from "@open-wc/testing";
import { formatNumber, formatCost, setProfilePrefs } from "../styles";
import { fmtNum, fmtVal, px } from "../renderers/chart-utils";
import { formatBytes } from "../helpers/format-bytes";

const reset = () => setProfilePrefs({ date_format: undefined, time_format: undefined, number_format: undefined }, null);

describe("formatNumber with HA profile number_format (#163)", () => {
  afterEach(reset);

  it("language default follows the UI language, not the server country", () => {
    setProfilePrefs({ number_format: "language" }, "AT");
    expect(formatNumber(1234.5, "en")).to.equal("1,234.5");
    expect(formatNumber(1234.5, "de")).to.equal("1.234,5");
    expect(formatNumber(1234.5, "fr")).to.match(/^1[\u202f\u00a0 ]234,5$/);
  });

  it("explicit styles win over the language", () => {
    setProfilePrefs({ number_format: "decimal_comma" });
    expect(formatNumber(1234.56, "en")).to.equal("1.234,56");
    setProfilePrefs({ number_format: "comma_decimal" });
    expect(formatNumber(1234.56, "de")).to.equal("1,234.56");
    setProfilePrefs({ number_format: "space_comma" });
    expect(formatNumber(1234.56, "en")).to.match(/^1[\u202f\u00a0 ]234,56$/);
  });

  it("none = plain digits, no grouping, trailing zeros dropped (HA parity)", () => {
    setProfilePrefs({ number_format: "none" });
    expect(formatNumber(1234.5, "de")).to.equal("1234.5");
    expect(formatNumber(12.5, "en", 2)).to.equal("12.5");
    expect(formatNumber(1.23456, "en")).to.equal("1.23");
  });

  it("system falls back to the browser locale without throwing", () => {
    setProfilePrefs({ number_format: "system" });
    expect(formatNumber(1234.5, "de")).to.match(/1.?234.5/);
  });

  it("digits pins the fraction digits like toFixed; options pass through", () => {
    setProfilePrefs({ number_format: "language" });
    expect(formatNumber(12.5, "en", 2)).to.equal("12.50");
    expect(formatNumber(12.5, "de", 2)).to.equal("12,50");
    expect(formatNumber(12.5, "en", 0)).to.equal("13");
    expect(formatNumber(0.1234, "en", { maximumFractionDigits: 3 })).to.equal("0.123");
    expect(formatNumber(7, "en")).to.equal("7");
    expect(formatNumber(NaN, "en")).to.equal("NaN");
  });

  it("formatCost appends the symbol only when there is one", () => {
    setProfilePrefs({ number_format: "language" });
    expect(formatCost(194.5, "€", "en")).to.equal("194.50 €");
    expect(formatCost(194.5, "€", "de")).to.equal("194,50 €");
    expect(formatCost(150, "CHF", "en", 0)).to.equal("150 CHF");
    expect(formatCost(12.5, "", "en")).to.equal("12.50");
    expect(formatCost(12.5, undefined, "en")).to.equal("12.50");
  });
});

describe("chart + storage helpers route through formatNumber", () => {
  afterEach(reset);

  it("fmtNum keeps its compact shape and takes the profile decimal separator", () => {
    setProfilePrefs({ number_format: "language" });
    expect(fmtNum(1234, "en")).to.equal("1.2k");
    expect(fmtNum(1234, "de")).to.equal("1,2k");
    expect(fmtNum(88000, "en")).to.equal("88k");
    expect(fmtNum(1_500_000, "en")).to.equal("1.5M");
    expect(fmtNum(730.4, "en")).to.equal("730");
    expect(fmtNum(7.5, "en")).to.equal("7.5");
    expect(fmtNum(7, "en")).to.equal("7");
    expect(fmtNum(0.42, "en")).to.equal("0.42");
    expect(fmtNum(0, "en")).to.equal("0");
  });

  it("fmtVal groups per profile", () => {
    setProfilePrefs({ number_format: "decimal_comma" });
    expect(fmtVal(1234.56, "kWh", "en")).to.equal("1.235 kWh");
    expect(fmtVal(12.34, "", "en")).to.equal("12,3");
  });

  it("formatBytes follows the profile; px() never does", () => {
    setProfilePrefs({ number_format: "decimal_comma" });
    expect(formatBytes(1536, "en")).to.equal("1,5 KB");
    expect(formatBytes(3 * 1024 * 1024, "en")).to.equal("3,0 MB");
    expect(formatBytes(512, "en")).to.equal("512 B");
    expect(px(12.345)).to.equal("12.3");
  });
});
