"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { TimePicker } from "../../makeride/components/time-picker";

interface RideFiltersProps {
  filters: {
    source: string;
    destination: string;
    date: Date | undefined;
    time: string;
    carClass: string;
    carModel: string;
    minSeats: string;
    maxPrice: string;
    genderPref: string;
    airConditioning: string;
  };
  onFilterChange: (newFilters: {
    source: string;
    destination: string;
    date: Date | undefined;
    time: string;
    carClass: string;
    carModel: string;
    minSeats: string;
    maxPrice: string;
    genderPref: string;
    airConditioning: string;
  }) => void;
  onRefresh: () => void;
  resultCount: number;
}

export function RideFilters({
  filters,
  onFilterChange,
  onRefresh,
  resultCount,
}: RideFiltersProps) {
  const handleInputChange = (name: string, value: string) => {
    onFilterChange({ ...filters, [name]: value });
  };

  return (
    <div className="w-full mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <Input
            placeholder="From (e.g. VIT Main Gate)"
            value={filters.source}
            onChange={(e) => handleInputChange("source", e.target.value)}
          />
        </div>
        <div>
          <Input
            placeholder="To (e.g. Katpadi Station)"
            value={filters.destination}
            onChange={(e) => handleInputChange("destination", e.target.value)}
          />
        </div>
        <div>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {filters.date ? (
                  format(filters.date, "PPP")
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={filters.date}
                onSelect={(date) =>
                  onFilterChange({ ...filters, date: date || undefined })
                }
                initialFocus
                fromDate={new Date()}
              />
            </PopoverContent>
          </Popover>
        </div>
        <div>
          <TimePicker
            field={{
              value: filters.time,
              onChange: (value: any) => handleInputChange("time", value),
            }}
          />
        </div>
        <div>
          <Select
            value={filters.carClass}
            onValueChange={(value) => handleInputChange("carClass", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Car Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any Type</SelectItem>
              <SelectItem value="Hatchback">Hatchback</SelectItem>
              <SelectItem value="Sedan">Sedan</SelectItem>
              <SelectItem value="SUV">SUV</SelectItem>
              <SelectItem value="Auto">Auto</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Input
            placeholder="Car Model (e.g. Swift Dzire)"
            value={filters.carModel}
            onChange={(e) => handleInputChange("carModel", e.target.value)}
          />
        </div>
        <div>
          <Input
            type="number"
            placeholder="Min Seats Available"
            min="1"
            value={filters.minSeats}
            onChange={(e) => handleInputChange("minSeats", e.target.value)}
          />
        </div>
        <div>
          <Input
            type="number"
            placeholder="Max Price (₹)"
            min="0"
            value={filters.maxPrice}
            onChange={(e) => handleInputChange("maxPrice", e.target.value)}
          />
        </div>
        <div>
          <Select
            value={filters.genderPref}
            onValueChange={(value) => handleInputChange("genderPref", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Gender Preference" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any Gender</SelectItem>
              <SelectItem value="male">Male Only</SelectItem>
              <SelectItem value="female">Female Only</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Select
            value={filters.airConditioning}
            onValueChange={(value) =>
              handleInputChange("airConditioning", value)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="AC Preference" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any</SelectItem>
              <SelectItem value="ac">AC Only</SelectItem>
              <SelectItem value="nonac">Non-AC Only</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-between">
        <Button
          variant="ghost"
          onClick={() =>
            onFilterChange({
              source: "",
              destination: "",
              date: undefined,
              time: "",
              carClass: "all",
              carModel: "",
              minSeats: "",
              maxPrice: "",
              genderPref: "any",
              airConditioning: "any",
            })
          }
        >
          Clear All Filters
        </Button>
        <div className="flex items-center gap-4">
          <p className="text-sm text-muted-foreground">
            {resultCount} {resultCount === 1 ? "ride" : "rides"} found
          </p>
          <Button variant="outline" onClick={onRefresh}>
            Refresh
          </Button>
        </div>
      </div>
    </div>
  );
}
