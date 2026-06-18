import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Blueprint from "@/models/Blueprint";
import { verifyToken } from "@/lib/auth";
import { blueprintCache } from "@/lib/blueprintCache";


function deepClean(obj) {
    if (Array.isArray(obj)) {
        return obj.map(deepClean);
    }
    if (obj && typeof obj === "object") {
        const cleaned = {};
        for (const [k, v] of Object.entries(obj)) {
            if (k === "_id" || k === "__v") continue;
            cleaned[k] = deepClean(v);
        }
        return cleaned;
    }
    return obj;
}

// Reject payloads that contain keys starting with $ or containing .
function hasInvalidKey(obj) {
    if (!obj || typeof obj !== "object") return false;
    for (const key of Object.keys(obj)) {
        if (key.startsWith("$") || key.includes(".")) return true;
        if (typeof obj[key] === "object" && hasInvalidKey(obj[key])) return true;
    }
    return false;
}

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

        const raw = await request.json();

        if (!raw || typeof raw !== "object") {
            return NextResponse.json(
                { message: "Invalid data format" },
                { status: 400 }
            );
        }

        if (hasInvalidKey(raw)) {
            return NextResponse.json(
                { message: "Invalid data keys detected" },
                { status: 400 }
            );
        }

        // Strip top-level _id / __v / userId, then deep-clean nested _ids
        // (e.g. _id fields inside applications.productivity[] sub-documents)
        const { userId: _uid, _id: _docId, __v: _ver, ...rest } = raw;
        const updateData = deepClean(rest);

        console.log(`Saving blueprint for user ${userId}`);

        // Debug: log first app's sensitivity fields to verify they arrive in the payload
        const firstApp = updateData?.applications?.productivity?.[0];
        if (firstApp) {
            console.log(`[DEBUG] First productivity app: name="${firstApp.name}" sensitivity="${firstApp.sensitivity}" businessSensitivity="${firstApp.businessSensitivity}"`);
        }

        // Use the raw MongoDB driver (bypass Mongoose strict-schema filtering on
        // subdocuments). Mongoose's compiled model caches the schema at startup and
        // can silently strip newly-added fields on sub-document arrays during an
        // updateOne $set. The raw collection.updateOne has no such restriction.
        const db = (await connectDB()).connection.db;
        const collection = db.collection("blueprints");
        const { ObjectId } = (await import("mongodb"));

        await collection.updateOne(
            { userId: new ObjectId(userId) },
            { $set: updateData, $setOnInsert: { userId: new ObjectId(userId) } },
            { upsert: true }
        );

        // Invalidate cache so next GET returns fresh data
        blueprintCache.invalidate(userId);
        console.log(`Cache invalidated for user ${userId}`);

        return NextResponse.json({
            message: "Blueprint saved successfully",
            success: true,
        });
    } catch (error) {
        console.error("saveBlueprint error:", error);

        if (error.name === "ValidationError") {
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
