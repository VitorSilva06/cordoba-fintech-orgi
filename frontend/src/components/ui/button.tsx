import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "./utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
  {
    variants: {
      variant: {
        default: 
          "bg-primary text-white shadow-sm hover:bg-primary-hover hover:shadow-md active:scale-[0.98]",
        destructive:
          "bg-destructive text-white shadow-sm hover:bg-destructive/90 focus-visible:ring-destructive/50 active:scale-[0.98]",
        outline:
          "border border-border bg-card text-foreground hover:bg-secondary hover:border-primary/30 dark:bg-card dark:border-border dark:hover:bg-secondary",
        secondary:
          "bg-secondary text-foreground hover:bg-secondary/80 dark:bg-secondary dark:text-foreground",
        ghost:
          "text-foreground hover:bg-secondary dark:hover:bg-secondary/50",
        link: 
          "text-primary underline-offset-4 hover:underline",
        success:
          "bg-success text-white shadow-sm hover:bg-success/90 active:scale-[0.98]",
        warning:
          "bg-warning text-black shadow-sm hover:bg-warning/90 active:scale-[0.98]",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 rounded-md gap-1.5 px-3 text-xs",
        lg: "h-11 rounded-lg px-6 text-base",
        xl: "h-12 rounded-lg px-8 text-base",
        icon: "size-10 rounded-lg",
        "icon-sm": "size-8 rounded-md",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

const Button = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button"> &
    VariantProps<typeof buttonVariants> & {
      asChild?: boolean;
      loading?: boolean;
    }
>(({ className, variant, size, asChild = false, loading, children, disabled, ...props }, ref) => {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Carregando...</span>
        </>
      ) : children}
    </Comp>
  );
});

Button.displayName = "Button";

export { Button, buttonVariants };
