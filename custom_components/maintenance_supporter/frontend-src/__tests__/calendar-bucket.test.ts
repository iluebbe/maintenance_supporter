/**
 * Pure-function tests for the Calendar tab's bucketing + recurring projection
 * helper (v1.5.0).
 *
 * Pins:
 *   - tasks with next_due in the window land on the right day
 *   - tasks with next_due before the window are excluded (unless overdue)
 *   - overdue / triggered tasks bucket on "today" (windowStart)
 *   - time-based tasks project up to MAX_OCCURRENCES_PER_TASK occurrences
 *   - sensor-triggered tasks DO NOT get projected occurrences
 *   - user filter restricts to tasks with matching responsible_user_id
 *   - status sort within a day: overdue < triggered < due_soon < ok
 *   - disabled tasks never produce events
 */

import { expect } from "@open-wc/testing";
import {
  buildCalendarBuckets,
  isoDateLocal,
  MAX_OCCURRENCES_PER_TASK,
} from "../helpers/calendar-bucket";

const TODAY = new Date(2026, 4, 1);  // 2026-05-01 local
const TODAY_ISO = "2026-05-01";

function addDays(iso: string, days: number): string {
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  date.setDate(date.getDate() + days);
  return isoDateLocal(date);
}

function task(over: Partial<any> = {}) {
  return {
    id: "t1",
    name: "Filter Replacement",
    enabled: true,
    schedule_type: "time_based",
    interval_days: 30,
    status: "ok",
    next_due: addDays(TODAY_ISO, 5),
    days_until_due: 5,
    history: [],
    responsible_user_id: null,
    ...over,
  };
}

function obj(name: string, tasks: any[]) {
  return {
    entry_id: `entry-${name.toLowerCase().replace(/\s+/g, "-")}`,
    object: { id: `o-${name}`, name, area_id: null, manufacturer: null,
      model: null, serial_number: null, installation_date: null },
    tasks,
  } as any;
}

describe("buildCalendarBuckets", () => {
  it("returns one bucket per day in the window", () => {
    const buckets = buildCalendarBuckets([], TODAY, 7);
    expect(buckets).to.have.length(7);
    expect(buckets[0].date).to.equal(TODAY_ISO);
    expect(buckets[6].date).to.equal(addDays(TODAY_ISO, 6));
  });

  it("buckets a single task on its next_due day", () => {
    const buckets = buildCalendarBuckets(
      [obj("HVAC", [task({ next_due: addDays(TODAY_ISO, 3) })])],
      TODAY, 7
    );
    expect(buckets[3].events).to.have.length(1);
    expect(buckets[3].events[0].task_name).to.equal("Filter Replacement");
    expect(buckets[3].events[0].projected).to.equal(false);
  });

  it("excludes tasks whose next_due is before the window and not overdue", () => {
    const buckets = buildCalendarBuckets(
      [obj("HVAC", [task({ next_due: addDays(TODAY_ISO, -10), status: "ok" })])],
      TODAY, 7
    );
    const total = buckets.reduce((s, b) => s + b.events.length, 0);
    expect(total).to.equal(0);
  });

  it("buckets overdue tasks on today regardless of next_due", () => {
    const buckets = buildCalendarBuckets(
      [obj("HVAC", [task({
        next_due: addDays(TODAY_ISO, -15),
        status: "overdue",
        days_until_due: -15,
        interval_days: 90,  // 90d > 7d window → no projection within window
      })])],
      TODAY, 7
    );
    expect(buckets[0].events).to.have.length(1);
    expect(buckets[0].events[0].status).to.equal("overdue");
    expect(buckets[0].events[0].projected).to.equal(false);
  });

  it("projects time-based recurring occurrences within the window", () => {
    const buckets = buildCalendarBuckets(
      [obj("Pool", [task({
        next_due: addDays(TODAY_ISO, 2),
        interval_days: 7,
        schedule_type: "time_based",
      })])],
      TODAY, 30
    );
    // Window covers days 0..29. From next_due=+2 with step=7: +2, +9, +16, +23.
    // Next would be +30 which is outside the window, so 4 events total.
    const events = buckets.flatMap((b) => b.events);
    expect(events.length).to.equal(4);
    expect(events[0].projected).to.equal(false);
    expect(events.slice(1).every((e) => e.projected)).to.equal(true);
    expect(events[0].date).to.equal(addDays(TODAY_ISO, 2));
    expect(events[1].date).to.equal(addDays(TODAY_ISO, 9));
    expect(events[3].date).to.equal(addDays(TODAY_ISO, 23));
  });

  it("caps projection at MAX_OCCURRENCES_PER_TASK", () => {
    // 1-day interval with 30-day window would otherwise produce 30+ events
    const buckets = buildCalendarBuckets(
      [obj("Daily", [task({
        next_due: TODAY_ISO,
        interval_days: 1,
        schedule_type: "time_based",
        days_until_due: 0,
      })])],
      TODAY, 30
    );
    const events = buckets.flatMap((b) => b.events);
    expect(events.length).to.equal(MAX_OCCURRENCES_PER_TASK);
  });

  it("does NOT project sensor-triggered tasks beyond next_due", () => {
    const buckets = buildCalendarBuckets(
      [obj("HVAC", [task({
        schedule_type: "sensor_based",
        interval_days: 7,        // ignored — sensor tasks don't project
        next_due: addDays(TODAY_ISO, 3),
      })])],
      TODAY, 30
    );
    const events = buckets.flatMap((b) => b.events);
    expect(events).to.have.length(1);
    expect(events[0].projected).to.equal(false);
  });

  it("respects the user filter via responsible_user_id", () => {
    const buckets = buildCalendarBuckets(
      [obj("HVAC", [
        task({ id: "t-alice", responsible_user_id: "alice", next_due: addDays(TODAY_ISO, 1) }),
        task({ id: "t-bob", responsible_user_id: "bob", next_due: addDays(TODAY_ISO, 1) }),
        task({ id: "t-none", responsible_user_id: null, next_due: addDays(TODAY_ISO, 1) }),
      ])],
      TODAY, 7, "alice"
    );
    const events = buckets.flatMap((b) => b.events);
    expect(events).to.have.length(1);
    expect(events[0].task_id).to.equal("t-alice");
  });

  it("includes all users when filter is null", () => {
    const buckets = buildCalendarBuckets(
      [obj("HVAC", [
        task({ id: "t-alice", responsible_user_id: "alice", next_due: addDays(TODAY_ISO, 1) }),
        task({ id: "t-bob", responsible_user_id: "bob", next_due: addDays(TODAY_ISO, 1) }),
      ])],
      TODAY, 7, null
    );
    const events = buckets.flatMap((b) => b.events);
    expect(events).to.have.length(2);
  });

  it("orders within a day: overdue < triggered < due_soon < ok", () => {
    const due = addDays(TODAY_ISO, 0);
    const buckets = buildCalendarBuckets(
      [obj("HVAC", [
        task({ id: "t-ok", status: "ok", name: "OK Task", next_due: due, interval_days: 9999 }),
        task({ id: "t-overdue", status: "overdue", name: "Overdue Task",
               next_due: due, days_until_due: -5, interval_days: 9999 }),
        task({ id: "t-triggered", status: "triggered", name: "Triggered Task",
               schedule_type: "sensor_based", next_due: due, interval_days: null }),
        task({ id: "t-due_soon", status: "due_soon", name: "Due Soon Task",
               next_due: due, interval_days: 9999 }),
      ])],
      TODAY, 7
    );
    const todayEvents = buckets[0].events;
    expect(todayEvents.map((e) => e.status)).to.deep.equal([
      "overdue", "triggered", "due_soon", "ok",
    ]);
  });

  it("excludes disabled tasks", () => {
    const buckets = buildCalendarBuckets(
      [obj("HVAC", [task({ enabled: false, next_due: addDays(TODAY_ISO, 1) })])],
      TODAY, 7
    );
    const events = buckets.flatMap((b) => b.events);
    expect(events).to.have.length(0);
  });

  it("buckets first occurrence + projected ones for a 14-day window task", () => {
    const buckets = buildCalendarBuckets(
      [obj("Pool", [task({ next_due: addDays(TODAY_ISO, 1), interval_days: 14 })])],
      TODAY, 30
    );
    const events = buckets.flatMap((b) => b.events);
    expect(events.length).to.equal(3);  // +1, +15, +29
    expect(events[0].date).to.equal(addDays(TODAY_ISO, 1));
    expect(events[1].date).to.equal(addDays(TODAY_ISO, 15));
    expect(events[2].date).to.equal(addDays(TODAY_ISO, 29));
  });

  // v1.5.1: source indicator + prediction confidence
  it("flags adaptive_enabled when adaptive_config.enabled is true", () => {
    const buckets = buildCalendarBuckets(
      [obj("HVAC", [task({
        next_due: addDays(TODAY_ISO, 5),
        adaptive_config: { enabled: true },
      })])],
      TODAY, 7
    );
    const events = buckets.flatMap((b) => b.events);
    expect(events).to.have.length(1);
    expect(events[0].adaptive_enabled).to.equal(true);
    expect(events[0].prediction_confidence).to.equal(null);
  });

  it("propagates threshold_prediction_confidence for sensor-based tasks", () => {
    const buckets = buildCalendarBuckets(
      [obj("Pool", [task({
        schedule_type: "sensor_based",
        next_due: addDays(TODAY_ISO, 4),
        threshold_prediction_confidence: "high",
        interval_days: null,
      })])],
      TODAY, 14
    );
    const events = buckets.flatMap((b) => b.events);
    expect(events).to.have.length(1);
    expect(events[0].schedule_type).to.equal("sensor_based");
    expect(events[0].prediction_confidence).to.equal("high");
    expect(events[0].adaptive_enabled).to.equal(false);
  });

  it("downgrades status of projected occurrences from an overdue task to ok", () => {
    // The May 7 projection of an overdue task should NOT inherit "overdue"
    // — the projection is the assumption that the user completes today, so
    // the projected slot is hypothetical and starts fresh.
    const buckets = buildCalendarBuckets(
      [obj("Pool", [task({
        next_due: addDays(TODAY_ISO, -10),
        status: "overdue",
        days_until_due: -10,
        interval_days: 7,
      })])],
      TODAY, 30
    );
    const events = buckets.flatMap((b) => b.events);
    expect(events.length).to.be.greaterThan(1);
    expect(events[0].status).to.equal("overdue");  // first occurrence on today
    expect(events[0].projected).to.equal(false);
    // All projected occurrences should read "ok"
    for (const e of events.slice(1)) {
      expect(e.projected).to.equal(true);
      expect(e.status).to.equal("ok");
      expect(e.days_until_due).to.equal(null);
    }
  });

  it("defaults source fields to (false, null) when no metadata is present", () => {
    const buckets = buildCalendarBuckets(
      [obj("HVAC", [task({ next_due: addDays(TODAY_ISO, 2) })])],
      TODAY, 7
    );
    const events = buckets.flatMap((b) => b.events);
    expect(events).to.have.length(1);
    expect(events[0].adaptive_enabled).to.equal(false);
    expect(events[0].prediction_confidence).to.equal(null);
  });
});
