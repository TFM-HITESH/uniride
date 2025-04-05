"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function completePastDueRides() {
  try {
    const now = new Date();

    // Find all ongoing rides where the date/time has passed
    const ridesToComplete = await db.ride.findMany({
      where: {
        status: "ONGOING",
        date: {
          lte: now, // less than or equal to current time
        },
      },
      select: {
        id: true,
      },
    });

    // Update all found rides to COMPLETED status
    if (ridesToComplete.length > 0) {
      await db.ride.updateMany({
        where: {
          id: {
            in: ridesToComplete.map((ride) => ride.id),
          },
        },
        data: {
          status: "COMPLETED",
        },
      });

      // Revalidate any paths that might show ride data
      revalidatePath("/");
      revalidatePath("/user");
      revalidatePath("/rides");
    }

    return { success: true, completedCount: ridesToComplete.length };
  } catch (error) {
    console.error("Error completing past due rides:", error);
    return { error: "Failed to complete past due rides" };
  }
}
