"use client";

import * as React from "react";
import { cn } from "cn";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerProps extends React.HTMLAttributes<HTMLInputElement> {
  classNames?: {
    trigger?: string;
    content?: string;
  };
  date?: Date;
  placeholder?: string;
  disabled?: boolean;
  onDateChange?: (date?: Date) => void;
}

export function DatePicker({
  classNames,
  date,
  onDateChange,
  placeholder,
  disabled,
  ...props
}: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          data-empty={!date}
          disabled={disabled}
          className={cn(
            "justify-start text-left font-normal data-[empty=true]:text-muted-foreground",
            classNames?.trigger,
          )}
        >
          <CalendarIcon />
          {date ? (
            format(date, "PPP")
          ) : (
            <span>{placeholder || "Pick a date"}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className={cn("w-auto p-0", classNames?.content)}>
        <Calendar mode="single" selected={date} onSelect={onDateChange} />
      </PopoverContent>
    </Popover>
  );
}
