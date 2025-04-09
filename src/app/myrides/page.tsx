// app/myrides/page.tsx
import RideCard from "./components/ride-card";
import { getUserRides } from "@/../actions/my-rides";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export default async function MyRidesPage() {
  const rides = await getUserRides();

  return (
    <div className="flex flex-row w-full items-start justify-center px-[8rem]">
      <div className="container py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">My Rides</h1>
          <Link href="/makeride">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Ride
            </Button>
          </Link>
        </div>

        {rides.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 gap-4">
            <h2 className="text-xl font-medium">No rides found</h2>
            <p className="text-muted-foreground">
              You haven&apos;t created or joined any rides yet
            </p>
            <Link href="/dashboard">
              <Button variant="outline">Find Rides</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {rides.map((ride) => (
              <RideCard
                key={ride.id}
                id={ride.id}
                fullname={ride.creator.fullname}
                email={ride.creator.email}
                ride_cost={ride.ride_cost}
                source={ride.source}
                destination={ride.destination}
                time={ride.time}
                date={ride.date}
                seats_left={ride.seats_left}
                desc_text={ride.desc_text}
                car_class={ride.car_class}
                car_model={ride.car_model}
                air_conditioning={ride.air_conditioning}
                gender_pref={ride.gender_pref}
                isOwner={ride.isOwner}
                isParticipant={ride.isParticipant}
                members={[
                  {
                    id: ride.creatorId,
                    fullname: ride.creator.fullname,
                    email: ride.creator.email,
                    isOwner: true,
                  },
                  ...ride.passengers.map((p) => ({
                    id: p.user.id,
                    fullname: p.user.fullname,
                    email: p.user.email,
                    isOwner: false,
                    passengerId: p.id,
                  })),
                ]}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
