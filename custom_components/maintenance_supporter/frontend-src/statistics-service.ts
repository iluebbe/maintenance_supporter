/**
 * Statistics service for fetching and caching HA recorder statistics.
 * Used by sparkline charts to display dense time-series data.
 */
import type { HomeAssistant, StatisticsPoint, EntityStatisticsCache, HAStatisticsRow } from "./types";

const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes
const DETAIL_DAYS = 30;
const MINI_DAYS = 14;

/** history/history_during_period rows — compressed keys over WS ({s, lu});
 *  the uncompressed REST shape is tolerated defensively. */
interface HAHistoryRow {
  s?: string;
  lu?: number;
  state?: string;
  last_updated?: string | number;
  last_changed?: string | number;
}

export class StatisticsService {
  private _hass: HomeAssistant;
  private _cache = new Map<string, EntityStatisticsCache>();
  private _pending = new Map<string, Promise<StatisticsPoint[]>>();

  /** #141: entities whose DETAIL series came from recorder state history
   *  instead of long-term statistics (binary sensors and other entities
   *  without a state_class never have statistics) — the chart footnote
   *  tells the two apart. */
  public readonly historyFallbackIds = new Set<string>();

  constructor(hass: HomeAssistant) {
    this._hass = hass;
  }

  updateHass(hass: HomeAssistant): void {
    this._hass = hass;
  }

  /**
   * Statistics for the detail chart. Hourly resolution for short ranges,
   * daily beyond ~5 weeks (keeps a 1-year window at ~365 points).
   */
  async getDetailStats(
    entityId: string,
    isCounter: boolean,
    days: number = DETAIL_DAYS,
  ): Promise<StatisticsPoint[]> {
    return this._getStats(entityId, days <= 35 ? "hour" : "day", days, isCounter);
  }

  /**
   * Get 14 days of daily statistics for the mini-sparkline (60x20 chart).
   */
  async getMiniStats(entityId: string, isCounter: boolean): Promise<StatisticsPoint[]> {
    return this._getStats(entityId, "day", MINI_DAYS, isCounter);
  }

  /**
   * Batch-fetch mini stats for multiple entities in at most 2 WS calls
   * (one for counter-type, one for non-counter-type entities).
   */
  async getBatchMiniStats(
    entities: Array<{ entityId: string; isCounter: boolean }>,
  ): Promise<Map<string, StatisticsPoint[]>> {
    const result = new Map<string, StatisticsPoint[]>();
    const toFetch: Array<{ entityId: string; isCounter: boolean }> = [];

    // Check cache first, collect cache misses (same key shape as _getStats
    // so the single-entity mini path and the batch path share the cache).
    for (const e of entities) {
      const cacheKey = `${e.entityId}:day:${MINI_DAYS}`;
      const cached = this._cache.get(cacheKey);
      if (cached && Date.now() - cached.fetchedAt < CACHE_TTL_MS) {
        result.set(e.entityId, cached.points);
      } else {
        toFetch.push(e);
      }
    }

    if (toFetch.length === 0) return result;

    // Group by type (counter vs non-counter need different stat types)
    const counterIds = toFetch.filter((e) => e.isCounter).map((e) => e.entityId);
    const nonCounterIds = toFetch.filter((e) => !e.isCounter).map((e) => e.entityId);
    const startTime = new Date(Date.now() - MINI_DAYS * 24 * 60 * 60 * 1000).toISOString();

    const promises: Promise<void>[] = [];

    if (counterIds.length > 0) {
      promises.push(
        this._fetchBatch(counterIds, "day", startTime, ["state", "sum", "change"], true, result),
      );
    }
    if (nonCounterIds.length > 0) {
      promises.push(
        this._fetchBatch(nonCounterIds, "day", startTime, ["mean", "min", "max"], false, result),
      );
    }

    await Promise.all(promises);
    return result;
  }

  clearCache(): void {
    this._cache.clear();
    this._pending.clear();
  }

  private async _getStats(
    entityId: string,
    period: "hour" | "day",
    days: number,
    isCounter: boolean,
  ): Promise<StatisticsPoint[]> {
    // days must be part of the key: the same entity/period at a different
    // range (7d vs 30d) is a different dataset, not a cache hit.
    const cacheKey = `${entityId}:${period}:${days}`;

    const cached = this._cache.get(cacheKey);
    if (cached && Date.now() - cached.fetchedAt < CACHE_TTL_MS) {
      return cached.points;
    }

    // Deduplicate in-flight requests
    if (this._pending.has(cacheKey)) {
      return this._pending.get(cacheKey)!;
    }

    const promise = this._fetchAndNormalize(entityId, period, days, isCounter, cacheKey);
    this._pending.set(cacheKey, promise);

    try {
      return await promise;
    } finally {
      this._pending.delete(cacheKey);
    }
  }

  private async _fetchAndNormalize(
    entityId: string,
    period: "hour" | "day",
    days: number,
    isCounter: boolean,
    cacheKey: string,
  ): Promise<StatisticsPoint[]> {
    const startTime = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
    const types = isCounter ? ["state", "sum", "change"] : ["mean", "min", "max"];

    try {
      const result = (await this._hass.connection.sendMessagePromise({
        type: "recorder/statistics_during_period",
        start_time: startTime,
        statistic_ids: [entityId],
        period,
        types,
      })) as Record<string, HAStatisticsRow[]>;

      const rows = result[entityId] || [];
      let points = this._normalizeRows(rows, isCounter);

      // #141: entities without long-term statistics (binary sensors, sensors
      // without a state_class) always come back empty here — fall back to
      // recorder STATE HISTORY (typically ~10 days) so a problem sensor's
      // on/off timeline draws as a 0/1 step line instead of a flat value.
      if (points.length < 2) {
        const historyPoints = await this._fetchHistoryFallback(entityId, startTime);
        if (historyPoints.length >= 2) {
          points = historyPoints;
          this.historyFallbackIds.add(entityId);
        } else {
          this.historyFallbackIds.delete(entityId);
        }
      } else {
        this.historyFallbackIds.delete(entityId);
      }

      this._cache.set(cacheKey, {
        entityId,
        fetchedAt: Date.now(),
        period,
        points,
      });

      return points;
    } catch (err) {
      console.warn(`[maintenance-supporter] Failed to fetch statistics for ${entityId}:`, err);
      return [];
    }
  }

  /** Recorder state history as chart points. Binary states map to 0/1, and
   *  every value CHANGE gets a doubled point ((t, old), (t, new)) so the
   *  line renderer draws a step instead of a slope between samples. */
  private async _fetchHistoryFallback(entityId: string, startTime: string): Promise<StatisticsPoint[]> {
    try {
      const result = (await this._hass.connection.sendMessagePromise({
        type: "history/history_during_period",
        start_time: startTime,
        end_time: new Date().toISOString(),
        entity_ids: [entityId],
        minimal_response: true,
        no_attributes: true,
      })) as Record<string, HAHistoryRow[]>;

      let rows = result?.[entityId] || [];
      // A chatty numeric entity can return thousands of rows — stride-sample
      // BEFORE the step expansion (the expansion preserves the edges that
      // survive sampling).
      if (rows.length > 1000) {
        const stride = Math.ceil(rows.length / 500);
        rows = rows.filter((_, i) => i % stride === 0 || i === rows.length - 1);
      }

      const points: StatisticsPoint[] = [];
      let prev: number | null = null;
      for (const row of rows) {
        const state = row.s ?? row.state;
        if (state == null || state === "unknown" || state === "unavailable") continue;
        let val: number;
        if (state === "on" || state === "open" || state === "true") val = 1;
        else if (state === "off" || state === "closed" || state === "false") val = 0;
        else {
          val = parseFloat(state);
          if (!Number.isFinite(val)) continue;
        }
        const raw = row.lu ?? row.last_updated ?? row.last_changed;
        const ts = typeof raw === "number" ? raw * 1000 : raw != null ? Date.parse(raw) : NaN;
        if (!Number.isFinite(ts)) continue;
        if (prev != null && prev !== val) points.push({ ts, val: prev });
        points.push({ ts, val });
        prev = val;
      }
      points.sort((a, b) => a.ts - b.ts);
      // Extend the last known state to "now" so the line reaches the right
      // edge (the caller must NOT append trigger_current_value here — for a
      // state_change trigger that is the change COUNTER, not the state).
      if (points.length && prev != null) points.push({ ts: Date.now(), val: prev });
      return points;
    } catch (err) {
      console.warn(`[maintenance-supporter] History fallback failed for ${entityId}:`, err);
      return [];
    }
  }

  private async _fetchBatch(
    entityIds: string[],
    period: "hour" | "day",
    startTime: string,
    types: string[],
    isCounter: boolean,
    out: Map<string, StatisticsPoint[]>,
  ): Promise<void> {
    try {
      const response = (await this._hass.connection.sendMessagePromise({
        type: "recorder/statistics_during_period",
        start_time: startTime,
        statistic_ids: entityIds,
        period,
        types,
      })) as Record<string, HAStatisticsRow[]>;

      for (const entityId of entityIds) {
        const rows = response[entityId] || [];
        const points = this._normalizeRows(rows, isCounter);
        out.set(entityId, points);
        this._cache.set(`${entityId}:${period}:${MINI_DAYS}`, {
          entityId,
          fetchedAt: Date.now(),
          period,
          points,
        });
      }
    } catch (err) {
      console.warn("[maintenance-supporter] Batch statistics fetch failed:", err);
    }
  }

  private _normalizeRows(rows: HAStatisticsRow[], isCounter: boolean): StatisticsPoint[] {
    const points: StatisticsPoint[] = [];

    for (const row of rows) {
      let val: number | null = null;

      if (isCounter) {
        val = row.state ?? null;
      } else {
        val = row.mean ?? null;
      }

      if (val === null) continue;

      const point: StatisticsPoint = {
        ts: row.start, // HA returns epoch milliseconds
        val,
      };

      if (!isCounter) {
        if (row.min != null) point.min = row.min;
        if (row.max != null) point.max = row.max;
      }

      points.push(point);
    }

    points.sort((a, b) => a.ts - b.ts);
    return points;
  }
}
