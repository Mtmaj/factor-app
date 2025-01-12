/**
 *
 *
 * Docs on formatting: https://date-fns.org/v4.1.0/docs/format
 */

import { faIR } from "date-fns/locale";
import * as React from "react";
import { DayPicker } from "react-day-picker/jalali";

import { buttonVariants } from "@/Components/Ui/button";
import { cn } from "@/lib/utils";

import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import { format } from "date-fns-jalali";
import { SimpleTimePicker } from "./simple-time-picker";
import { digitsEnToFa } from "@persian-tools/persian-tools";
export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  selected,
  timePicker = true,
  onSelect,
  ...props
}: CalendarProps & {
  selected: Date;
  timePicker?: boolean;
  onSelect: (date: Date) => void;
}) {
  const [datePick, setDatePick] = React.useState<Date>(
    new Date(selected.getFullYear(), selected.getMonth(), selected.getDate())
  );
  const [timePick, setTimePick] = React.useState<Date>(
    new Date(selected.getTime())
  );
  console.log("🚀 ~ Calendar ~ datePick:", datePick);
  console.log("🚀 ~ Calendar ~ timePick:", timePick);
  React.useEffect(() => {
    console.log(
      new Date(
        datePick.getFullYear(),
        datePick.getMonth(),
        datePick.getDate(),
        timePick.getHours(),
        timePick.getMinutes(),
        timePick.getSeconds()
      )
    );
    onSelect(
      new Date(
        datePick.getFullYear(),
        datePick.getMonth(),
        datePick.getDate(),
        timePick.getHours(),
        timePick.getMinutes(),
        timePick.getSeconds()
      )
    );
  }, [datePick, timePick]);
  return (
    <div className="flex flex-col items-center mb-[10px]">
      <DayPicker
        showOutsideDays={showOutsideDays}
        className={cn("p-3", className)}
        classNames={{
          months:
            "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
          month: "space-y-4",
          month_caption: "flex justify-center pt-1 relative items-center",
          caption_label: "text-sm font-medium",
          nav: "space-x-1 flex items-center",
          button_previous: cn(
            buttonVariants({ variant: "outline" }),
            "absolute left-1",
            "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
          ),
          button_next: cn(
            buttonVariants({ variant: "outline" }),
            "absolute right-1",
            "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
          ),
          month_grid: "w-full border-collapse space-y-1",
          weekdays: "flex",
          weekday:
            "text-muted-foreground rounded-md w-8 font-normal text-[0.8rem]",
          week: "flex w-full mt-2",
          day_button: cn(
            "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected].day-range-end)]:rounded-r-md",
            props.mode === "range"
              ? "[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md"
              : "[&:has([aria-selected])]:rounded-md"
          ),
          day: cn(
            buttonVariants({ variant: "ghost" }),
            "h-8 w-8 p-0 font-normal aria-selected:opacity-100"
          ),
          range_start: "day-range-start",
          range_middle:
            "aria-selected:bg-accent aria-selected:text-accent-foreground",
          range_end: "day-range-end",
          selected:
            "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
          today: "bg-accent text-accent-foreground",
          outside:
            "day-outside text-muted-foreground aria-selected:bg-accent/50 aria-selected:text-muted-foreground",
          disabled: "text-muted-foreground opacity-50",
          hidden: "invisible",
          ...classNames,
        }}
        components={{
          Weekday({ children, ...props }) {
            console.log("🚀 ~ WeekNumber ~ children:", children);
            return <th {...props}>{digitsEnToFa(children as string)}</th>;
          },
          DayButton({ day, modifiers, children, ...props }) {
            return (
              <button {...props}>{digitsEnToFa(children as string)}</button>
            );
          },
          CaptionLabel({ children, ...props }) {
            return <span {...props}>{digitsEnToFa(children as string)}</span>;
          },
          Chevron: ({ orientation }) => {
            const Icon =
              orientation === "left" ? ChevronLeftIcon : ChevronRightIcon;
            return <Icon className="h-4 w-4" />;
          },
        }}
        formatters={{
          formatWeekdayName(weekday, options) {
            return format(weekday, "EEEEE", options);
          },
          formatCaption(month, options) {
            console.log("🚀 ~ formatCaption ~ options:", options);
            return format(month, "MMMM yyyy");
          },
        }}
        locale={faIR}
        {...props}
        mode="single"
        selected={datePick}
        onSelect={setDatePick}
        required
        dir="rtl"
      />
      {timePicker && (
        <div dir="ltr">
          <SimpleTimePicker value={timePick} onChange={setTimePick} />
        </div>
      )}
    </div>
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
