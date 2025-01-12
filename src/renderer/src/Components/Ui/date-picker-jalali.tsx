"use client";

import { format } from "date-fns-jalali";
import { Calendar as CalendarIcon } from "lucide-react";

import { Button } from "@/Components/Ui/button";
import { Calendar } from "@/Components/Ui/calendar-jalali";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/Components/Ui/popover";
import { cn } from "@/lib/utils";
import { digitsEnToFa } from "@persian-tools/persian-tools";
import { useState } from "react";
import { PopoverClose } from "@radix-ui/react-popover";

export function DatePickerDemo({
  date,
  setDate,
  className,
  timePicker = true,
}: {
  date?: Date;
  setDate?: (date: Date) => void;
  timePicker?: boolean;
  className?: string;
}) {
  const [dateTemp, setDateTemp] = useState(date ?? new Date(Date.now()));
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          dir="ltr"
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4 mb-1" />
          {date ? (
            digitsEnToFa(
              format(date, `yyyy/MM/dd${timePicker ? " H:mm:ss" : ""}`)
            )
          ) : (
            <span>انتخاب تاریخ</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          timePicker={timePicker}
          mode="single"
          selected={dateTemp!}
          onSelect={setDateTemp!}
          required={true}
          autoFocus
        />
        <div className="w-full flex flex-row items-center gap-x-[5px]">
          <PopoverClose asChild>
            <Button
              className="w-full rounded-t-none"
              onClick={() => {
                setDate?.(dateTemp);
              }}
            >
              ثبت تاریخ
            </Button>
          </PopoverClose>
        </div>
      </PopoverContent>
    </Popover>
  );
}
