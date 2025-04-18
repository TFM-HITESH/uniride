"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { TimePicker } from "./time-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { createRide } from "../../../../actions/create-ride";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";

const formSchema = z
  .object({
    source: z
      .string()
      .trim()
      .min(2, { message: "Pickup must be at least 2 characters." }),
    destination: z
      .string()
      .trim()
      .min(2, { message: "Destination must be at least 2 characters." }),
    date: z.date({ required_error: "Date is required." }).refine(
      (date) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return date >= today;
      },
      {
        message: "Date must be today or in future.",
      }
    ),
    time: z.string({ message: "Time is required." }),
    car_class: z.string({ required_error: "Car class is required." }).trim(),
    car_model: z
      .string()
      .trim()
      .min(2, { message: "Model must be at least 2 characters." }),
    total_seats: z
      .string()
      .min(1, { message: "Seats required." })
      .regex(/^\d+$/, { message: "Must be number." })
      .transform(Number)
      .refine((num) => num > 1 && num <= 20, {
        message: "Seats must be 2-20.",
      }),
    ride_cost: z
      .string()
      .min(1, { message: "Cost required." })
      .regex(/^\d+$/, { message: "Must be number." })
      .transform(Number)
      .refine((num) => num > 0 && num <= 4000, {
        message: "Cost must be ₹1-4000.",
      }),
    gender_pref: z.enum(["any", "male", "female"], {
      required_error: "Gender preference required.",
    }),
    air_conditioning: z.enum(["ac", "nonac"], {
      required_error: "AC option required.",
    }),
    desc_text: z
      .string()
      .trim()
      .min(10, { message: "Description too short." })
      .max(100, { message: "Description too long." })
      .refine((text) => text.replace(/\s/g, "").length > 0, {
        message: "Description required.",
      })
      .refine((text) => !/[<>{}]/.test(text), {
        message: "Invalid characters.",
      }),
  })
  .refine((data) => data.source !== data.destination, {
    message: "Locations must differ.",
    path: ["destination"],
  });

export function RideForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      source: "",
      destination: "",
      car_class: "Sedan",
      // total_seats: "4",
      // ride_cost: "100",
      gender_pref: "any",
      air_conditioning: "ac",
    },
  });

  const router = useRouter();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      // Parse the time from "HH:mm AM/PM" format
      const [timeStr, period] = values.time.split(" ");
      // eslint-disable-next-line
      let [hours, minutes] = timeStr.split(":").map(Number);
      // Convert 12-hour to 24-hour format
      if (period === "PM" && hours !== 12) {
        hours += 12;
      } else if (period === "AM" && hours === 12) {
        hours = 0;
      }

      // Create the combined date object
      const rideDate = new Date(values.date);
      rideDate.setHours(hours, minutes, 0, 0);

      // Debug logs
      console.log("Form values:", values);
      console.log("Parsed hours:", hours, "minutes:", minutes);
      console.log("Combined date:", rideDate);
      console.log("Local string:", rideDate.toLocaleString());
      console.log("ISO string:", rideDate.toISOString());

      const result = await createRide({
        ...values,
        date: rideDate,
      });

      if (result?.success) {
        toast.success("Ride created successfully!");
        router.push("/messages");
        router.refresh();
      } else if (result?.error) {
        throw new Error(result.error);
      }
    } catch (err) {
      toast.error("Failed to create ride", {
        description:
          err instanceof Error ? err.message : "An unknown error occurred",
      });
      console.error("Error details:", err);
    } finally {
      setIsSubmitting(false);
    }
  }

  // Calendar constraints
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const threeMonthsLater = new Date();
  threeMonthsLater.setMonth(today.getMonth() + 3);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 p-4 sm:p-8 w-full md:w-[50%] mx-auto border rounded-lg shadow-sm"
      >
        <p className="text-2xl sm:text-3xl font-semibold">Create a New Ride</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <FormField
            control={form.control}
            name="source"
            render={({ field }) => (
              <FormItem>
                <FormLabel>From</FormLabel>
                <FormControl>
                  <Input placeholder="Pickup location" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="destination"
            render={({ field }) => (
              <FormItem>
                <FormLabel>To</FormLabel>
                <FormControl>
                  <Input placeholder="Destination" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? format(field.value, "PPP") : "Pick date"}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date < today || date > threeMonthsLater
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="time"
            render={({ field }) => {
              const selectedDate = form.getValues("date");
              const isToday =
                selectedDate &&
                format(selectedDate, "yyyy-MM-dd") ===
                  format(new Date(), "yyyy-MM-dd");

              return (
                <FormItem className="flex flex-col">
                  <FormLabel>Time (IST)</FormLabel>
                  <FormControl>
                    <TimePicker field={field} isToday={isToday} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <FormField
            control={form.control}
            name="car_class"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Car Type</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Hatchback">Hatchback</SelectItem>
                    <SelectItem value="Sedan">Sedan</SelectItem>
                    <SelectItem value="SUV">SUV</SelectItem>
                    <SelectItem value="Auto">Auto</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="car_model"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Model</FormLabel>
                <FormControl>
                  <Input placeholder="Car model" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="total_seats"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Total Seats</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Total seats"
                    {...field}
                    onChange={(e) => {
                      if (/^\d*$/.test(e.target.value)) {
                        field.onChange(e.target.value);
                      }
                    }}
                  />
                </FormControl>
                <FormDescription>
                  Including yourself (Driver + passengers)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="ride_cost"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cost (₹)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Cost per person"
                    {...field}
                    onChange={(e) => {
                      if (/^\d*$/.test(e.target.value)) {
                        field.onChange(e.target.value);
                      }
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="gender_pref"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Gender Preference</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value}
                    className="flex flex-col sm:flex-row gap-2 sm:gap-4"
                  >
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="any" />
                      </FormControl>
                      <FormLabel className="font-normal">Any</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="male" />
                      </FormControl>
                      <FormLabel className="font-normal">Male Only</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="female" />
                      </FormControl>
                      <FormLabel className="font-normal">Female Only</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="air_conditioning"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>AC Preference</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value}
                    className="flex flex-col sm:flex-row gap-2 sm:gap-4"
                  >
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="ac" />
                      </FormControl>
                      <FormLabel className="font-normal">AC</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="nonac" />
                      </FormControl>
                      <FormLabel className="font-normal">Non-AC</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="desc_text"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Additional Details</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Share any important details about your ride..."
                  className="resize-none min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <div className="flex items-center justify-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-background"></div>
              Creating Ride...
            </div>
          ) : (
            "Create Ride"
          )}
        </Button>
      </form>
    </Form>
  );
}
