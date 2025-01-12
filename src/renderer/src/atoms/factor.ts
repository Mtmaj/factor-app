import { Factor } from "@/types/factors";
import { atomWithStorage } from "jotai/utils";

export const factorAtom = atomWithStorage<Factor[]>("factors", []);
