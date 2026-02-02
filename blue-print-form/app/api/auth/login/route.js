import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import connectDB from "@/lib/db";
import User from "@/models/User";
import Blueprint from "@/models/Blueprint";

export async function POST(request) {
    try {
        await connectDB();

        const { username, password } = await request.json();

        console.log(`Login attempt for user: ${username}`);

        const user = await User.findOne({ username });

        if (!user) {
            return NextResponse.json(
                { message: "User not found" },
                { status: 400 }
            );
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return NextResponse.json(
                { message: "Invalid credentials" },
                { status: 400 }
            );
        }

        if (!process.env.JWT_SECRET) {
            console.error("JWT_SECRET is not set in environment");
            return NextResponse.json(
                { message: "Server misconfigured: JWT secret missing" },
                { status: 500 }
            );
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "1d",
        });

        // Fetch user's blueprint
        let blueprintData = {};
        try {
            const bp = await Blueprint.findOne({ userId: user._id }).lean().select("-__v");
            blueprintData = bp || {};
        } catch (e) {
            console.warn("Failed to include blueprint in login response:", e.message);
        }

        console.log(`Login successful for user: ${username}`);

        return NextResponse.json({
            message: "Login successful",
            token,
            username: user.username,
            blueprint: blueprintData,
        });
    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json(
            { message: "Login failed: " + error.message },
            { status: 500 }
        );
    }
}
