import { NextResponse } from "next/server";

/**
 * POST /api/auth/logout
 *
 * Expires the auth_token HTTP-only cookie server-side.
 * The client does not need to hold or send the token — it is cleared by the browser
 * when the browser processes the Set-Cookie response header.
 *
 * Also clears any residual localStorage entries on the client via the JSON response
 * (the frontend handleLogout function removes localStorage.username after calling this).
 */
export async function POST() {
    const response = NextResponse.json({ message: "Logged out successfully" });

    // Expire the cookie immediately by setting maxAge to 0.
    response.cookies.set("auth_token", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 0,
    });

    return response;
}
