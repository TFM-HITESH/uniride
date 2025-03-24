import React from "react";
import RideCard from "./components/ride-card";

type Props = {};

export default function page({}: Props) {
  return (
    <div className="w-full flex justify-center items-center h-screen">
      <div className="w-[45%]">
        <div className="w-full gap-6 flex flex-col">
          <RideCard
            fullname="Hitesh Shivkumar"
            email="hitesh.shivkumar2022@vitstudent.ac.in"
            ride_cost={450}
            source="VIT Main Gate"
            destination="Katpadi Station"
            time="2:30 PM"
            date="Jan 15, 2025"
            seats_left={2}
            car_class="Sedan"
            car_model="Swift Dzire"
            air_conditioning={true}
            female_only={false}
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
            car_class="Sedan"
            car_model="Chevy Impala"
            air_conditioning={true}
            female_only={true}
          />
        </div>
      </div>
    </div>
  );
}
