"use server";

import { db } from "@/lib/db";

export async function fetchRides() {
  try {
    const rides = await db.ride.findMany({
      include: {
        user: {
          select: {
            fullname: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc", // Newest rides first
      },
    });

    // Format the data for your RideCard component
    return rides.map((ride) => ({
      id: ride.id,
      fullname: ride.user.fullname,
      email: ride.user.email,
      ride_cost: ride.ride_cost,
      source: ride.source,
      destination: ride.destination,
      time: ride.time,
      date: ride.date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
      seats_left: ride.seats_left,
      desc_text: ride.desc_text,
      car_class: ride.car_class,
      car_model: ride.car_model,
      air_conditioning: ride.air_conditioning,
      gender_pref: ride.gender_pref,
    }));
  } catch (error) {
    console.error("Failed to fetch rides:", error);
    throw new Error("Failed to fetch rides");
  }
}
