import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import connectDB from "@/lib/db";
import User from "@/models/User";
import Blueprint from "@/models/Blueprint";
import { createRateLimiter } from "@/lib/rateLimiter";

// 5 attempts per IP per 15-minute window.
const loginLimiter = createRateLimiter({ max: 5, windowMs: 15 * 60 * 1000 });

// JWT cookie lifetime in seconds — 1 day.
const COOKIE_MAX_AGE = 60 * 60 * 24;

export async function POST(request) {
    // ── Rate limiting ────────────────────────────────────────────────────────
    const ip =
        request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
        request.headers.get("x-real-ip") ||
        "unknown";

    const limitResult = loginLimiter(ip);
    if (limitResult.limited) {
        return NextResponse.json(
            { message: `Too many login attempts. Please try again in ${limitResult.retryAfter} seconds.` },
            { status: 429 }
        );
    }

    try {
        await connectDB();

        const { username, password } = await request.json();

        console.log(`Login attempt for user: ${username}`);

        const user = await User.findOne({ username });

        if (!user) {
            return NextResponse.json(
                { message: "Invalid credentials" },
                { status: 401 }
            );
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return NextResponse.json(
                { message: "Invalid credentials" },
                { status: 401 }
            );
        }

        if (!process.env.JWT_SECRET) {
            console.error("JWT_SECRET is not set in environment");
            return NextResponse.json(
                { message: "Server misconfigured: JWT secret missing" },
                { status: 500 }
            );
        }

        // Include tokenVersion (v) in the JWT so revocation can be checked.
        const token = jwt.sign(
            { id: user._id, v: user.tokenVersion ?? 0 },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        // Fetch user's blueprint (best-effort, non-blocking on failure).
        let blueprintData = {};
        try {
            const bp = await Blueprint.findOne({ userId: user._id }).lean().select("-__v");
            blueprintData = bp || {};
        } catch (e) {
            console.warn("Failed to include blueprint in login response:", e.message);
        }

        console.log(`Login successful for user: ${username}`);

        // Build the response — no token in the JSON body; stored in cookie only.
        const response = NextResponse.json({
            message: "Login successful",
            username: user.username,
            blueprint: blueprintData,
        });

        // Set the HTTP-only auth cookie.
        // Secure: true in production (HTTPS), false on localhost (HTTP).
        const isProduction = process.env.NODE_ENV === "production";
        response.cookies.set("auth_token", token, {
            httpOnly: true,
            secure: isProduction,
            sameSite: "lax",
            path: "/",
            maxAge: COOKIE_MAX_AGE,
        });

        return response;
    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json(
            { message: "Login failed: " + error.message },
            { status: 500 }
        );
    }
}
