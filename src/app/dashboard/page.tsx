"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import React from "react";
import RideCard from "./components/ride-card";

type Props = {};

export default function Page({}: Props) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    if (!session || !session.user?.email?.endsWith("@vitstudent.ac.in")) {
      router.push("/login"); // Redirect unauthorized users
    }
  }, [session, status, router]);

  if (status === "loading") return <p>Loading...</p>;

  // <p className="text-lg">{session?.user?.name}!</p>
  // <p className="text-md text-gray-600">Email: {session?.user?.email}</p>
  return (
    <div className="w-full flex justify-center items-center min-h-screen">
      <div className="flex flex-col gap-10 my-10 w-[90%] md:w-[45%]">
        <RideCard
          fullname="Hitesh Shivkumar"
          email="hitesh.shivkumar2022@vitstudent.ac.in"
          ride_cost={450}
          source="VIT Main Gate"
          destination="Katpadi Station"
          time="2:30 PM"
          date="Jan 15, 2025"
          seats_left={2}
          desc_text="Will leave after 1:20 lab. Pickup from right near wraps and fries. Will pickup food from McDonalds."
          car_class="Sedan"
          car_model="Swift Dzire"
          air_conditioning={true}
          gender_pref="male"
        />
        <RideCard
          fullname="Shreya Gupta"
          email="shreya.gupta2022a@vitstudent.ac.in"
          ride_cost={550}
          source="VIT Main Gate"
          destination="Katpadi Station"
          time="3:30 PM"
          date="Jan 21, 2025"
          seats_left={4}
          desc_text="Leaving after 3:30 class from SJT. Passing through. Can stop at main gate for a quick pickup."
          car_class="Sedan"
          car_model="Chevy Impala"
          air_conditioning={false}
          gender_pref="any"
        />
      </div>
    </div>
  );
}
