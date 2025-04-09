"use server";

import { db } from "@/lib/db";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

export type UserRide = {
  id: string;
  source: string;
  destination: string;
  date: Date;
  time: string;
  car_class: string;
  car_model: string;
  total_seats: number;
  seats_left: number;
  ride_cost: number;
  gender_pref: string;
  air_conditioning: boolean;
  desc_text: string;
  status: "ONGOING" | "COMPLETED";
  creatorId: string;
  creator: {
    fullname: string;
    email: string;
  };
  passengers: {
    id: string;
    user: {
      id: string;
      fullname: string;
      email: string;
    };
  }[];
  isOwner: boolean;
  isParticipant: boolean;
};

export async function getUserRides(): Promise<UserRide[]> {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    throw new Error("You must be logged in to view rides");
  }

  try {
    const user = await db.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const rides = await db.ride.findMany({
      where: {
        OR: [
          { creatorId: user.id },
          { passengers: { some: { userId: user.id } } },
        ],
        status: "ONGOING",
      },
      include: {
        creator: {
          select: {
            fullname: true,
            email: true,
          },
        },
        passengers: {
          include: {
            user: {
              select: {
                id: true,
                fullname: true,
                email: true,
              },
            },
          },
        },
      },
      orderBy: {
        date: "asc",
      },
    });

    return rides.map((ride) => {
      // Filter out the owner from passengers if they exist
      const filteredPassengers = ride.passengers.filter(
        (passenger) => passenger.user.id !== ride.creatorId
      );

      return {
        ...ride,
        passengers: filteredPassengers,
        isOwner: ride.creatorId === user.id,
        isParticipant: filteredPassengers.some((p) => p.user.id === user.id),
      };
    });
  } catch (error) {
    console.error("Error fetching user rides:", error);
    throw new Error("Failed to fetch rides");
  }
}

export async function deleteRide(rideId: string) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    throw new Error("Unauthorized");
  }

  try {
    const user = await db.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const ride = await db.ride.findUnique({
      where: { id: rideId },
      select: { creatorId: true },
    });

    if (!ride) {
      throw new Error("Ride not found");
    }

    if (ride.creatorId !== user.id) {
      throw new Error("Only ride owner can delete the ride");
    }

    await db.ride.delete({
      where: { id: rideId },
    });

    return { success: true };
  } catch (error) {
    console.error("Error deleting ride:", error);
    throw error;
  }
}

export async function leaveRide(rideId: string) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    throw new Error("Unauthorized");
  }

  try {
    const user = await db.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const passenger = await db.passenger.findFirst({
      where: {
        userId: user.id,
        rideId: rideId,
      },
    });

    if (!passenger) {
      throw new Error("Passenger not found");
    }

    await db.passenger.delete({
      where: {
        id: passenger.id,
      },
    });

    await db.ride.update({
      where: { id: rideId },
      data: {
        seats_left: {
          increment: 1,
        },
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Error leaving ride:", error);
    throw error;
  }
}

export async function removePassenger(passengerId: string) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    throw new Error("Unauthorized");
  }

  try {
    const user = await db.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const passenger = await db.passenger.findUnique({
      where: { id: passengerId },
      include: {
        ride: {
          select: {
            creatorId: true,
          },
        },
      },
    });

    if (!passenger) {
      throw new Error("Passenger not found");
    }

    if (passenger.ride.creatorId !== user.id) {
      throw new Error("Only ride owner can remove passengers");
    }

    await db.passenger.delete({
      where: {
        id: passengerId,
      },
    });

    await db.ride.update({
      where: { id: passenger.rideId },
      data: {
        seats_left: {
          increment: 1,
        },
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Error removing passenger:", error);
    throw error;
  }
}
