"use client";

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
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronDown } from "lucide-react";
import { useId, useState } from "react";
import { FixedSizeList as List } from "react-window";
import type { ListChildComponentProps } from "react-window";

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectSearchProps {
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  label?: string;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  className?: string;
  disabled?: boolean;
}

export function SelectSearch({
  options,
  value: controlledValue,
  onChange,
  label,
  placeholder = "Select an option",
  searchPlaceholder = "Search...",
  emptyMessage = "No options found.",
  className,
  disabled = false,
}: SelectSearchProps) {
  const id = useId();
  const [open, setOpen] = useState<boolean>(false);
  const [internalValue, setInternalValue] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");

  const value = controlledValue ?? internalValue;
  const handleValueChange = onChange ?? setInternalValue;

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const Row = ({ index, style }: ListChildComponentProps) => {
    const option = filteredOptions[index];
    return (
      <CommandItem
        key={option.value}
        value={option.value}
        onSelect={(currentValue) => {
          handleValueChange(currentValue === value ? "" : currentValue);
          setOpen(false);
          setSearchQuery("");
        }}
        className="cursor-pointer"
        style={style}
      >
        {option.label}
        {value === option.value && (
          <Check size={16} strokeWidth={2} className="ml-auto" />
        )}
      </CommandItem>
    );
  };

  return (
    <div className={cn("space-y-2", className)}>
      {label && <Label htmlFor={id}>{label}</Label>}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id={id}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            disabled={disabled}
            className="w-full justify-between bg-background px-3 font-normal outline-offset-0 hover:bg-background focus-visible:border-ring focus-visible:outline-[3px] focus-visible:outline-ring/20"
          >
            <span className={cn("truncate", !value && "text-muted-foreground")}>
              {value
                ? options.find((option) => option.value === value)?.label
                : placeholder}
            </span>
            <ChevronDown
              size={16}
              strokeWidth={2}
              className="shrink-0 text-muted-foreground/80"
              aria-hidden="true"
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-full min-w-[var(--radix-popper-anchor-width)] border-input p-0"
          align="start"
        >
          <Command shouldFilter={false}>
            <CommandInput
              placeholder={searchPlaceholder}
              value={searchQuery}
              onValueChange={setSearchQuery}
            />
            <CommandList className="overflow-hidden p-0">
              {filteredOptions.length === 0 ? (
                <CommandEmpty>{emptyMessage}</CommandEmpty>
              ) : (
                <CommandGroup className="overflow-hidden p-0">
                  <List
                    height={Math.min(300, filteredOptions.length * 35)}
                    itemCount={filteredOptions.length}
                    itemSize={35}
                    width="100%"
                    className="scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
                  >
                    {Row}
                  </List>
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
