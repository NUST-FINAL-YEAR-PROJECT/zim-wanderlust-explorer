
import { useState, useEffect } from 'react';
import { Check, ChevronsUpDown, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Destination, getDestinations } from "@/models/Destination";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";

interface DestinationSelectorProps {
  value: Destination | null;
  onChange: (destination: Destination | null) => void;
}

export function DestinationSelector({ value, onChange }: DestinationSelectorProps) {
  const [open, setOpen] = useState(false);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchDestinations = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getDestinations();
        setDestinations(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Error fetching destinations:', err);
        setError('Failed to load destinations');
        setDestinations([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDestinations();
  }, []);

  const filteredDestinations = destinations.filter(destination => 
    destination.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    destination.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (error) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          disabled={isLoading}
        >
          {value ? (
            <div className="flex items-center">
              {value.image_url && (
                <div 
                  className="h-6 w-6 rounded mr-2 bg-cover bg-center"
                  style={{ backgroundImage: `url(${value.image_url})` }}
                />
              )}
              <span>{value.name}</span>
            </div>
          ) : (
            <span className="text-muted-foreground">
              {isLoading ? "Loading destinations..." : "Select destination"}
            </span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput 
            placeholder="Search destinations..." 
            onValueChange={setSearchQuery}
            value={searchQuery}
          />
          <CommandList>
            <CommandEmpty>
              {isLoading ? (
                <div className="p-2">
                  <Skeleton className="h-8 w-full mb-2" />
                  <Skeleton className="h-8 w-full mb-2" />
                  <Skeleton className="h-8 w-full" />
                </div>
              ) : error ? (
                error
              ) : (
                "No destination found."
              )}
            </CommandEmpty>
            <CommandGroup className="max-h-[300px] overflow-y-auto">
              {isLoading ? (
                <>
                  <Skeleton className="h-8 w-full mb-2 mx-2" />
                  <Skeleton className="h-8 w-full mb-2 mx-2" />
                  <Skeleton className="h-8 w-full mx-2" />
                </>
              ) : filteredDestinations.length > 0 ? (
                filteredDestinations.map((destination) => (
                  <CommandItem
                    key={destination.id}
                    value={destination.name}
                    onSelect={() => {
                      onChange(destination.id === value?.id ? null : destination);
                      setOpen(false);
                      setSearchQuery("");
                    }}
                    className="flex items-center"
                  >
                    <div className="flex items-center flex-1">
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          value?.id === destination.id ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {destination.image_url && (
                        <div 
                          className="w-6 h-6 rounded mr-2 bg-cover bg-center"
                          style={{ backgroundImage: `url(${destination.image_url})` }}
                        />
                      )}
                      <div className="flex flex-col">
                        <span>{destination.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {destination.location}
                        </span>
                      </div>
                    </div>
                  </CommandItem>
                ))
              ) : (
                <CommandItem disabled>
                  No destinations available
                </CommandItem>
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
