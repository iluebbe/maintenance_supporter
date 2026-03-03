/**
 * Statistics service for fetching and caching HA recorder statistics.
 * Used by sparkline charts to display dense time-series data.
 */
import type { HomeAssistant, StatisticsPoint, EntityStatisticsCache, HAStatisticsRow } from "./types";

const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes
const DETAIL_DAYS = 30;
const MINI_DAYS = 14;

export class StatisticsService {
  private _hass: HomeAssistant;
  private _cache = new Map<string, EntityStatisticsCache>();
  private _pending = new Map<string, Promise<StatisticsPoint[]>>();

  constructor(hass: HomeAssistant) {
    this._hass = hass;
  }

  updateHass(hass: HomeAssistant): void {
    this._hass = hass;
  }

  /**
   * Get 30 days of hourly statistics for the detail sparkline (300x140 chart).
   */
  async getDetailStats(entityId: string, isCounter: boolean): Promise<StatisticsPoint[]> {
    return this._getStats(entityId, "hour", DETAIL_DAYS, isCounter);
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

    // Check cache first, collect cache misses
    for (const e of entities) {
      const cacheKey = `${e.entityId}:day`;
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
    const cacheKey = `${entityId}:${period}`;

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
      const points = this._normalizeRows(rows, isCounter);

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
        this._cache.set(`${entityId}:${period}`, {
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
