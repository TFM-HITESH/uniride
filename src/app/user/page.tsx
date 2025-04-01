"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { getUserByEmail } from "../../../actions/db-actions";
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
  gender?: string;
};

export default function Page() {
  const { data: session } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (session?.user?.email) {
        setLoading(true);
        const result = await getUserByEmail(session.user.email);
        setLoading(false);

        if ("error" in result) {
          setError(result.error);
        } else {
          setUser(result);
        }
      }
    };

    fetchUser();
  }, [session]);

  return (
    <div className="flex w-full flex-col items-center p-4 min-h-screen">
      {error && (
        <Alert variant="destructive" className="w-[70%] my-4">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="w-[70%] flex flex-row items-center justify-between bg-sidebar-accent my-10 p-8 rounded-md shadow-lg">
        <div className="flex flex-row px-8 p-4 gap-14">
          <div className="flex flex-col items-center justify-center">
            {loading ? (
              <Skeleton className="w-20 h-20 rounded-full" />
            ) : (
              <ColourAvatar
                name={user?.fullname ?? "Guest"}
                className="scale-[2.5] border-card-foreground/70 shadow-sm"
              />
            )}
          </div>
          <div className="flex flex-col justify-center">
            {loading ? (
              <Skeleton className="w-48 h-6 mb-2" />
            ) : (
              <div className="text-2xl font-bold flex flex-row items-center gap-4">
                {user?.fullname} <Badge>{user?.regno}</Badge>
                {/* <span className="text-muted-foreground opacity-70 text-lg font-medium ml-2"></span> */}
              </div>
            )}
            {loading ? (
              <Skeleton className="w-36 h-4 mb-2" />
            ) : (
              <p className="text-muted-foreground font-normal text-md">
                {user?.email}
              </p>
            )}
            {loading ? (
              <Skeleton className="w-24 h-4" />
            ) : (
              <p className="text-muted-foreground mt-4">{user?.gender}</p>
            )}
          </div>
        </div>
        <div className="flex flex-col items-center justify-center p-4 px-16">
          {loading ? (
            <Skeleton className="w-12 h-12 rounded-md" />
          ) : (
            <div className="text-5xl font-bold">100</div>
          )}
          <div className="flex flex-col items-center justify-center text-md font-semibold mt-2">
            <p>Rides</p>
            <p>Completed</p>
          </div>
        </div>
      </div>
      <div className="flex flex-col w-[70%] rounded-md border-2 px-8 p-4 gap-3">
        <p className="text-xl font-medium shadow-sm">Recent Travel History</p>

        <div className="flex flex-col items-center justify-center gap-2">
          {loading ? (
            <Skeleton className="w-full h-16 mt-4" />
          ) : (
            <SmallRideCard
              source="VIT Main Gate"
              destination="Chennai Airport"
              status="Ongoing"
              date="Jan 15, 2025"
              passenger_count="6"
            />
          )}
          {loading ? (
            <Skeleton className="w-full h-16 mt-4" />
          ) : (
            <SmallRideCard
              source="Katpadi Station"
              destination="VIT Girls Hostel"
              status="Completed"
              date="Jan 10, 2025"
              passenger_count="4"
            />
          )}
        </div>
      </div>
    </div>
  );
}
