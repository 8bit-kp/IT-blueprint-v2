import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Blueprint from "@/models/Blueprint";
import { verifyToken } from "@/lib/auth";

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

        const blueprint = await Blueprint.findOne({ userId }).lean().select("-__v");

        const result = blueprint || {};

        console.log(`Blueprint fetched for user ${userId}. Has data: ${!!blueprint}`);

        return NextResponse.json(result);
    } catch (error) {
        console.error("getBlueprint error:", error);
        return NextResponse.json(
            { message: "Failed to retrieve blueprint: " + error.message },
            { status: 500 }
        );
    }
}
