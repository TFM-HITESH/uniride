"use server";

import { db } from "@/lib/db";

export async function fetchRides() {
  try {
    const rides = await db.ride.findMany({
      where: {
        status: {
          not: "COMPLETED", // Exclude completed rides
        },
      },
      include: {
        creator: {
          select: {
            fullname: true,
            email: true,
          },
        },
        passengers: {
          select: {
            user: {
              select: {
                id: true,
                fullname: true,
                email: true,
              },
            },
          },
        },
        chatRoom: {
          select: {
            id: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return rides.map((ride) => ({
      id: ride.id,
      fullname: ride.creator.fullname,
      email: ride.creator.email,
      ride_cost: ride.ride_cost,
      source: ride.source,
      destination: ride.destination,
      time: ride.time,
      date: ride.date.toISOString(),
      seats_left: ride.seats_left,
      total_seats: ride.total_seats,
      desc_text: ride.desc_text,
      car_class: ride.car_class,
      car_model: ride.car_model,
      air_conditioning: ride.air_conditioning,
      gender_pref: ride.gender_pref,
      status: ride.status,
      passengers: ride.passengers.map((p) => ({
        id: p.user.id,
        fullname: p.user.fullname,
        email: p.user.email,
      })),
      chatRoomId: ride.chatRoom?.id,
    }));
  } catch (error) {
    console.error("Failed to fetch rides:", error);
    throw new Error("Failed to fetch rides");
  }
}
