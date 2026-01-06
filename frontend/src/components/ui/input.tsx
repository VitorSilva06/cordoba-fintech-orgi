import * as React from "react";

import { cn } from "./utils";

export interface InputProps extends React.ComponentProps<"input"> {
  error?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, leftIcon, rightIcon, ...props }, ref) => {
    return (
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none">
            {leftIcon}
          </div>
        )}
        <input
          type={type}
          data-slot="input"
          className={cn(
            // Base styles
            "flex h-10 w-full min-w-0 rounded-lg border bg-card px-3 py-2 text-sm text-foreground",
            "placeholder:text-text-muted",
            "transition-all duration-200",
            // Focus styles
            "focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary",
            // Disabled styles
            "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-secondary",
            // Dark mode
            "dark:bg-card dark:border-border dark:text-foreground dark:placeholder:text-text-muted",
            "dark:focus:ring-primary/40 dark:focus:border-primary",
            // File input
            "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
            // Error state
            error && "border-destructive focus:ring-destructive/30 focus:border-destructive",
            // Icons padding
            leftIcon && "pl-10",
            rightIcon && "pr-10",
            className,
          )}
          ref={ref}
          {...props}
        />
        {rightIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted">
            {rightIcon}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
