"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback, useMemo } from "react";
import { fetchRides } from "../../../actions/fetch-rides";
import RideCard from "./components/ride-card";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal } from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { RideFilters } from "./components/ride-filters";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";

type RideData = {
  id: string;
  fullname: string;
  email: string;
  ride_cost: number;
  source: string;
  destination: string;
  time: string;
  date: string;
  seats_left: number;
  desc_text: string;
  car_class: string;
  car_model: string;
  air_conditioning: boolean;
  gender_pref: string;
};

const RIDES_PER_PAGE = 3; // Adjust this number as needed

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [rides, setRides] = useState<RideData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(true);
  const [activeFilters, setActiveFilters] = useState({
    source: "",
    destination: "",
    date: undefined as Date | undefined,
    time: "",
    carClass: "all",
    carModel: "",
    minSeats: "",
    maxPrice: "",
    genderPref: "any",
    airConditioning: "any",
  });
  const [currentPage, setCurrentPage] = useState(1);

  // Filter rides
  const filteredRides = useMemo(() => {
    return rides.filter((ride) => {
      const rideDate = new Date(ride.date).toISOString().split("T")[0];
      const filterDate = activeFilters.date
        ? activeFilters.date.toISOString().split("T")[0]
        : null;

      return (
        (!activeFilters.source ||
          ride.source
            .toLowerCase()
            .includes(activeFilters.source.toLowerCase())) &&
        (!activeFilters.destination ||
          ride.destination
            .toLowerCase()
            .includes(activeFilters.destination.toLowerCase())) &&
        (!activeFilters.date || rideDate === filterDate) &&
        (!activeFilters.time || ride.time.includes(activeFilters.time)) &&
        (activeFilters.carClass === "all" ||
          ride.car_class === activeFilters.carClass) &&
        (!activeFilters.carModel ||
          ride.car_model
            .toLowerCase()
            .includes(activeFilters.carModel.toLowerCase())) &&
        (!activeFilters.minSeats ||
          ride.seats_left >= Number(activeFilters.minSeats)) &&
        (!activeFilters.maxPrice ||
          ride.ride_cost <= Number(activeFilters.maxPrice)) &&
        (activeFilters.genderPref === "any" ||
          ride.gender_pref === activeFilters.genderPref) &&
        (activeFilters.airConditioning === "any" ||
          (activeFilters.airConditioning === "ac" && ride.air_conditioning) ||
          (activeFilters.airConditioning === "nonac" && !ride.air_conditioning))
      );
    });
  }, [rides, activeFilters]);

  // Calculate total pages
  const totalPages = useMemo(() => {
    return Math.ceil(filteredRides.length / RIDES_PER_PAGE);
  }, [filteredRides]);

  // Get current rides for pagination
  const paginatedRides = useMemo(() => {
    const startIndex = (currentPage - 1) * RIDES_PER_PAGE;
    return filteredRides.slice(startIndex, startIndex + RIDES_PER_PAGE);
  }, [filteredRides, currentPage]);

  // Fetch rides data
  const loadRides = useCallback(async () => {
    try {
      setLoading(true);
      const ridesData = await fetchRides();
      setRides(ridesData);
      setCurrentPage(1); // Reset to first page when new data loads
    } catch (error) {
      toast.error("Failed to load rides");
      console.error("Error fetching rides:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Check authentication and load data
  useEffect(() => {
    if (status === "loading") return;
    if (!session || !session.user?.email?.endsWith("@vitstudent.ac.in")) {
      router.push("/");
      return;
    }
    loadRides();
  }, [session, status, router, loadRides]);

  // Generate pagination items
  const renderPaginationItems = () => {
    const items = [];
    const maxVisiblePages = 5; // Maximum number of page buttons to show

    // Always show first page
    items.push(
      <PaginationItem key={1}>
        <Button
          variant={currentPage === 1 ? "default" : "ghost"}
          onClick={() => setCurrentPage(1)}
        >
          1
        </Button>
      </PaginationItem>
    );

    // Show ellipsis if current page is far from start
    if (currentPage > maxVisiblePages - 2) {
      items.push(
        <PaginationItem key="start-ellipsis">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    // Show middle pages
    const startPage = Math.max(
      2,
      Math.min(currentPage - 1, totalPages - maxVisiblePages + 3)
    );
    const endPage = Math.min(
      totalPages - 1,
      Math.max(currentPage + 1, maxVisiblePages - 2)
    );

    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <PaginationItem key={i}>
          <Button
            variant={currentPage === i ? "default" : "ghost"}
            onClick={() => setCurrentPage(i)}
          >
            {i}
          </Button>
        </PaginationItem>
      );
    }

    // Show ellipsis if current page is far from end
    if (currentPage < totalPages - maxVisiblePages + 3) {
      items.push(
        <PaginationItem key="end-ellipsis">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    // Always show last page if there's more than one page
    if (totalPages > 1) {
      items.push(
        <PaginationItem key={totalPages}>
          <Button
            variant={currentPage === totalPages ? "default" : "ghost"}
            onClick={() => setCurrentPage(totalPages)}
          >
            {totalPages}
          </Button>
        </PaginationItem>
      );
    }

    return items;
  };

  // Loading Skeletons
  if (status === "loading" || loading) {
    return (
      <div className="w-full flex justify-center items-center min-h-screen">
        <div className="flex flex-col gap-10 my-10 w-[90%] md:w-[45%]">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="border rounded-xl p-8 space-y-6">
              <div className="flex items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-4 w-48" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-5 w-24" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-5 w-24" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-5 w-32" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-5 w-16" />
                </div>
              </div>
              <Skeleton className="h-16 w-full" />
              <div className="flex justify-between">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-10 w-32" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex justify-center items-start min-h-screen">
      <div className="flex flex-col gap-6 my-10 w-[90%] md:w-[45%]">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Find a Ride</h1>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <SlidersHorizontal className="h-4 w-4" />
            {showFilters ? "Hide Filters" : "Show Filters"}
          </Button>
        </div>

        {/* Ride Filters Component */}
        {showFilters && (
          <RideFilters
            filters={activeFilters}
            onFilterChange={setActiveFilters}
            onRefresh={loadRides}
            resultCount={filteredRides.length}
          />
        )}

        {/* Rides List */}
        <div className="space-y-6">
          {paginatedRides.length > 0 ? (
            <>
              {paginatedRides.map((ride) => (
                <RideCard
                  key={ride.id}
                  fullname={ride.fullname}
                  email={ride.email}
                  ride_cost={ride.ride_cost}
                  source={ride.source}
                  destination={ride.destination}
                  time={ride.time}
                  date={new Date(ride.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                  seats_left={ride.seats_left}
                  desc_text={ride.desc_text}
                  car_class={ride.car_class}
                  car_model={ride.car_model}
                  air_conditioning={ride.air_conditioning}
                  gender_pref={ride.gender_pref}
                />
              ))}

              {/* Pagination */}
              {totalPages > 1 && (
                <Pagination className="mt-6">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (currentPage > 1) setCurrentPage(currentPage - 1);
                        }}
                        className={
                          currentPage === 1
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }
                      />
                    </PaginationItem>

                    {renderPaginationItems()}

                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (currentPage < totalPages)
                            setCurrentPage(currentPage + 1);
                        }}
                        className={
                          currentPage === totalPages
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
            </>
          ) : (
            <div className="text-center py-12 border rounded-xl">
              <p className="text-lg text-muted-foreground">
                {rides.length === 0
                  ? "No rides available yet. Be the first to post one!"
                  : "No rides match your filters"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
