/**
 * i18n audit 2026-09-27: text that reached every user in English.
 *   - history notes the backend writes itself ("Completed from dashboard
 *     button" …) are translated where they are shown;
 *   - WS refusals with a translation key read in the user's language, and
 *     the server's English detail no longer rides along for other languages;
 *   - the card / dashboard picker entries and the generated dashboard.
 */
import { expect } from "@open-wc/testing";
import { historyNoteText } from "../helpers/history-note.js";
import { primeBackendErrors } from "../helpers/backend-errors.js";
import { localizePickerEntries } from "../helpers/picker-i18n.js";
import { describeWsError } from "../ws-errors.js";
import { setLocale, t } from "../styles.js";
import { MaintenanceDashboardStrategy, kpiMarkdownCard } from "../maintenance-dashboard-strategy.js";

const tick = (ms = 10) => new Promise((r) => setTimeout(r, ms));

describe("history notes the backend writes", () => {
  before(() => {
    setLocale("de", {
      hist_note_button: "Über die Dashboard-Schaltfläche erledigt",
      hist_note_reset: "Zurückgesetzt auf {date}",
      hist_note_trigger_removed: "Sensor-Auslöser entfernt (war: {entity}). Zeitplan umgestellt auf {schedule}.",
      manual: "Manuell",
    });
  });

  it("translates a known note and leaves a typed note alone", () => {
    expect(historyNoteText("Completed from dashboard button", "de")).to.equal("Über die Dashboard-Schaltfläche erledigt");
    expect(historyNoteText("Filter getauscht, alles sauber", "de")).to.equal("Filter getauscht, alles sauber");
    expect(historyNoteText(null, "de")).to.equal("");
  });

  it("fills the values of a note with details", () => {
    expect(historyNoteText("Sensor trigger removed (entity was: sensor.x). Schedule converted to manual.", "de")).to.equal(
      "Sensor-Auslöser entfernt (war: sensor.x). Zeitplan umgestellt auf Manuell.",
    );
    expect(historyNoteText("Reset to 2026-09-01", "de")).to.match(/^Zurückgesetzt auf .*2026/);
  });

  it("reads English in English", () => {
    expect(historyNoteText("Completed from dashboard button", "en")).to.equal(t("hist_note_button", "en"));
  });
});

describe("backend refusals", () => {
  it("a refusal with a translation key reads in the user's language", async () => {
    const texts: Record<string, string> = {
      "component.maintenance_supporter.exceptions.object_name_taken.message": "Ein anderes Objekt hat bereits diesen Namen.",
      "component.maintenance_supporter.exceptions.task_limit.message": "Ein Objekt kann höchstens {max} Aufgaben haben.",
    };
    primeBackendErrors({
      language: "de",
      loadBackendTranslation: async () => (key: string, values?: Record<string, unknown>) =>
        (texts[key] ?? key).replace(/\{(\w+)\}/g, (all, n: string) => String(values?.[n] ?? all)),
    });
    await tick();
    const refusal = {
      code: "invalid_input",
      message: "Another object already has this name",
      translation_domain: "maintenance_supporter",
      translation_key: "object_name_taken",
    };
    expect(describeWsError(refusal, "de")).to.equal("Ein anderes Objekt hat bereits diesen Namen.");
    const limit = { code: "limit_reached", message: "x", translation_domain: "maintenance_supporter", translation_key: "task_limit", translation_placeholders: { max: "200" } };
    expect(describeWsError(limit, "de")).to.equal("Ein Objekt kann höchstens 200 Aufgaben haben.");
  });

  it("the English server detail rides along only for English users", () => {
    const refusal = { code: "limit_reached", message: "At most 100 parts per object" };
    expect(describeWsError(refusal, "en")).to.include("(At most 100 parts per object)");
    expect(describeWsError(refusal, "de")).to.not.include("At most");
  });
});

describe("picker entries", () => {
  it("are rewritten in the user's language and back", () => {
    const w = window as unknown as { customCards?: Array<{ type: string; name: string; description?: string }> };
    const entry = { type: "maintenance-budget-section-card", name: "Maintenance Supporter — Budget", description: "Edit the monthly and yearly budget right on the dashboard." };
    w.customCards = [entry];
    setLocale("de", { picker_name_budget: "Maintenance Supporter — Budget (de)", picker_desc_budget: "Monats- und Jahresbudget direkt im Dashboard bearbeiten." });
    localizePickerEntries("de");
    expect(entry.description).to.equal("Monats- und Jahresbudget direkt im Dashboard bearbeiten.");
    expect(entry.name).to.equal("Maintenance Supporter — Budget (de)");
    localizePickerEntries("en");
    expect(entry.description).to.equal("Edit the monthly and yearly budget right on the dashboard.");
  });
});

describe("generated dashboard", () => {
  it("names its views in the user's language", async () => {
    setLocale("de", { overview: "Übersicht", maintenance: "Wartung", overdue: "Überfällig", strat_this_month: "Diesen Monat" });
    const hass = {
      language: "de",
      connection: {
        sendMessagePromise: async (msg: { type: string }) =>
          msg.type === "maintenance_supporter/objects"
            ? { objects: [{ entry_id: "e1", object: { id: "o1", name: "Pumpe", area_id: null }, tasks: [{ status: "overdue", days_until_due: -2 }, { status: "ok", days_until_due: 20 }] }] }
            : {},
      },
    };
    const dash = (await MaintenanceDashboardStrategy.generate({ type: "custom:maintenance-supporter", group_by: "due_date" }, hass)) as {
      title: string;
      views: Array<{ title: string }>;
    };
    expect(dash.title).to.equal("Wartung");
    const titles = dash.views.map((v) => v.title);
    expect(titles).to.include("Übersicht");
    expect(titles).to.include("Überfällig");
    expect(titles).to.include("Diesen Monat");
    expect(kpiMarkdownCard({}, { overdue: 1 }).content as unknown as string).to.include("Überfällig");
  });
});
