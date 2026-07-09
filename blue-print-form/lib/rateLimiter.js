/**
 * lib/rateLimiter.js
 *
 * In-memory sliding-window rate limiter.
 *
 * Interface is designed to be drop-in replaceable with a Redis implementation:
 *   - createRateLimiter(options) returns a check(ip) function.
 *   - check(ip) returns { limited: boolean, retryAfter?: number }.
 *   - No external state leaks — callers only interact through check().
 *
 * Production note: Because Next.js Route Handlers may run in separate serverless
 * invocations, this in-memory store does not persist across cold starts on Vercel.
 * For persistent rate limiting in production, replace the Map with a Redis client.
 */

/**
 * @typedef {Object} RateLimiterOptions
 * @property {number} max        - Maximum number of requests allowed in the window.
 * @property {number} windowMs   - Sliding window size in milliseconds.
 */

/**
 * @typedef {Object} RateLimitResult
 * @property {boolean} limited        - Whether the request is rate-limited.
 * @property {number}  [retryAfter]   - Seconds until the window resets (only when limited).
 */

/**
 * Creates a rate limiter with the given configuration.
 *
 * @param {RateLimiterOptions} options
 * @returns {(ip: string) => RateLimitResult}
 */
export function createRateLimiter({ max, windowMs }) {
    // Map<ip, number[]> — stores timestamps of recent requests per IP.
    const store = new Map();

    /**
     * Check whether the given IP has exceeded the rate limit.
     * Mutates the store by recording this attempt if not limited.
     *
     * @param {string} ip
     * @returns {RateLimitResult}
     */
    return function check(ip) {
        const now = Date.now();
        const windowStart = now - windowMs;

        // Get existing timestamps, prune those outside the window.
        const timestamps = (store.get(ip) || []).filter((t) => t > windowStart);

        if (timestamps.length >= max) {
            // Oldest timestamp in window — window resets that many ms from now.
            const oldestInWindow = timestamps[0];
            const retryAfter = Math.ceil((oldestInWindow + windowMs - now) / 1000);
            return { limited: true, retryAfter };
        }

        // Record this request and persist.
        timestamps.push(now);
        store.set(ip, timestamps);

        return { limited: false };
    };
}
