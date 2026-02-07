"use client";

import { cn } from "@/lib/utils";
import { Calendar as CalendarIcon } from "lucide-react";
import * as React from "react";
import { Button } from "./button";
import { Calendar } from "./calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

export type TDateInputProps = {
  id?: string;
  className?: string;
  value?: string | Date;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  name?: string;
};

// Helper function to parse date from various formats
const parseDate = (value: string | Date | undefined): Date | undefined => {
  if (!value) return undefined;

  if (value instanceof Date) {
    return isNaN(value.getTime()) ? undefined : value;
  }

  if (typeof value === "string") {
    // Handle ISO date format (YYYY-MM-DD)
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      const [year, month, day] = value.split("-").map(Number);
      const date = new Date(year, month - 1, day);
      return isNaN(date.getTime()) ? undefined : date;
    }

    // Handle ISO datetime format (YYYY-MM-DDTHH:mm:ss.sssZ or similar)
    const date = new Date(value);
    return isNaN(date.getTime()) ? undefined : date;
  }

  return undefined;
};

const DateInput = React.forwardRef<HTMLDivElement, TDateInputProps>(
  ({ id, className, value, onChange, onBlur, name }, ref) => {
    const [open, setOpen] = React.useState(false);
    const [date, setDate] = React.useState<Date | undefined>(parseDate(value));

    React.useEffect(() => {
      setDate(parseDate(value));
    }, [value]);

    const handleDateSelect = (selectedDate: Date | undefined) => {
      setDate(selectedDate);
      const formattedDate = selectedDate
        ? selectedDate.toISOString().split("T")[0]
        : "";

      if (onChange) {
        onChange(formattedDate);
      }
      setOpen(false);
    };

    return (
      <div ref={ref} className={className}>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              id={id}
              className={cn(
                "w-full justify-start font-normal bg-transparent!",
                "flex items-center justify-between gap-1"
              )}
              onBlur={onBlur}
            >
              {date ? date.toLocaleDateString() : "Select date"}
              <CalendarIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              defaultMonth={date}
              captionLayout="dropdown"
              className="max-xs:min-w-65 min-w-80"
              onSelect={handleDateSelect}
            />
          </PopoverContent>
        </Popover>
        <input
          type="hidden"
          id={id}
          name={name}
          value={date?.toISOString() || ""}
        />
      </div>
    );
  }
);

DateInput.displayName = "DateInput";

export { DateInput };
