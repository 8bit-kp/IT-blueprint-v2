import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import connectDB from "@/lib/db";
import User from "@/models/User";
import Blueprint from "@/models/Blueprint";

export async function POST(request) {
    try {
        await connectDB();

        const { username, email, companyName, password } = await request.json();

        if (!username || !password) {
            return NextResponse.json(
                { message: "Username and password required" },
                { status: 400 }
            );
        }

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return NextResponse.json(
                { message: "User already exists" },
                { status: 400 }
            );
        }

        const SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS, 10) || 12;
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

        await User.create({
            username,
            email,
            companyName,
            password: hashedPassword,
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
