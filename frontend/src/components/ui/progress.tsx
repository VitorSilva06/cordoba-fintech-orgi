"use client";

import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "./utils";

const progressVariants = cva(
  "relative h-2 w-full overflow-hidden rounded-full transition-all",
  {
    variants: {
      variant: {
        default: "bg-secondary dark:bg-muted",
        primary: "bg-primary/20",
        success: "bg-success/20",
        warning: "bg-warning/20",
        destructive: "bg-destructive/20",
      },
      size: {
        sm: "h-1",
        default: "h-2",
        lg: "h-3",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const indicatorVariants = cva(
  "h-full w-full flex-1 transition-all duration-500 ease-out",
  {
    variants: {
      variant: {
        default: "bg-primary",
        primary: "bg-primary",
        success: "bg-success",
        warning: "bg-warning",
        destructive: "bg-destructive",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface ProgressProps
  extends React.ComponentProps<typeof ProgressPrimitive.Root>,
    VariantProps<typeof progressVariants> {
  showValue?: boolean;
}

function Progress({
  className,
  value,
  variant,
  size,
  showValue = false,
  ...props
}: ProgressProps) {
  return (
    <div className="flex items-center gap-3 w-full">
      <ProgressPrimitive.Root
        data-slot="progress"
        className={cn(progressVariants({ variant, size }), className)}
        {...props}
      >
        <ProgressPrimitive.Indicator
          data-slot="progress-indicator"
          className={cn(indicatorVariants({ variant }))}
          style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
        />
      </ProgressPrimitive.Root>
      {showValue && (
        <span className="text-sm font-medium text-foreground min-w-[3ch] text-right">
          {Math.round(value || 0)}%
        </span>
      )}
    </div>
  );
}

export { Progress, progressVariants };
