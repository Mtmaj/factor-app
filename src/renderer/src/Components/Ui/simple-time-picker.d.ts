export declare function SimpleTimePicker({ value, onChange, use12HourFormat, showSeconds, min, max, disabled, }: {
    use12HourFormat?: boolean;
    value: Date;
    onChange: (date: Date) => void;
    min?: Date;
    max?: Date;
    showSeconds?: boolean;
    disabled?: boolean;
    className?: string;
}): import("react/jsx-runtime").JSX.Element;
