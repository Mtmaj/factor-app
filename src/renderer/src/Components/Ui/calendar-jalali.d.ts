/**
 *
 *
 * Docs on formatting: https://date-fns.org/v4.1.0/docs/format
 */
import * as React from "react";
import { DayPicker } from "react-day-picker/jalali";
export type CalendarProps = React.ComponentProps<typeof DayPicker>;
declare function Calendar({ className, classNames, showOutsideDays, selected, timePicker, onSelect, ...props }: CalendarProps & {
    selected: Date;
    timePicker?: boolean;
    onSelect: (date: Date) => void;
}): import("react/jsx-runtime").JSX.Element;
declare namespace Calendar {
    var displayName: string;
}
export { Calendar };
