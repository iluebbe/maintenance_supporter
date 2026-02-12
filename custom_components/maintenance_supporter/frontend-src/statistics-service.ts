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
}
