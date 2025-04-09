import { completePastDueRides } from "@/../actions/auto-complete-rides";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic"; // Required for external cron

export async function GET() {
  try {
    const result = await completePastDueRides();
    return NextResponse.json({
      success: true,
      completed: result.completedCount || 0,
    });
    // eslint-disable-next-line
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to complete rides" },
      { status: 500 }
    );
  }
}

// TESTING
// curl http://localhost:3000/api/cron
// https://cron-job.org/en/
