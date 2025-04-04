import React from "react";
import ColourAvatar from "./colour-avatar";

type Props = {
  name: string;
  branch: string;
  year: string;
  comment: string;
};

export default function FeedbackCard({ name, branch, year, comment }: Props) {
  return (
    <div className="bg-sidebar-accent p-8 rounded-xl flex flex-col justify-center items-start gap-6 min-h-[18rem]">
      <ColourAvatar name={name} className="scale-125 ml-1" />
      <div className="flex text-wrap font-medium text-accent-foreground/80">
        &quot;{comment}&quot;
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-lg font-semibold">{name}</p>
        <p className="text-muted-foreground">
          {branch}, {year}
        </p>
      </div>
    </div>
  );
}
