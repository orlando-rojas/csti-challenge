import { cva, type VariantProps } from "class-variance-authority";

export const pillClass = cva(
  "inline-flex cursor-pointer items-center justify-center rounded-full border text-sm whitespace-nowrap transition-[color,background-color,border-color,transform] duration-200 ease-out active:scale-[0.98]",
  {
    variants: {
      selected: {
        true: "border-ink bg-ink text-paper",
        false: "border-line bg-surface hover:border-ink",
      },
      size: {
        chip: "px-4 py-2",
        page: "h-10 min-w-10 px-3",
        bar: "h-10 gap-2 px-2.5 sm:px-3",
      },
    },
    defaultVariants: {
      selected: false,
      size: "chip",
    },
  },
);

export type PillVariants = VariantProps<typeof pillClass>;
