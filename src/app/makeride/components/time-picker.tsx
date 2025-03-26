"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { FaRegClock } from "react-icons/fa";

interface TimePickerProps {
  field: {
    value: string;
    onChange: (value: string) => void;
  };
}

export function TimePicker({ field }: TimePickerProps) {
  const [hour, setHour] = React.useState("12");
  const [minute, setMinute] = React.useState("00");
  const [period, setPeriod] = React.useState("AM");
  const [open, setOpen] = React.useState(false);

  const hours = Array.from({ length: 12 }, (_, i) => (i + 1).toString());
  const minutes = ["00", "15", "30", "45"];
  const periods = ["AM", "PM"];

  const handleConfirm = () => {
    const selectedTime = `${hour}:${minute} ${period}`;
    field.onChange(selectedTime);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full flex justify-between pl-3">
          <p className="text-muted-foreground font-normal">
            {field.value || "Pick a time"}
          </p>
          <FaRegClock className="text-muted-foreground opacity-80 font-light" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-4 flex flex-col items-center bg-background rounded-lg shadow-md">
        <div className="flex space-x-2 mb-4">
          <ScrollArea className="h-40 w-14 border rounded-md overflow-y-auto">
            {hours.map((h) => (
              <div
                key={h}
                className={cn(
                  "px-4 py-2 cursor-pointer text-center",
                  hour === h
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted"
                )}
                onClick={() => setHour(h)}
              >
                {h}
              </div>
            ))}
          </ScrollArea>
          <ScrollArea className="h-[10.1rem] w-14 border rounded-md overflow-y-auto">
            {minutes.map((m) => (
              <div
                key={m}
                className={cn(
                  "px-4 py-2 cursor-pointer text-center",
                  minute === m
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted"
                )}
                onClick={() => setMinute(m)}
              >
                {m}
              </div>
            ))}
          </ScrollArea>
          <ScrollArea className="h-[5.1rem] w-14 border rounded-md overflow-y-auto">
            {periods.map((p) => (
              <div
                key={p}
                className={cn(
                  "px-4 py-2 cursor-pointer text-center",
                  period === p
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted"
                )}
                onClick={() => setPeriod(p)}
              >
                {p}
              </div>
            ))}
          </ScrollArea>
        </div>
        <Button onClick={handleConfirm} className="w-full">
          Confirm Time
        </Button>
      </PopoverContent>
    </Popover>
  );
}
