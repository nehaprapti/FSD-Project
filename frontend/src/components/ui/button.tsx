import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-y-primary text-y-dark font-bold rounded-btn hover:bg-y-hover",
        destructive: "bg-red-danger text-white font-bold rounded-btn hover:bg-red-dark",
        outline: "border border-y-primary bg-transparent text-y-primary font-bold rounded-btn hover:bg-y-surface",
        secondary: "bg-secondary text-secondary-foreground rounded-btn hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground rounded-btn",
        link: "text-y-primary underline-offset-4 hover:underline",
        "outline-gray": "border border-rx-gray-100 bg-white text-rx-black rounded-btn hover:bg-rx-gray-100",
        "outline-red": "border border-red-danger bg-white text-red-danger rounded-btn hover:bg-red-danger/5",
        "dark": "bg-carbon-border text-white font-bold rounded-btn hover:bg-rx-gray-700",
        "green": "bg-green-success text-y-dark font-bold rounded-btn hover:bg-green-dark hover:text-white",
      },
      size: {
        default: "h-[54px] px-7 py-3.5",
        sm: "h-9 px-3",
        lg: "h-14 px-8 text-base",
        icon: "h-10 w-10",
        pill: "h-8 px-4 text-xs",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
