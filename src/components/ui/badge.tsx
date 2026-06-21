import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default:
          "bg-primary-100 text-primary-700 border border-primary-200",
        secondary:
          "bg-[#f0ece6] text-[#6b6560] border border-[#e5ded7]",
        destructive:
          "bg-[#f5e6e4] text-[#c4817a] border border-[#e8cdc9]",
        success:
          "bg-[#e8f0e6] text-[#7a9c76] border border-[#d1e0ce]",
        outline:
          "text-[#6b6560] border border-[#e5ded7]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
