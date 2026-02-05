// Simple in-memory cache for blueprint data
class BlueprintCache {
    constructor() {
        this.cache = new Map();
        this.TTL = 5 * 60 * 1000; // 5 minutes
    }

    get(userId) {
        const cached = this.cache.get(userId);
        if (!cached) return null;

        // Check if cache is expired
        if (Date.now() - cached.timestamp > this.TTL) {
            this.cache.delete(userId);
            return null;
        }

        return cached.data;
    }

    set(userId, data) {
        this.cache.set(userId, {
            data,
            timestamp: Date.now()
        });
    }

    invalidate(userId) {
        this.cache.delete(userId);
    }

    clear() {
        this.cache.clear();
    }
}

// Export singleton instance
export const blueprintCache = new BlueprintCache();
