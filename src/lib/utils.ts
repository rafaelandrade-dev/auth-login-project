import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Require `npm install clsx tailwind-merge` if using cn. Adding it temporarily for Tailwind components using Radix and generic UI classnames.
// Actually, twMerge and clsx were not specified in the user prompt, but the user requested `utils.ts (cn for classnames)`, which implies `clsx` and `tailwind-merge`. I will install these two packages in a later step.
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}
