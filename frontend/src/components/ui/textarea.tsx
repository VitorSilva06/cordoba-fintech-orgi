import * as React from "react";

import { cn } from "./utils";

export interface TextareaProps extends React.ComponentProps<"textarea"> {
  error?: boolean;
}

function Textarea({ className, error, ...props }: TextareaProps) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        // Base styles
        "flex min-h-24 w-full rounded-lg border px-3 py-2.5 text-sm",
        // Colors
        "bg-card dark:bg-card/50 text-foreground border-border",
        // Placeholder
        "placeholder:text-text-muted",
        // Focus
        "focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary",
        // Disabled
        "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-secondary",
        // Resize
        "resize-none",
        // Transition
        "transition-all duration-200",
        // Error state
        error && "border-destructive focus:ring-destructive/30 focus:border-destructive",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
