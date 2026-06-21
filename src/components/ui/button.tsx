import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-primary-600 text-white shadow-lg shadow-primary-200/30 hover:bg-primary-700 hover:shadow-xl hover:shadow-primary-200/30 active:scale-[0.98]",
        destructive:
          "bg-[#c4817a] text-white shadow-lg shadow-[#c4817a]/20 hover:bg-[#b06d67]",
        outline:
          "border-2 border-[#e5ded7] bg-[#faf7f3] text-[#6b6560] hover:bg-[#f5f0eb] hover:border-[#c8d0da]",
        secondary:
          "bg-[#e2e6ec] text-[#3d3833] hover:bg-[#c8d0da]",
        ghost:
          "text-[#6b6560] hover:bg-[#f0ece6] hover:text-[#3d3833]",
        link:
          "text-primary-600 underline-offset-4 hover:underline",
        gradient:
          "bg-gradient-to-r from-primary-600 to-accent-500 text-white shadow-lg shadow-primary-200/30 hover:shadow-xl hover:shadow-primary-200/30 active:scale-[0.98]",
      },
      size: {
        default: "h-11 px-5 py-2",
        sm: "h-9 rounded-lg px-3 text-xs",
        lg: "h-12 rounded-xl px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
