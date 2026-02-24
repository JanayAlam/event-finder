"use client";

import { CalendarIcon } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";
import { Button } from "./button";
import { Calendar } from "./calendar";
import { Input } from "./input";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

type TDateTimePickerProps = {
  id?: string;
  value?: Date;
  onChange?: (value?: Date) => void;
  onBlur?: () => void;
  className?: string;
  placeholder?: string;
};

const pad = (value: number): string => value.toString().padStart(2, "0");

const parseTime = (value: string): { hours: number; minutes: number } => {
  const [hours, minutes] = value.split(":").map(Number);
  return {
    hours: Number.isFinite(hours) ? hours : 0,
    minutes: Number.isFinite(minutes) ? minutes : 0
  };
};

const formatTime = (value?: Date): string => {
  if (!value) return "00:00";
  return `${pad(value.getHours())}:${pad(value.getMinutes())}`;
};

const mergeDateAndTime = (baseDate: Date, timeValue: string): Date => {
  const { hours, minutes } = parseTime(timeValue);
  const next = new Date(baseDate);
  next.setHours(hours, minutes, 0, 0);
  return next;
};

const DateTimePicker: React.FC<TDateTimePickerProps> = ({
  id,
  value,
  onChange,
  onBlur,
  className,
  placeholder = "Select date and time"
}) => {
  const [open, setOpen] = React.useState(false);
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(
    value
  );

  React.useEffect(() => {
    setSelectedDate(value);
  }, [value]);

  const handleDaySelect = (day: Date | undefined) => {
    if (!day) {
      setSelectedDate(undefined);
      onChange?.(undefined);
      return;
    }

    const previousTime = formatTime(selectedDate);
    const nextDate = mergeDateAndTime(day, previousTime);
    setSelectedDate(nextDate);
    onChange?.(nextDate);
  };

  const handleTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const base = selectedDate ?? new Date();
    const nextDate = mergeDateAndTime(base, event.target.value);
    setSelectedDate(nextDate);
    onChange?.(nextDate);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          type="button"
          variant="outline"
          onBlur={onBlur}
          className={cn(
            "w-full justify-between font-normal bg-transparent",
            !selectedDate && "text-muted-foreground",
            className
          )}
        >
          {selectedDate ? selectedDate.toLocaleString() : placeholder}
          <CalendarIcon className="h-4 w-4 opacity-70" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-3" align="start">
        <div className="flex flex-col gap-3">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDaySelect}
            defaultMonth={selectedDate}
            captionLayout="dropdown"
            className="max-xs:min-w-65 min-w-80 bg-transparent"
          />
          <Input
            type="time"
            value={formatTime(selectedDate)}
            onChange={handleTimeChange}
            onBlur={onBlur}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
};

export { DateTimePicker };
