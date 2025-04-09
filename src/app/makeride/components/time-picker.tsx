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
  isToday?: boolean;
}

export function TimePicker({ field, isToday }: TimePickerProps) {
  const [hour, setHour] = React.useState("12");
  const [minute, setMinute] = React.useState("00");
  const [period, setPeriod] = React.useState<"AM" | "PM">("AM");
  const [open, setOpen] = React.useState(false);

  const hours = Array.from({ length: 12 }, (_, i) =>
    (i + 1).toString().padStart(2, "0")
  );
  const minutes = ["00", "15", "30", "45"];
  const periods: ["AM", "PM"] = ["AM", "PM"];

  React.useEffect(() => {
    if (field.value) {
      try {
        const [time, period] = field.value.split(" ");
        const [h, m] = time.split(":");
        if (h && m && (period === "AM" || period === "PM")) {
          setHour(h);
          setMinute(m);
          setPeriod(period);
        }
        // eslint-disable-next-line
      } catch (e) {
        console.error("Invalid time format in field value", field.value);
      }
    }
  }, [field.value]);

  const isTimeDisabled = (h: string, m: string, p: "AM" | "PM") => {
    if (!isToday) return false;

    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    const hourNum = parseInt(h);
    const minuteNum = parseInt(m);
    const selectedHour24 = p === "PM" ? (hourNum % 12) + 12 : hourNum % 12;

    return (
      selectedHour24 < currentHour ||
      (selectedHour24 === currentHour && minuteNum < currentMinute)
    );
  };

  const handleConfirm = () => {
    const selectedTime = `${hour}:${minute} ${period}`;
    field.onChange(selectedTime);
    setOpen(false);
  };

  const currentTimeValid = !isTimeDisabled(hour, minute, period);

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
            {hours.map((h) => {
              const disabled = isTimeDisabled(h, minute, period);
              return (
                <div
                  key={h}
                  className={cn(
                    "px-4 py-2 cursor-pointer text-center",
                    hour === h
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted",
                    disabled && "opacity-50 cursor-not-allowed"
                  )}
                  onClick={() => !disabled && setHour(h)}
                >
                  {h}
                </div>
              );
            })}
          </ScrollArea>
          <ScrollArea className="h-40 w-14 border rounded-md overflow-y-auto">
            {minutes.map((m) => {
              const disabled = isTimeDisabled(hour, m, period);
              return (
                <div
                  key={m}
                  className={cn(
                    "px-4 py-2 cursor-pointer text-center",
                    minute === m
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted",
                    disabled && "opacity-50 cursor-not-allowed"
                  )}
                  onClick={() => !disabled && setMinute(m)}
                >
                  {m}
                </div>
              );
            })}
          </ScrollArea>
          <ScrollArea className="h-20 w-14 border rounded-md overflow-y-auto">
            {periods.map((p) => {
              const disabled = isTimeDisabled(hour, minute, p);
              return (
                <div
                  key={p}
                  className={cn(
                    "px-4 py-2 cursor-pointer text-center",
                    period === p
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted",
                    disabled && "opacity-50 cursor-not-allowed"
                  )}
                  onClick={() => !disabled && setPeriod(p)}
                >
                  {p}
                </div>
              );
            })}
          </ScrollArea>
        </div>
        <Button
          onClick={handleConfirm}
          className="w-full"
          disabled={!currentTimeValid}
        >
          Confirm Time
        </Button>
        {!currentTimeValid && (
          <p className="text-sm text-red-500 mt-2">
            Cannot select a time in the past
          </p>
        )}
      </PopoverContent>
    </Popover>
  );
}
