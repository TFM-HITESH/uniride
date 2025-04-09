"use server";

import { deleteRide, leaveRide, removePassenger } from "./my-rides";

export async function handleDeleteRide(rideId: string) {
  return await deleteRide(rideId);
}

export async function handleLeaveRide(rideId: string) {
  return await leaveRide(rideId);
}

export async function handleRemovePassenger(passengerId: string) {
  return await removePassenger(passengerId);
}
