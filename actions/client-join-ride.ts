// app/actions/client-join-ride.ts
"use server";

import { joinRide } from "./join-ride";

export async function handleJoinRide(
  rideId: string
): Promise<{ success: boolean; message?: string }> {
  try {
    await joinRide(rideId);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to join ride",
    };
  }
}
