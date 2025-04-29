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
import { CalendarProps } from "../ui/date-input";

interface DatePickerProps {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  calendarProps?: Omit<CalendarProps, "mode" | "selected" | "onSelect">;
}

export function DatePicker({
  value,
  onChange,
  calendarProps,
}: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start border border-input bg-background text-left font-normal shadow-sm hover:bg-accent hover:text-accent-foreground",
            !value && "text-muted-foreground",
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? format(value, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={value}
          onSelect={onChange}
          defaultMonth={value}
          {...calendarProps}
        />
      </PopoverContent>
    </Popover>
  );
}
