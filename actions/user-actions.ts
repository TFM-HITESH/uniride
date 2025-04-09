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

    return rides.map((ride) => {
      const dateObj = new Date(ride.date);

      // Convert to IST
      const istDate = new Date(
        dateObj.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
      );

      // Format date as "6th May, 2025"
      const day = istDate.getDate();
      const month = istDate.toLocaleString("en-US", { month: "long" });
      const year = istDate.getFullYear();

      const daySuffix =
        day === 1 || day === 21 || day === 31
          ? "st"
          : day === 2 || day === 22
          ? "nd"
          : day === 3 || day === 23
          ? "rd"
          : "th";

      const formattedDate = `${day}${daySuffix} ${month}, ${year}`;

      // Format time as "12:30 AM"
      const formattedTime = istDate
        .toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        })
        .toUpperCase();

      return {
        id: ride.id,
        source: ride.source,
        destination: ride.destination,
        date: `${formattedDate} • ${formattedTime}`, // Final output
        status: ride.status === "ONGOING" ? "Ongoing" : "Completed",
        passenger_count: (ride.total_seats - ride.seats_left).toString(),
      };
    });
  } catch (error) {
    console.error("Error fetching ride history:", error);
    return { error: "Failed to fetch ride history" };
  }
}
