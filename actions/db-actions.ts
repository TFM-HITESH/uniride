"use server";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getUserByEmail(email: string) {
  try {
    if (!email) {
      return { error: "Email is required" };
    }

    const user = await prisma.user.findUnique({
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
