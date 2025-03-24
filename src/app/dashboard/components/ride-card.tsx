import ColourAvatar from "@/components/colour-avatar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import React from "react";
import { FaTaxi } from "react-icons/fa";

type Props = {
  fullname: string;
  email: string;
  ride_cost: number;
  source: string;
  destination: string;
  time: string;
  date: string;
  seats_left: number;
  car_class: string;
  car_model: string;
  air_conditioning: boolean;
  female_only: boolean;
};

export default function RideCard({
  fullname,
  email,
  ride_cost,
  source,
  destination,
  time,
  date,
  seats_left,
  car_class,
  car_model,
  air_conditioning,
  female_only,
}: Props) {
  return (
    <div className="w-full flex flex-row p-6 rounded-2xl bg-card border">
      <div className="w-[80%] flex flex-col">
        <div className="flex flex-row gap-4 items-center justify-start">
          <ColourAvatar name={fullname} />
          <div className="flex flex-col">
            <div className="font-stretch-expanded tracking-wide">
              {fullname}
            </div>
            <div className="text-sm opacity-65">{email}</div>
          </div>
        </div>
        <div className="py-2 my-2 gap-x-[30%] w-full grid grid-cols-2 justify-items-start">
          <div className="p-1">
            <p className="text-sm opacity-65 ">From</p>
            <p className="font-semibold opacity-80">{source}</p>
          </div>
          <div className="p-1">
            <p className="text-sm opacity-65">To</p>
            <p className="font-semibold opacity-80">{destination}</p>
          </div>
          <div className="p-1">
            <p className="text-sm opacity-65">Date & Time</p>
            <p className="font-semibold opacity-80">
              {date} • {time}
            </p>
          </div>
          <div className="p-1">
            <p className="text-sm opacity-65">Available Seats</p>
            <p className="font-semibold opacity-80">{seats_left} seats</p>
          </div>
        </div>
        <div className="flex flex-row items-center gap-2 ">
          <FaTaxi className="text-sm opacity-65" />
          <p className="text-sm opacity-65 font-semibold">
            {car_class} • {car_model}
          </p>
          <div className="flex flex-row gap-2 pl-2">
            {air_conditioning && <Badge>AC</Badge>}
            {female_only && <Badge>Female Only</Badge>}
          </div>
        </div>
      </div>
      <div className="w-[20%] flex flex-col items-end justify-between">
        <div className="text-lg font-bold">₹{ride_cost}/seat</div>
        <Button>Request to Join</Button>
      </div>
    </div>
  );
}
