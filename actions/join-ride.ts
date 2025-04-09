// app/actions/join-ride.ts
"use server";

import { db } from "@/lib/db";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

export async function joinRide(rideId: string) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    throw new Error("You must be logged in to join a ride");
  }

  try {
    // Get the current user
    const user = await db.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, gender: true },
    });

    if (!user) {
      throw new Error("User not found");
    }

    // Get the ride with its current passengers and chat room
    const ride = await db.ride.findUnique({
      where: { id: rideId },
      include: {
        passengers: {
          select: { userId: true },
        },
        chatRoom: {
          include: {
            users: {
              select: { userId: true },
            },
          },
        },
      },
    });

    if (!ride) {
      throw new Error("Ride not found");
    }

    // Check if ride is already full
    if (ride.seats_left <= 0) {
      throw new Error("This ride is already full");
    }

    // Check if user is already a passenger
    const isAlreadyPassenger = ride.passengers.some(
      (passenger) => passenger.userId === user.id
    );
    if (isAlreadyPassenger) {
      throw new Error("You've already joined this ride");
    }

    // Check gender preference
    if (
      ride.gender_pref !== "any" &&
      ride.gender_pref !== user.gender?.toLowerCase()
    ) {
      throw new Error(`This ride is for ${ride.gender_pref} only`);
    }

    // Check if user is already in chat room
    const isAlreadyInChatRoom = ride.chatRoom?.users.some(
      (chatUser) => chatUser.userId === user.id
    );

    // Start a transaction to ensure both operations succeed or fail together
    await db.$transaction([
      // Add user as passenger
      db.passenger.create({
        data: {
          userId: user.id,
          rideId: ride.id,
        },
      }),

      // Add user to chat room (if chat room exists and user isn't already in it)
      ride.chatRoom && !isAlreadyInChatRoom
        ? db.chatRoomUser.create({
            data: {
              userId: user.id,
              chatRoomId: ride.chatRoom.id,
            },
          })
        : db.$executeRaw`SELECT 1`, // No-op if no chat room exists or user is already in it

      // Update available seats
      db.ride.update({
        where: { id: rideId },
        data: {
          seats_left: {
            decrement: 1,
          },
        },
      }),
    ]);

    // Revalidate the dashboard page to show updated data
    revalidatePath("/dashboard");
    revalidatePath("/myrides");

    return { success: true };
  } catch (error) {
    console.error("Error joining ride:", error);
    throw error;
  }
}
