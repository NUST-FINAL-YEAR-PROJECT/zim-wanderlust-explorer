
import { useState, useEffect } from 'react';
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Destination, getDestinations } from "@/models/Destination";

interface DestinationSelectorProps {
  value: Destination | null;
  onChange: (destination: Destination | null) => void;
}

export function DestinationSelector({ value, onChange }: DestinationSelectorProps) {
  const [open, setOpen] = useState(false);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDestinations = async () => {
      setIsLoading(true);
      try {
        const data = await getDestinations();
        setDestinations(data);
      } catch (error) {
        console.error('Error fetching destinations:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDestinations();
  }, []);

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
          {value ? value.name : isLoading ? "Loading destinations..." : "Select destination"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Search destinations..." />
          <CommandEmpty>No destination found.</CommandEmpty>
          <CommandGroup className="max-h-[300px] overflow-y-auto">
            {destinations.map((destination) => (
              <CommandItem
                key={destination.id}
                value={destination.name}
                onSelect={() => {
                  onChange(destination.id === value?.id ? null : destination);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value?.id === destination.id ? "opacity-100" : "opacity-0"
                  )}
                />
                {destination.name}
                <span className="ml-2 text-xs text-muted-foreground">
                  {destination.location}
                </span>
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
