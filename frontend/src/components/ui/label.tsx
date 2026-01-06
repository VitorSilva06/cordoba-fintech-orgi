"use client";

import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "./utils";

const labelVariants = cva(
  [
    "flex items-center gap-2 text-sm leading-none font-medium select-none",
    "transition-colors duration-200",
    "group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50",
    "peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
  ],
  {
    variants: {
      variant: {
        default: "text-gray-700 dark:text-gray-200",
        muted: "text-gray-500 dark:text-gray-400",
        error: "text-red-600 dark:text-red-400",
      },
      size: {
        sm: "text-xs",
        default: "text-sm",
        lg: "text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

interface LabelProps 
  extends React.ComponentProps<typeof LabelPrimitive.Root>,
    VariantProps<typeof labelVariants> {
  required?: boolean;
  optional?: boolean;
}

function Label({
  className,
  variant,
  size,
  required,
  optional,
  children,
  ...props
}: LabelProps) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(labelVariants({ variant, size }), className)}
      {...props}
    >
      {children}
      {required && (
        <span className="text-red-500 dark:text-red-400" aria-hidden="true">*</span>
      )}
      {optional && (
        <span className="text-gray-400 dark:text-gray-500 text-xs font-normal">(opcional)</span>
      )}
    </LabelPrimitive.Root>
  );
}

export { Label, labelVariants };
