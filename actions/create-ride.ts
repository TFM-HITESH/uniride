"use server";

import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

const rideFormSchema = z
  .object({
    source: z.string().trim().min(2),
    destination: z.string().trim().min(2),
    date: z.coerce.date(),
    time: z.string().min(1),
    car_class: z.string().trim().min(1),
    car_model: z.string().trim().min(2),
    total_seats: z.number().min(2).max(20),
    ride_cost: z.number().min(1).max(4000),
    gender_pref: z.enum(["any", "male", "female"]),
    air_conditioning: z.enum(["ac", "nonac"]),
    desc_text: z
      .string()
      .trim()
      .min(10)
      .max(100)
      .refine((text) => text.replace(/\s/g, "").length > 0)
      .refine((text) => !/[<>{}]/.test(text)),
  })
  .refine((data) => data.source !== data.destination, {
    message: "Pickup and destination must be different.",
    path: ["destination"],
  });

export async function createRide(formData: unknown) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    throw new Error("You must be logged in to create a ride.");
  }

  const user = await db.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  });

  if (!user) {
    throw new Error("User not found.");
  }

  try {
    // Parse the form data
    const rawData = formData as Record<string, unknown>;

    // Debug log the incoming data
    console.log("Raw form data received:", JSON.stringify(rawData, null, 2));

    // The date should already be a proper Date object from the form
    const rideDateTime = rawData.date as Date;

    // Validate it's a proper date
    if (!(rideDateTime instanceof Date) || isNaN(rideDateTime.getTime())) {
      throw new Error("Invalid date received from form");
    }

    // Debug log the date details
    console.log("Received date:", rideDateTime);
    console.log("Local date string:", rideDateTime.toLocaleString());
    console.log("ISO string:", rideDateTime.toISOString());

    // Prepare data for validation
    const processedData = {
      ...rawData,
      total_seats: Number(rawData.total_seats),
      ride_cost: Number(rawData.ride_cost),
      date: rideDateTime, // Use the Date object directly
      time: rawData.time as string, // Keep original time string
    };

    const result = rideFormSchema.safeParse(processedData);
    if (!result.success) {
      const errors = result.error.flatten();
      console.error("Validation errors:", errors);
      throw new Error(
        Object.entries(errors.fieldErrors)
          .map(([field, messages]) => `${field}: ${messages?.join(", ")}`)
          .join(" | ")
      );
    }

    const data = result.data;

    await db.$transaction(async (prisma) => {
      // Create the ride with the date as received (should be in correct timezone)
      const ride = await prisma.ride.create({
        data: {
          source: data.source,
          destination: data.destination,
          date: data.date, // Prisma will handle timezone conversion
          time: data.time,
          car_class: data.car_class,
          car_model: data.car_model,
          total_seats: data.total_seats,
          seats_left: data.total_seats - 1,
          ride_cost: data.ride_cost,
          gender_pref: data.gender_pref,
          air_conditioning: data.air_conditioning === "ac",
          desc_text: data.desc_text,
          status: "ONGOING",
          creatorId: user.id,
        },
      });

      // Debug log the created ride
      console.log("Created ride with date:", ride.date);

      // Create dedicated chatroom
      const chatRoom = await prisma.chatRoom.create({
        data: {
          rideId: ride.id,
        },
      });

      // Add creator to chatroom
      await prisma.chatRoomUser.create({
        data: {
          userId: user.id,
          chatRoomId: chatRoom.id,
        },
      });

      // Add creator as passenger
      await prisma.passenger.create({
        data: {
          userId: user.id,
          rideId: ride.id,
        },
      });
    });

    return {
      success: true,
      redirect: "/messages",
    };
  } catch (error) {
    console.error("Error in createRide:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create ride",
    };
  }
}
