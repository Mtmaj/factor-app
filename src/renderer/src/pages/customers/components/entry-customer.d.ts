import { Customer } from "@/types/factors";
export declare function EntryCustomer({ id, customerDefaultValue, setIsOpen, setHandleSubmit, setCustomerId, checkedChange, }: {
    id?: string;
    customerDefaultValue?: Customer;
    setIsOpen?: (val: boolean) => void;
    setHandleSubmit?: (val: any) => void;
    setCustomerId?: (val: any) => void;
    checkedChange?: boolean;
    handleFactorSubmit?: () => void;
}): import("react/jsx-runtime").JSX.Element;
