import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { createRateLimiter } from "@/lib/rateLimiter";

// 3 attempts per IP per 1-hour window.
const registerLimiter = createRateLimiter({ max: 3, windowMs: 60 * 60 * 1000 });

// Simple but correct email regex — validates format, not deliverability.
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Validates password strength.
 * Requirements: ≥8 chars, at least one letter, at least one digit.
 * @param {string} pw
 * @returns {string|null} Error message, or null if valid.
 */
function validatePassword(pw) {
    if (!pw || pw.length < 8) {
        return "Password must be at least 8 characters long.";
    }
    if (!/[a-zA-Z]/.test(pw)) {
        return "Password must contain at least one letter.";
    }
    if (!/[0-9]/.test(pw)) {
        return "Password must contain at least one number.";
    }
    return null;
}

export async function POST(request) {
    // ── Rate limiting ────────────────────────────────────────────────────────
    const ip =
        request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
        request.headers.get("x-real-ip") ||
        "unknown";

    const limitResult = registerLimiter(ip);
    if (limitResult.limited) {
        return NextResponse.json(
            { message: `Too many registration attempts. Please try again in ${limitResult.retryAfter} seconds.` },
            { status: 429 }
        );
    }

    try {
        await connectDB();

        const { username, email, companyName, password } = await request.json();

        // ── Required field validation ────────────────────────────────────────
        if (!username || !password) {
            return NextResponse.json(
                { message: "Username and password required" },
                { status: 400 }
            );
        }

        // ── Password strength validation ─────────────────────────────────────
        const passwordError = validatePassword(password);
        if (passwordError) {
            return NextResponse.json(
                { message: passwordError },
                { status: 400 }
            );
        }

        // ── Email format validation (optional field) ─────────────────────────
        if (email && !EMAIL_REGEX.test(email)) {
            return NextResponse.json(
                { message: "Invalid email address format." },
                { status: 400 }
            );
        }

        // ── Duplicate username check ─────────────────────────────────────────
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return NextResponse.json(
                { message: "Username already taken. Please choose a different one." },
                { status: 409 }
            );
        }

        // ── Create user ──────────────────────────────────────────────────────
        const SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS, 10) || 12;
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

        await User.create({
            username,
            email: email || undefined,
            companyName: companyName || undefined,
            password: hashedPassword,
            tokenVersion: 0,
        });

        return NextResponse.json(
            { message: "User registered successfully" },
            { status: 201 }
        );
    } catch (error) {
        console.error("Registration error:", error);
        return NextResponse.json(
            { message: error.message },
            { status: 500 }
        );
    }
}
