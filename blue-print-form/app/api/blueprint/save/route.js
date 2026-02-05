import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Blueprint from "@/models/Blueprint";
import { verifyToken } from "@/lib/auth";
import { blueprintCache } from "@/lib/blueprintCache";

export async function POST(request) {
    try {
        await connectDB();

        const userId = verifyToken(request);

        if (!userId) {
            return NextResponse.json(
                { message: "User not authenticated" },
                { status: 401 }
            );
        }

        const data = await request.json();

        if (!data || typeof data !== 'object') {
            return NextResponse.json(
                { message: "Invalid data format" },
                { status: 400 }
            );
        }

        // Basic payload sanitization
        const hasInvalidKey = (obj) => {
            if (!obj || typeof obj !== 'object') return false;
            for (const key of Object.keys(obj)) {
                if (key.startsWith('$') || key.includes('.')) return true;
                const val = obj[key];
                if (typeof val === 'object') {
                    if (hasInvalidKey(val)) return true;
                }
            }
            return false;
        };

        if (hasInvalidKey(data)) {
            return NextResponse.json(
                { message: "Invalid data keys detected" },
                { status: 400 }
            );
        }

        console.log(`Saving blueprint for user ${userId}`);

        const { userId: _, ...updateData } = data;

        await Blueprint.updateOne(
            { userId },
            { $set: updateData, $setOnInsert: { userId } },
            { upsert: true, runValidators: true }
        );

        // Invalidate cache after save so fresh data is fetched next time
        blueprintCache.invalidate(userId);
        console.log(`Cache invalidated for user ${userId}`);

        return NextResponse.json({
            message: "Blueprint saved successfully",
            success: true
        });
    } catch (error) {
        console.error("saveBlueprint error:", error);

        if (error.name === 'ValidationError') {
            return NextResponse.json(
                { message: "Validation error: " + error.message, success: false },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { message: "Failed to save blueprint: " + error.message, success: false },
            { status: 500 }
        );
    }
}
