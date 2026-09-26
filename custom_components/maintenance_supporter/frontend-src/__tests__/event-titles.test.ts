/**
 * #189: a calendar-driven task names the events behind its next date,
 * muted after the task name ("Put the bins out · Residual waste, Paper").
 */

import { expect } from "@open-wc/testing";
import { render } from "lit";
import { renderEventTitles } from "../helpers/event-titles.js";
import { sharedStyles } from "../styles.js";

function mount(titles: readonly string[] | null | undefined): HTMLElement {
  const host = document.createElement("div");
  render(renderEventTitles(titles), host);
  return host;
}

describe("event titles (#189)", () => {
  it("joins the titles after a separator", () => {
    const span = mount(["Residual waste", "Paper"]).querySelector(".event-titles");
    expect(span).to.exist;
    expect(span!.textContent).to.equal(" · Residual waste, Paper");
  });

  it("renders nothing without titles", () => {
    for (const empty of [[], null, undefined, ["", ""]]) {
      expect(mount(empty).querySelector(".event-titles"), JSON.stringify(empty)).to.equal(null);
    }
  });

  it("is styled muted by the shared styles every surface includes", () => {
    expect(sharedStyles.cssText).to.contain(".event-titles");
  });
});
