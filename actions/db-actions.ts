"use server";

import { db } from "@/lib/db"; // Import the shared Prisma client

export async function getUserByEmail(email: string) {
  try {
    if (!email) {
      return { error: "Email is required" };
    }

    const user = await db.user.findUnique({
      where: { email },
    });

    if (!user) {
      return { error: "User not found" };
    }

    return user;
  } catch (error) {
    console.error("Error fetching user:", error);
    return { error: "Failed to fetch user" };
  }
}
