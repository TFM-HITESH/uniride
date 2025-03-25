import React from "react";
import { cn } from "@/lib/utils";

const colors = [
  "red",
  "orange",
  "amber",
  "yellow",
  "lime",
  "green",
  "emerald",
  "teal",
  "cyan",
  "sky",
  "blue",
  "indigo",
  "violet",
  "purple",
  "fuchsia",
  "pink",
  "rose",
];

function enhancedHashStringToNumber(str: string) {
  return (
    str
      .split("")
      .reduce((acc, char, i) => acc ^ (char.charCodeAt(0) * (i + 1)), 0) %
    colors.length
  );
}

function getShades(name: string) {
  const colorIndex = enhancedHashStringToNumber(name);
  const color = colors[colorIndex];

  // Explicitly define the background and text color classes
  const bgClasses: Record<string, string> = {
    red: "bg-red-200",
    orange: "bg-orange-200",
    amber: "bg-amber-200",
    yellow: "bg-yellow-200",
    lime: "bg-lime-200",
    green: "bg-green-200",
    emerald: "bg-emerald-200",
    teal: "bg-teal-200",
    cyan: "bg-cyan-200",
    sky: "bg-sky-200",
    blue: "bg-blue-200",
    indigo: "bg-indigo-200",
    violet: "bg-violet-200",
    purple: "bg-purple-200",
    fuchsia: "bg-fuchsia-200",
    pink: "bg-pink-200",
    rose: "bg-rose-200",
  };

  const textClasses: Record<string, string> = {
    red: "text-red-800",
    orange: "text-orange-800",
    amber: "text-amber-800",
    yellow: "text-yellow-800",
    lime: "text-lime-800",
    green: "text-green-800",
    emerald: "text-emerald-800",
    teal: "text-teal-800",
    cyan: "text-cyan-800",
    sky: "text-sky-800",
    blue: "text-blue-800",
    indigo: "text-indigo-800",
    violet: "text-violet-800",
    purple: "text-purple-800",
    fuchsia: "text-fuchsia-800",
    pink: "text-pink-800",
    rose: "text-rose-800",
  };

  return {
    bg: bgClasses[color],
    text: textClasses[color],
  };
}

interface AvatarProps {
  name: string;
  className?: string;
}

const ColourAvatar: React.FC<AvatarProps> = ({ name, className }) => {
  const firstLetter = name.charAt(0).toUpperCase();
  const { bg, text } = getShades(name);

  return (
    <div
      className={cn(
        "w-10 h-10 md:w-10 md:h-10 flex items-center justify-center rounded-full font-bold",
        bg,
        text,
        className
      )}
    >
      {firstLetter}
    </div>
  );
};

export default ColourAvatar;
