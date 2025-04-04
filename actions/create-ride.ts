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
    time: z.string().min(1, "Time is required"),
    car_class: z.string().trim().min(1),
    car_model: z.string().trim().min(2),
    seats_left: z.number().min(1).max(20),
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
  });

  if (!user) {
    throw new Error("User not found.");
  }

  // Convert form data to proper types
  const processedData = {
    ...(formData as Record<string, unknown>),
    seats_left: Number((formData as any).seats_left),
    ride_cost: Number((formData as any).ride_cost),
    date: new Date((formData as any).date),
  };

  const result = rideFormSchema.safeParse(processedData);
  if (!result.success) {
    console.error("Validation errors:", result.error.format());
    throw new Error(
      `Validation failed: ${JSON.stringify(result.error.flatten().fieldErrors)}`
    );
  }

  const data = result.data;

  try {
    await db.ride.create({
      data: {
        userId: user.id,
        source: data.source,
        destination: data.destination,
        date: data.date,
        time: data.time,
        car_class: data.car_class,
        car_model: data.car_model,
        seats_left: data.seats_left,
        ride_cost: data.ride_cost,
        gender_pref: data.gender_pref,
        air_conditioning: data.air_conditioning === "ac",
        desc_text: data.desc_text,
      },
    });

    return {
      success: true,
      redirectTo: "/dashboard",
    };
  } catch (error) {
    console.error("Database error:", error);
    throw new Error("Failed to create ride in database.");
  }
}
