import { Customer } from "@/types/factors";
import { atomWithStorage } from "jotai/utils";

export const customerAtom = atomWithStorage<Customer[]>("customers", []);
