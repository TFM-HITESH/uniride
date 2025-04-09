// actions/auto-complete-rides.ts
"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function completePastDueRides() {
  try {
    // Get current time in UTC (database stores timestamps in UTC)
    const now = new Date();

    // Find and complete overdue rides
    const ridesToComplete = await db.ride.findMany({
      where: {
        status: "ONGOING",
        date: { lte: now }, // Compare directly with UTC time
      },
      select: { id: true },
    });

    if (ridesToComplete.length > 0) {
      await db.ride.updateMany({
        where: { id: { in: ridesToComplete.map((r) => r.id) } },
        data: { status: "COMPLETED" },
      });
      revalidatePath("/");
      revalidatePath("/user");
      revalidatePath("/dashboard");
    }

    return { success: true, completedCount: ridesToComplete.length };
  } catch (error) {
    console.error("Error completing rides:", error);
    return { error: "Failed to complete rides" };
  }
}
