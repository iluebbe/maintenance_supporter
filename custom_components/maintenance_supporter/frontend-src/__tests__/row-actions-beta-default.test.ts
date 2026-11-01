/**
 * Task rows show Complete / Skip as icons with the beta UI while the household
 * has not picked a style: Home Assistant's tables carry icons, the labelled
 * buttons were the biggest difference to them (user decision 2026-11-01). A
 * style someone picked stays, and the classic UI keeps its default.
 */

import { expect } from "@open-wc/testing";
import { effectiveRowActionStyle, parseSettings } from "../helpers/settings-cache";

describe("row actions: icons by default in the beta", () => {
  it("nobody chose: icons with the beta, the default without", () => {
    expect(effectiveRowActionStyle("buttons_compact", false, true)).to.equal("icons");
    expect(effectiveRowActionStyle("buttons_compact", false, false)).to.equal("buttons_compact");
  });

  it("a chosen style stays, beta or not; an older server counts as chosen", () => {
    expect(effectiveRowActionStyle("buttons", true, true)).to.equal("buttons");
    expect(effectiveRowActionStyle("buttons_compact", true, true)).to.equal("buttons_compact");
    expect(effectiveRowActionStyle("buttons_compact", undefined, true)).to.equal("buttons_compact");
    expect(effectiveRowActionStyle("bogus", true, false)).to.equal("buttons_compact");
  });

  it("the settings parser applies it from the answer's own beta switch", () => {
    const beta = parseSettings({ features: { beta_editor: true }, general: { row_action_style: "buttons_compact", row_action_style_set: false } });
    expect(beta.rowActionStyle).to.equal("icons");
    const chosen = parseSettings({ features: { beta_editor: true }, general: { row_action_style: "buttons", row_action_style_set: true } });
    expect(chosen.rowActionStyle).to.equal("buttons");
  });
});
