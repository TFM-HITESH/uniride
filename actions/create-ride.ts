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

  // Convert form data to proper types
  const processedData = {
    ...(formData as Record<string, unknown>),
    total_seats: Number((formData as any).total_seats),
    ride_cost: Number((formData as any).ride_cost),
    date: new Date((formData as any).date),
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

  try {
    await db.$transaction(async (prisma) => {
      // Create the ride using the correct field name (creatorId)
      const ride = await prisma.ride.create({
        data: {
          source: data.source,
          destination: data.destination,
          date: data.date,
          time: data.time,
          car_class: data.car_class,
          car_model: data.car_model,
          total_seats: data.total_seats,
          seats_left: data.total_seats - 1, // Reserve seat for creator
          ride_cost: data.ride_cost,
          gender_pref: data.gender_pref,
          air_conditioning: data.air_conditioning === "ac",
          desc_text: data.desc_text,
          status: "ONGOING",
          creatorId: user.id, // Using the correct field name from your schema
        },
      });

      // Create dedicated chatroom
      const chatRoom = await prisma.chatRoom.create({
        data: {
          rideId: ride.id, // Directly using rideId as per your schema
        },
      });

      // Add creator to chatroom through join table
      await prisma.chatRoomUser.create({
        data: {
          userId: user.id,
          chatRoomId: chatRoom.id,
        },
      });

      // Add creator as passenger (without chatRoom reference since it's not in your Passenger model)
      await prisma.passenger.create({
        data: {
          userId: user.id,
          rideId: ride.id,
        },
      });
    });

    return {
      success: true,
      redirect: "/messages", // Redirect to messages page
    };
  } catch (error) {
    console.error("Database error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create ride",
    };
  }
}
