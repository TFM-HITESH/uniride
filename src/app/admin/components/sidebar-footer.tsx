import ColourAvatar from "@/components/colour-avatar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import React from "react";

type Props = {};

export default function SidebarFooterComponent({}: Props) {
  return (
    <div className="flex flex-row gap-3 items-center hover:bg-sidebar-accent p-2 rounded-xl transition-all ease-in-out duration-50">
      <div>
        <ColourAvatar name="Hitesh Shivkumar" />
      </div>
      <div>
        <div className="font-stretch-expanded tracking-wide">
          Hitesh Shivkumar
        </div>
        <div className="overflow-hidden text-ellipsis w-[60%] text-sm opacity-65">
          hitesh.shivkumar2022@vitstudent.ac.in
        </div>
      </div>
    </div>
  );
}
