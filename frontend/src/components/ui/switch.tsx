"use client";

import * as React from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "./utils";

const switchVariants = cva(
  "peer inline-flex shrink-0 items-center rounded-full border-2 border-transparent transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      size: {
        sm: "h-5 w-9",
        default: "h-6 w-11",
        lg: "h-7 w-14",
      },
      variant: {
        default: "data-[state=checked]:bg-primary data-[state=unchecked]:bg-secondary dark:data-[state=unchecked]:bg-muted",
        success: "data-[state=checked]:bg-success data-[state=unchecked]:bg-secondary",
        warning: "data-[state=checked]:bg-warning data-[state=unchecked]:bg-secondary",
        destructive: "data-[state=checked]:bg-destructive data-[state=unchecked]:bg-secondary",
      },
    },
    defaultVariants: {
      size: "default",
      variant: "default",
    },
  }
);

const thumbVariants = cva(
  "pointer-events-none block rounded-full bg-white shadow-lg ring-0 transition-transform duration-200",
  {
    variants: {
      size: {
        sm: "h-4 w-4 data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0",
        default: "h-5 w-5 data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0",
        lg: "h-6 w-6 data-[state=checked]:translate-x-7 data-[state=unchecked]:translate-x-0",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

interface SwitchProps
  extends React.ComponentProps<typeof SwitchPrimitive.Root>,
    VariantProps<typeof switchVariants> {}

function Switch({
  className,
  size,
  variant,
  ...props
}: SwitchProps) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(switchVariants({ size, variant }), className)}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(thumbVariants({ size }))}
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch, switchVariants };
