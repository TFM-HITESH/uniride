// components/ride-card.tsx
"use client";

import ColourAvatar from "@/components/colour-avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { FaCarSide } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { MdDateRange } from "react-icons/md";
import { PiSeatFill } from "react-icons/pi";
import { MoreVertical, UserX } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  handleDeleteRide,
  handleLeaveRide,
  handleRemovePassenger,
} from "@/../actions/client-rides";

type Props = {
  id: string;
  fullname: string;
  email: string;
  ride_cost: number;
  source: string;
  destination: string;
  time: string;
  date: Date;
  seats_left: number;
  desc_text: string;
  car_class: string;
  car_model: string;
  air_conditioning: boolean;
  gender_pref: string;
  isOwner: boolean;
  isParticipant: boolean;
  members: {
    id: string;
    fullname: string;
    email: string;
    isOwner: boolean;
    passengerId?: string;
  }[];
};

export default function RideCard({
  id,
  fullname,
  email,
  ride_cost,
  source,
  destination,
  time,
  date,
  seats_left,
  desc_text,
  car_class,
  car_model,
  air_conditioning,
  gender_pref,
  isOwner,
  // eslint-disable-next-line
  isParticipant,
  members,
}: Props) {
  const router = useRouter();
  const formattedDate = date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const handleDelete = async () => {
    try {
      await handleDeleteRide(id);
      toast.success("Ride deleted successfully!");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete ride"
      );
    }
  };

  const handleLeave = async () => {
    try {
      await handleLeaveRide(id);
      toast.success("You have left the ride successfully!");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to leave ride"
      );
    }
  };

  const handleRemove = async (passengerId: string) => {
    try {
      await handleRemovePassenger(passengerId);
      toast.success("Passenger removed successfully!");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to remove passenger"
      );
    }
  };

  return (
    <div className="w-full flex flex-col p-4 md:p-6 rounded-2xl bg-card border">
      <div className="w-full flex flex-row">
        <div className="w-[80%] flex flex-col">
          <div className="flex flex-col md:flex-row gap-2 md:gap-4 items-start md:items-center justify-start">
            <ColourAvatar name={fullname} />
            <div className="flex flex-col">
              <div className="font-stretch-expanded tracking-wide">
                {fullname}
              </div>
              <div className="text-sm opacity-65 text-ellipsis overflow-hidden w-[55%] md:overflow-visible">
                {email}
              </div>
            </div>
          </div>
          <div className="py-3 my-3 gap-x-[25%] md:gap-y-3 w-full grid md:grid-cols-2 justify-items-start">
            <div className="p-1">
              <p className="text-sm opacity-65 mb-1">From</p>
              <p className="font-semibold opacity-80 overflow-hidden text-ellipsis flex flex-row items-center gap-2">
                <FaLocationDot className="opacity-60" />
                {source}
              </p>
            </div>
            <div className="p-1">
              <p className="text-sm opacity-65 mb-1">To</p>
              <p className="font-semibold opacity-80 overflow-hidden text-ellipsis flex flex-row items-center gap-2">
                <FaLocationDot className="opacity-60" />
                {destination}
              </p>
            </div>
            <div className="p-1">
              <p className="text-sm opacity-65 mb-1">Date & Time</p>
              <p className="font-semibold opacity-80 flex flex-row items-center gap-2">
                <MdDateRange className="opacity-60" />
                {formattedDate} • {time}
              </p>
            </div>
            <div className="p-1">
              <p className="text-sm opacity-65 mb-1">Available Seats</p>
              <p className="font-semibold opacity-80 flex flex-row items-center gap-2">
                <PiSeatFill className="opacity-60" />
                {seats_left} seats
              </p>
            </div>
          </div>
          <div className="w-[90%] pb-4 text-muted-foreground text-[0.9rem]">
            {desc_text}
          </div>
          <div className="flex flex-col md:flex-row md:items-center gap-2 mt-4 md:mt-2 w-full justify-start">
            <FaCarSide className="text-md opacity-65" />
            <div className="text-sm flex md:flex-row flex-col gap-1 md:gap-2 opacity-65 font-semibold w-[65%] md:w-[30%]">
              <div className="flex flex-row gap-1 md:gap-2 w-full">
                <p className=""> {car_class} </p>
                <p className="block">•</p>
                <p className="overflow-hidden text-ellipsis text-nowrap">
                  {car_model}
                </p>
              </div>

              <div className="flex flex-row gap-2 md:pl-2 items-center">
                {air_conditioning && <Badge>AC</Badge>}
                {!air_conditioning && (
                  <Badge className="text-nowrap">Non AC</Badge>
                )}

                {gender_pref === "male" && (
                  <Badge className="text-nowrap">Male Only</Badge>
                )}
                {gender_pref === "female" && (
                  <Badge className="text-nowrap">Female Only</Badge>
                )}
                {gender_pref === "any" && (
                  <Badge className="text-nowrap">Any Gender</Badge>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="w-[20%] flex flex-col items-end justify-between">
          <div className="text-xl md:text-2xl font-bold">₹{ride_cost}/seat</div>
          {isOwner ? (
            <Button
              variant="destructive"
              onClick={handleDelete}
              className="text-wrap md:text-nowrap py-8 text-md md:py-3 md:px-4"
            >
              Delete Ride
            </Button>
          ) : (
            <Button
              variant="destructive"
              onClick={handleLeave}
              className="text-wrap md:text-nowrap py-8 text-md md:py-3 md:px-4"
            >
              Leave Ride
            </Button>
          )}
        </div>
      </div>

      <Separator className="my-4" />
      <div className="w-full">
        <h3 className="font-medium mb-3">Ride Members ({members.length})</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3">
          {members.map((member) => (
            <div
              key={member.id}
              className="flex items-center justify-between p-2 rounded-lg bg-muted/50"
            >
              <div className="flex items-center gap-2">
                <ColourAvatar name={member.fullname} />
                <div>
                  <p className="text-sm font-medium">{member.fullname}</p>
                  <p className="text-xs text-muted-foreground">
                    {member.email}
                  </p>
                </div>
              </div>
              {isOwner && !member.isOwner && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive"
                      onClick={() =>
                        member.passengerId && handleRemove(member.passengerId)
                      }
                    >
                      <UserX className="mr-2 h-4 w-4" />
                      Remove
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
              {member.isOwner && (
                <Badge variant="secondary" className="ml-2">
                  Owner
                </Badge>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
