"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import {
  getUserByEmail,
  getUserRideHistory,
} from "../../../actions/user-actions";
import ColourAvatar from "@/components/colour-avatar";
import SmallRideCard from "./components/small-ride-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

type User = {
  id: string;
  email: string;
  fullname: string;
  regno: string;
  gender?: string | null;
  completedRides?: number;
};

type RideHistory = {
  id: string;
  source: string;
  destination: string;
  date: string;
  status: string;
  passenger_count: string;
};

export default function Page() {
  const { data: session } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const [rideHistory, setRideHistory] = useState<RideHistory[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      if (session?.user?.email) {
        try {
          setLoading(true);
          setError(null);

          // Fetch user data
          const userResult = await getUserByEmail(session.user.email);
          if ("error" in userResult) {
            setError(userResult.error || "Failed to fetch user data");
            return;
          }
          setUser(userResult);

          // Fetch ride history
          const historyResult = await getUserRideHistory(session.user.email);
          if (Array.isArray(historyResult)) {
            setRideHistory(historyResult);
          } else if ("error" in historyResult) {
            setError(historyResult.error || "Failed to fetch ride history");
          }
        } catch (err) {
          setError("Failed to fetch data");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [session]);

  return (
    <div className="flex w-full flex-col items-center p-2 md:p-4 min-h-screen">
      {error && (
        <Alert
          variant="destructive"
          className="w-full md:w-[90%] lg:w-[70%] my-2 md:my-4"
        >
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* User Profile Section */}
      <div className="w-full md:w-[90%] lg:w-[70%] flex flex-col md:flex-row items-center justify-between bg-sidebar-accent my-4 md:my-10 p-4 md:p-8 rounded-md shadow-lg gap-4 md:gap-0">
        <div className="flex flex-col md:flex-row items-center px-2 md:px-8 p-2 md:p-4 gap-6 md:gap-14 w-full md:w-auto">
          <div className="flex flex-col items-center justify-center">
            {loading ? (
              <Skeleton className="w-16 h-16 md:w-20 md:h-20 rounded-full" />
            ) : (
              <ColourAvatar
                name={user?.fullname ?? "Guest"}
                className="scale-[1.8] md:scale-[2.5] border-card-foreground/70 shadow-sm"
              />
            )}
          </div>
          <div className="flex flex-col justify-center items-center md:items-start w-full md:w-auto">
            {loading ? (
              <>
                <Skeleton className="w-48 h-6 mb-2" />
                <Skeleton className="w-36 h-4 mb-2" />
                <Skeleton className="w-24 h-4 mt-4" />
              </>
            ) : (
              <>
                <div className="text-xl md:text-2xl font-bold flex flex-col md:flex-row items-center gap-2 md:gap-4">
                  {user?.fullname}{" "}
                  <Badge className="text-xs md:text-sm">{user?.regno}</Badge>
                </div>
                <p className="text-muted-foreground font-normal text-sm md:text-md text-center md:text-left">
                  {user?.email}
                </p>
                {user?.gender && (
                  <p className="text-muted-foreground mt-2 md:mt-4 capitalize text-sm md:text-base">
                    {user.gender.toLowerCase()}
                  </p>
                )}
              </>
            )}
          </div>
        </div>
        <div className="flex flex-col items-center justify-center p-2 md:p-4 px-4 md:px-16 w-full md:w-auto">
          {loading ? (
            <>
              <Skeleton className="w-10 h-10 md:w-12 md:h-12 rounded-md" />
              <Skeleton className="w-20 md:w-24 h-6 md:h-8 mt-2" />
            </>
          ) : (
            <>
              <div className="text-3xl md:text-5xl font-bold">
                {user?.completedRides || 0}
              </div>
              <div className="flex flex-col items-center justify-center text-sm md:text-md font-semibold mt-1 md:mt-2">
                <p>Rides</p>
                <p>Completed</p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Ride History Section */}
      <div className="flex flex-col w-full md:w-[90%] lg:w-[70%] rounded-md border-2 px-4 md:px-8 p-2 md:p-4 gap-2 md:gap-3">
        <p className="text-lg md:text-xl font-medium shadow-sm">
          Recent Travel History
        </p>

        <div className="flex flex-col items-center justify-center gap-2 w-full">
          {loading ? (
            <>
              <Skeleton className="w-full h-14 md:h-16 mt-2 md:mt-4" />
              <Skeleton className="w-full h-14 md:h-16 mt-2 md:mt-4" />
            </>
          ) : rideHistory.length > 0 ? (
            rideHistory.map((ride) => (
              <SmallRideCard
                key={ride.id}
                source={ride.source}
                destination={ride.destination}
                status={ride.status}
                date={ride.date}
                passenger_count={ride.passenger_count}
              />
            ))
          ) : (
            <p className="text-muted-foreground py-2 md:py-4 text-sm md:text-base">
              {error ? "Error loading ride history" : "No ride history found"}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
