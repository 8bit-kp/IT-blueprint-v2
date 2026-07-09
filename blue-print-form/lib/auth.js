import jwt from "jsonwebtoken";
import connectDB from "@/lib/db";
import User from "@/models/User";

/**
 * Parse a single named cookie from the raw Cookie request header.
 * Reads directly from the Request object — no next/headers import,
 * no request-context requirements, no silent failures.
 */
function getCookieValue(request, name) {
    const cookieHeader = request.headers.get("cookie") || "";
    if (!cookieHeader) return null;

    for (const part of cookieHeader.split(";")) {
        const eqIdx = part.indexOf("=");
        if (eqIdx === -1) continue;
        const key = part.slice(0, eqIdx).trim();
        if (key === name) {
            // Take everything after the first "=" (JWT tokens contain "=" in base64 padding)
            return part.slice(eqIdx + 1).trim() || null;
        }
    }
    return null;
}

/**
 * verifyToken(request)
 *
 * Reads the JWT from the HTTP-only `auth_token` cookie in the incoming request.
 * Falls back to the Authorization: Bearer header for backward compatibility.
 *
 * Also validates tokenVersion against the User document in MongoDB so that
 * server-side token revocation (incrementing tokenVersion) is enforced.
 *
 * @param {Request} request
 * @returns {Promise<string|null>} MongoDB _id string, or null if invalid/revoked.
 */
export async function verifyToken(request) {
    let token = null;

    // 1. HTTP-only cookie (preferred path).
    const cookieHeader = request.headers.get("cookie");
    const cookieToken = getCookieValue(request, "auth_token");

    console.log("[auth] Cookie header present:", !!cookieHeader);
    console.log("[auth] auth_token cookie found:", !!cookieToken);

    if (cookieToken) {
        token = cookieToken;
    }

    // 2. Authorization: Bearer fallback (temporary — for transitional compatibility).
    if (!token) {
        const authHeader = request.headers.get("authorization");
        if (authHeader && authHeader.startsWith("Bearer ")) {
            token = authHeader.substring(7);
            console.log("[auth] Using Authorization header fallback");
        }
    }

    if (!token) {
        console.log("[auth] No token found — returning null");
        return null;
    }

    // 3. Verify JWT signature and expiry.
    let decoded;
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        console.error("[auth] JWT verify failed:", error.message);
        return null;
    }

    // 4. Validate tokenVersion to support server-side revocation.
    //    Treat missing tokenVersion in the DB document as 0 (pre-migration users).
    if (typeof decoded.v === "number") {
        try {
            await connectDB();
            const user = await User.findById(decoded.id).select("tokenVersion").lean();
            if (!user) {
                console.warn("[auth] User not found in DB:", decoded.id);
                return null;
            }
            // Use ?? 0 so that existing users who don't yet have the field
            // are treated as version 0, matching a JWT signed with v: 0.
            const storedVersion = user.tokenVersion ?? 0;
            if (storedVersion !== decoded.v) {
                console.warn(`[auth] Token version mismatch — stored: ${storedVersion}, jwt: ${decoded.v}`);
                return null;
            }
        } catch (dbError) {
            console.error("[auth] tokenVersion DB check failed:", dbError.message);
            return null;
        }
    }

    return decoded.id; // MongoDB ObjectId as string
}
