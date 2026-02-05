import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Blueprint from "@/models/Blueprint";
import { verifyToken } from "@/lib/auth";
import { blueprintCache } from "@/lib/blueprintCache";

export async function GET(request) {
    try {
        await connectDB();

        const userId = verifyToken(request);

        console.log(`Fetching blueprint for user: ${userId}`);

        if (!userId) {
            console.error("getBlueprint: No userId found in request");
            return NextResponse.json(
                { message: "User not authenticated" },
                { status: 401 }
            );
        }

        // Check cache first
        const cachedBlueprint = blueprintCache.get(userId);
        if (cachedBlueprint) {
            console.log(`Blueprint retrieved from cache for user ${userId}. Has data: ${!!cachedBlueprint._id}`);
            return NextResponse.json(cachedBlueprint);
        }

        // If not in cache, fetch from database
        const blueprint = await Blueprint.findOne({ userId }).lean().select("-__v");

        const result = blueprint || {};

        // Store in cache if data exists
        if (blueprint) {
            blueprintCache.set(userId, blueprint);
            console.log(`Blueprint fetched from DB and cached for user ${userId}. Has data: true`);
        } else {
            console.log(`Blueprint fetched from DB for user ${userId}. Has data: false`);
        }

        return NextResponse.json(result);
    } catch (error) {
        console.error("getBlueprint error:", error);
        return NextResponse.json(
            { message: "Failed to retrieve blueprint: " + error.message },
            { status: 500 }
        );
    }
}
