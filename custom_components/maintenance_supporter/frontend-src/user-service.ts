/**
 * User Service - Helper for user assignment operations
 * Provides caching and convenience methods for working with HA users
 */

import type { HomeAssistant, HAUser } from "./types";

export class UserService {
  private hass: HomeAssistant;
  private usersCache: HAUser[] | null = null;
  private cacheTimestamp: number = 0;
  private readonly CACHE_TTL_MS = 60000; // 1 minute cache

  constructor(hass: HomeAssistant) {
    this.hass = hass;
  }

  /**
   * Get list of all active HA users (with caching)
   */
  async getUsers(forceRefresh = false): Promise<HAUser[]> {
    const now = Date.now();

    // Return cached data if valid
    if (
      !forceRefresh &&
      this.usersCache &&
      now - this.cacheTimestamp < this.CACHE_TTL_MS
    ) {
      return this.usersCache;
    }

    // Fetch from backend
    try {
      const response = (await this.hass.connection.sendMessagePromise({
        type: "maintenance_supporter/users/list",
      })) as { users: HAUser[] };

      this.usersCache = response.users;
      this.cacheTimestamp = now;
      return this.usersCache;
    } catch (error) {
      console.error("Failed to fetch users:", error);
      // Return cached data if available, even if expired
      return this.usersCache || [];
    }
  }

  /**
   * Assign a user to a task (or unassign if userId is null)
   */
  async assignUser(
    entryId: string,
    taskId: string,
    userId: string | null
  ): Promise<void> {
    await this.hass.connection.sendMessagePromise({
      type: "maintenance_supporter/task/assign_user",
      entry_id: entryId,
      task_id: taskId,
      user_id: userId,
    });
  }

  /**
   * Get tasks assigned to a specific user
   */
  async getTasksByUser(userId: string): Promise<unknown[]> {
    const response = (await this.hass.connection.sendMessagePromise({
      type: "maintenance_supporter/tasks/by_user",
      user_id: userId,
    })) as { tasks: unknown[] };
    return response.tasks;
  }

  /**
   * Get user name by ID (from cache, returns null if not found)
   */
  getUserName(userId: string | null): string | null {
    if (!userId || !this.usersCache) {
      return null;
    }

    const user = this.usersCache.find((u) => u.id === userId);
    return user?.name || null;
  }

  /**
   * Get full user object by ID (from cache)
   */
  getUser(userId: string | null): HAUser | null {
    if (!userId || !this.usersCache) {
      return null;
    }

    return this.usersCache.find((u) => u.id === userId) || null;
  }

  /**
   * Get current logged-in user ID
   */
  getCurrentUserId(): string | null {
    return this.hass.user?.id || null;
  }

  /**
   * Check if a user ID is the current user
   */
  isCurrentUser(userId: string | null): boolean {
    if (!userId) return false;
    return userId === this.getCurrentUserId();
  }

  /**
   * Clear the user cache (useful when users are added/removed)
   */
  clearCache(): void {
    this.usersCache = null;
    this.cacheTimestamp = 0;
  }
}
