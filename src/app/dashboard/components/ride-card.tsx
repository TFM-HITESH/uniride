import ColourAvatar from "@/components/colour-avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import React from "react";
import { FaCarSide } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { MdDateRange } from "react-icons/md";
import { PiSeatFill } from "react-icons/pi";
// import { FaTaxi } from "react-icons/fa";

type Props = {
  fullname: string;
  email: string;
  ride_cost: number;
  source: string;
  destination: string;
  time: string;
  date: string;
  seats_left: number;
  desc_text: string;
  car_class: string;
  car_model: string;
  air_conditioning: boolean;
  female_only: boolean;
  male_only: boolean;
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
  desc_text,
  car_class,
  car_model,
  air_conditioning,
  female_only,
  male_only,
}: Props) {
  return (
    <div className="w-full flex flex-row p-4 md:p-6 rounded-2xl bg-card border">
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
              {date} • {time}
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
          {/* <FaTaxi className="text-sm opacity-65" /> */}
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
              {female_only && (
                <Badge className="text-nowrap">Female Only</Badge>
              )}
              {male_only && <Badge className="text-nowrap">Male Only</Badge>}
            </div>
          </div>
        </div>
      </div>
      <div className="w-[20%] flex flex-col items-end justify-between">
        <div className=" text-xl md:text-2xl font-bold">₹{ride_cost}/seat</div>
        <Button className="text-wrap md:text-nowrap py-8 text-md md:py-3 md:px-4 ">
          Request to Join
        </Button>
      </div>
    </div>
  );
}
