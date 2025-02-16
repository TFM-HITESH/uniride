import React from "react";
import { AdminSidebar } from "./components/AdminSidebar";

type Props = {};

export default function page({}: Props) {
  return (
    <div className="h-full">
      <AdminSidebar />
    </div>
  );
}
