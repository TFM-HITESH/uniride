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
    <div className="w-full rounded-md p-4 flex flex-row justify-between items-center shadow-sm bg-sidebar-accent m-0.5">
      <div>
        <div className="text-md font-bold">
          {source} to {destination}
        </div>
        <div className="text-sm text-muted-foreground font-semibold">
          {date} • {passenger_count} co-passengers
        </div>
      </div>
      <div>
        {status === "Ongoing" && (
          <Badge className="bg-red-700 text-white">{status}</Badge>
        )}
        {status === "Completed" && <Badge>{status}</Badge>}
      </div>
    </div>
  );
}
