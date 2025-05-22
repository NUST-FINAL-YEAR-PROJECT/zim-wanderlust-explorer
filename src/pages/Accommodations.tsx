
import React from "react";
import { useQuery } from "@tanstack/react-query";
import DashboardLayout from "@/components/DashboardLayout";
import { getAccommodations } from "@/models/Accommodation";
import AccommodationCard from "@/components/AccommodationCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Hotel, SlidersHorizontal } from "lucide-react";

const AccommodationsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [sortBy, setSortBy] = React.useState("rating");

  const { data: accommodations = [], isLoading, isError } = useQuery({
    queryKey: ["accommodations"],
    queryFn: getAccommodations,
  });

  const filteredAccommodations = React.useMemo(() => {
    return accommodations.filter(
      (acc) =>
        acc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        acc.location.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [accommodations, searchQuery]);

  const sortedAccommodations = React.useMemo(() => {
    return [...filteredAccommodations].sort((a, b) => {
      switch (sortBy) {
        case "price-asc":
          return a.price_per_night - b.price_per_night;
        case "price-desc":
          return b.price_per_night - a.price_per_night;
        case "rating":
        default:
          return (b.rating || 0) - (a.rating || 0);
      }
    });
  }, [filteredAccommodations, sortBy]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold text-blue-900 dark:text-white">
              Accommodations
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Find the perfect place to stay in Zimbabwe
            </p>
          </div>
        </header>

        <div className="flex flex-wrap items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 dark:text-gray-400" />
            <Input
              placeholder="Search by name or location..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="w-full sm:w-auto">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="h-4 w-4" />
                  <SelectValue placeholder="Sort by" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rating">Top Rated</SelectItem>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Separator />

        {isLoading && (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        )}

        {isError && (
          <div className="flex flex-col items-center justify-center rounded-lg border border-red-200 bg-red-50 p-8 text-center dark:border-red-900 dark:bg-red-950/50">
            <Hotel className="h-12 w-12 text-red-400" />
            <h3 className="mt-2 text-lg font-semibold text-red-700 dark:text-red-400">
              Failed to load accommodations
            </h3>
            <p className="mt-1 text-red-600 dark:text-red-300">
              Please try again later or contact support if the problem persists.
            </p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => window.location.reload()}
            >
              Try Again
            </Button>
          </div>
        )}

        {!isLoading && !isError && sortedAccommodations.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-lg border border-gray-200 bg-gray-50 p-8 text-center dark:border-gray-800 dark:bg-gray-900">
            <Hotel className="h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-semibold text-gray-700 dark:text-gray-300">
              No accommodations found
            </h3>
            <p className="mt-1 text-gray-500">
              Try adjusting your search or filters to find something.
            </p>
          </div>
        )}

        {!isLoading && !isError && sortedAccommodations.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {sortedAccommodations.map((accommodation) => (
              <AccommodationCard
                key={accommodation.id}
                accommodation={accommodation}
                featured={accommodation.is_featured}
              />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AccommodationsPage;
