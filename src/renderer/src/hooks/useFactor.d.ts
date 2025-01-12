import { FilterType } from "@/types/main";
export declare function useFactors({ filters }: {
    filters: FilterType[];
}): import("../types/factors").Factor[];
export declare function useFactor(id: string): import("../types/factors").Factor;
export declare function useCreateFactor(): {
    mutate: ({ value }: {
        value: any;
    }) => {
        value: any;
    };
};
export declare function useUpdateFactor(): {
    mutate: ({ value, id }: {
        value: any;
        id: string;
    }) => {
        value: any;
    };
};
export declare function useDeleteFactor(): {
    mutate: ({ id }: {
        id: string;
    }) => void;
};
