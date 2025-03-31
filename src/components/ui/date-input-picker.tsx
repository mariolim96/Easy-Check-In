"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/date-input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

interface DateInputPickerProps {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  label?: string;
  placeholder?: string;
  checkIn?: string;
  checkOut?: string;
  error?: string;
  disabled?: boolean;
}

export function DateInputPicker({
  value,
  onChange,
  label,
  placeholder = "Pick a date",
  checkIn,
  checkOut,
  error,
  disabled = false,
}: DateInputPickerProps) {
  return (
    <FormItem>
      {label && <FormLabel>{label}</FormLabel>}
      <FormControl>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start border border-input bg-background text-left font-normal shadow-sm hover:bg-accent hover:text-accent-foreground",
                !value && "text-muted-foreground",
                error && "border-red-500",
                disabled && "cursor-not-allowed opacity-50",
              )}
              disabled={disabled}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {value ? format(value, "PPP") : <span>{placeholder}</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={value}
              onSelect={onChange}
              startMonth={checkIn ? new Date(checkIn) : undefined}
              endMonth={checkOut ? new Date(checkOut) : undefined}
              disabled={(date) => {
                if (!checkIn || !checkOut) return false;
                const checkInDate = new Date(checkIn);
                const checkOutDate = new Date(checkOut);
                const currentDate = date;

                const normalizedCheckIn = new Date(
                  checkInDate.setHours(0, 0, 0, 0),
                );
                const normalizedCheckOut = new Date(
                  checkOutDate.setHours(0, 0, 0, 0),
                );
                const normalizedCurrent = new Date(
                  currentDate.setHours(0, 0, 0, 0),
                );

                return (
                  normalizedCurrent < normalizedCheckIn ||
                  normalizedCurrent > normalizedCheckOut
                );
              }}
            />
          </PopoverContent>
        </Popover>
      </FormControl>
      {error && <FormMessage>{error}</FormMessage>}
    </FormItem>
  );
}
