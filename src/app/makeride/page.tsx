import React from "react";
import { RideForm } from "./components/ride-form";

type Props = {};

export default function page({}: Props) {
  return (
    <div className="min-h-screen w-full flex justify-center items-center">
      <RideForm />
    </div>
  );
}
