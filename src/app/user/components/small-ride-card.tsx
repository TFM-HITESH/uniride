import { Badge } from "@/components/ui/badge";
import React from "react";

type Props = {
  source: string;
  destination: string;
  status: string;
  date: string;
  passenger_count: string;
};

export default function SmallRideCard({
  source,
  destination,
  status,
  date,
  passenger_count,
}: Props) {
  return (
    <div className="w-full rounded-md p-3 md:p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center shadow-sm bg-sidebar-accent m-0.5 gap-2 sm:gap-0">
      <div className="w-full sm:w-auto">
        <div className="text-sm md:text-md font-bold">
          {source} to {destination}
        </div>
        <div className="text-xs md:text-sm text-muted-foreground font-semibold">
          {date} • {passenger_count} co-passengers
        </div>
      </div>
      <div className="w-full sm:w-auto self-end sm:self-auto">
        {status === "Ongoing" && (
          <Badge className="bg-red-700 text-white text-xs md:text-sm">
            {status}
          </Badge>
        )}
        {status === "Completed" && (
          <Badge className="text-xs md:text-sm">{status}</Badge>
        )}
      </div>
    </div>
  );
}
