"use server";

import { db } from "@/lib/db";

export async function getUserByEmail(email: string) {
  try {
    if (!email) return { error: "Email is required" };

    const user = await db.user.findUnique({
      where: { email },
      include: {
        createdRides: {
          where: { status: "COMPLETED" },
          select: { id: true },
        },
        joinedRides: {
          where: { ride: { status: "COMPLETED" } },
          select: { rideId: true },
        },
      },
    });

    if (!user) return { error: "User not found" };

    const completedRides = [
      ...user.createdRides.map((r) => r.id),
      ...user.joinedRides.map((p) => p.rideId),
    ].filter((v, i, a) => a.indexOf(v) === i).length;

    return {
      ...user,
      completedRides,
    };
  } catch (error) {
    console.error("Error fetching user:", error);
    return { error: "Failed to fetch user" };
  }
}

export async function getUserRideHistory(email: string) {
  try {
    const rides = await db.ride.findMany({
      where: {
        OR: [
          { creator: { email } },
          { passengers: { some: { user: { email } } } },
        ],
      },
      include: {
        creator: {
          select: {
            email: true,
            fullname: true,
          },
        },
      },
      orderBy: { date: "desc" },
    });

    return rides.map((ride) => ({
      id: ride.id,
      source: ride.source,
      destination: ride.destination,
      date: new Date(ride.date).toLocaleDateString("en-GB"), // dd/mm/yyyy format
      status: ride.status === "ONGOING" ? "Ongoing" : "Completed",
      passenger_count: (ride.total_seats - ride.seats_left).toString(), // Show actual passengers
    }));
  } catch (error) {
    console.error("Error fetching ride history:", error);
    return { error: "Failed to fetch ride history" };
  }
}
