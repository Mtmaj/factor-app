import { Customer } from "@/types/factors";
export declare function useCustomers({ filters, }: {
    filters: {
        field: string;
        value: string;
    }[];
}): Customer[];
export declare function useCustomer(id: string): Customer;
export declare function useCreateCustomer(): {
    mutate: ({ value }: {
        value: any;
    }) => {
        value: any;
    };
};
export declare function useUpdateCustomer(): {
    mutate: ({ value, id }: {
        value: any;
        id: string;
    }) => {
        value: any;
    };
};
export declare function useDeleteCustomer({ value, id, }: {
    value: Customer;
    id: string;
}): {
    id: string;
    value: Customer;
};
