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

const formSchema = z
  .object({
    source: z.string().trim().min(2, {
      message: "Ride pickup address must be at least 2 characters.",
    }),

    destination: z.string().trim().min(2, {
      message: "Ride destination address must be at least 2 characters.",
    }),

    date: z
      .date({
        required_error: "A date of ride is required.",
      })
      .refine((date) => date >= new Date(), {
        message: "The ride date must be in the future.",
      }),

    time: z.string({
      message: "You must pick a time for the ride.",
    }), // Keeping your original time validation

    car_class: z
      .string({
        required_error: "You must pick a class of cars.",
      })
      .trim(),

    car_model: z
      .string()
      .trim()
      .min(2, { message: "Car model name must be at least 2 characters." }),

    seats_left: z
      .string()
      .min(1, { message: "Seats left is required." })
      .regex(/^\d+$/, { message: "Seats left must be a number." })
      .transform(Number)
      .refine((num) => num > 0 && num <= 20, {
        message: "Total number of seats left must be between 1 and 20.",
      }),

    ride_cost: z
      .string()
      .min(1, { message: "Ride cost is required." })
      .regex(/^\d+$/, { message: "Ride cost must be a number." })
      .transform(Number)
      .refine((num) => num > 0 && num <= 4000, {
        message: "Total ride cost must be between ₹1 and ₹4000.",
      }),

    gender_pref: z.enum(["any", "male", "female"], {
      required_error: "You must select a valid gender preference.",
    }),

    air_conditioning: z.enum(["ac", "nonac"], {
      required_error: "You must select a valid AC option.",
    }),

    desc_text: z
      .string()
      .trim()
      .min(10, { message: "Description must be at least 10 characters long." })
      .max(100, { message: "Description must not exceed 100 characters." })
      .refine((text) => text.replace(/\s/g, "").length > 0, {
        message: "Description cannot be only spaces.",
      })
      .refine((text) => !/[<>{}]/.test(text), {
        message: "Description contains invalid characters.",
      }),
  })
  .refine((data) => data.source !== data.destination, {
    message: "Pickup and destination addresses must be different.",
    path: ["destination"], // Error will show under 'destination'
  });

export function RideForm() {
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      source: "",
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
    console.log(values.ride_cost);
  }

  const now = new Date();
  now.setHours(0, 0, 0, 0); // Reset to start of the day
  now.setDate(now.getDate() - 1);
  const threeMonthsAhead = new Date();
  threeMonthsAhead.setMonth(now.getMonth() + 3);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 border rounded-xl w-[95%] p-8 md:w-[45%] my-10"
      >
        <p className="text-3xl font-semibold">Create a New Ride</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <FormField
            control={form.control}
            name="source"
            render={({ field }) => (
              <FormItem>
                <FormLabel>From</FormLabel>
                <FormControl>
                  <Input placeholder="Ride Source" {...field} />
                </FormControl>
                <FormDescription>
                  {/* This is your public display name. */}
                </FormDescription>
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
                  <Input placeholder="Ride Destination" {...field} />
                </FormControl>
                <FormDescription>
                  {/* This is your public display name. */}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Ride Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
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
                        date <= now || date >= threeMonthsAhead
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription></FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="time"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Ride Timings</FormLabel>
                <FormControl>
                  <TimePicker field={field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="car_class"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Car Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select the type of car being booked" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Hatchback">Hatchback</SelectItem>
                    <SelectItem value="Sedan">Sedan</SelectItem>
                    <SelectItem value="SUV">SUV</SelectItem>
                    <SelectItem value="Auto">Auto</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription></FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="car_model"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Car Model</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Swift Dzire, WagonR etc. (Put NA if unknown)"
                    {...field}
                  />
                </FormControl>
                <FormDescription></FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="seats_left"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Seats Available</FormLabel>
                <FormControl>
                  <Input placeholder="Seats Left" {...field} />
                </FormControl>
                <FormDescription></FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="ride_cost"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Estimated Ride Cost (₹)</FormLabel>
                <FormControl>
                  <Input placeholder="Cost per person" {...field} />
                </FormControl>
                <FormDescription></FormDescription>
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
                    defaultValue={field.value}
                    className="flex flex-row space-x-2 "
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="any" />
                      </FormControl>
                      <FormLabel className="font-normal text-ls text-nowrap">
                        Any
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="male" />
                      </FormControl>
                      <FormLabel className="font-normal text-nowrap">
                        Male Only
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="female" />
                      </FormControl>
                      <FormLabel className="font-normal text-nowrap">
                        Female Only
                      </FormLabel>
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
                <FormLabel>Air Conditioning Status</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-row space-x-2"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="ac" />
                      </FormControl>
                      <FormLabel className="font-normal">AC</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
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
                  placeholder="Any other specific requirements or information"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription></FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
