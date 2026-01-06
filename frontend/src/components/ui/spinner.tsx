import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "./utils";

const spinnerVariants = cva(
  "inline-block animate-spin rounded-full border-2 border-current border-t-transparent",
  {
    variants: {
      size: {
        xs: "w-3 h-3",
        sm: "w-4 h-4",
        default: "w-6 h-6",
        lg: "w-8 h-8",
        xl: "w-12 h-12",
      },
      variant: {
        default: "text-primary",
        secondary: "text-text-muted",
        white: "text-white",
        success: "text-success",
        warning: "text-warning",
        destructive: "text-destructive",
      },
    },
    defaultVariants: {
      size: "default",
      variant: "default",
    },
  }
);

export interface SpinnerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof spinnerVariants> {
  label?: string;
}

function Spinner({ className, size, variant, label, ...props }: SpinnerProps) {
  return (
    <div
      role="status"
      aria-label={label || "Loading"}
      className={cn(spinnerVariants({ size, variant }), className)}
      {...props}
    >
      <span className="sr-only">{label || "Loading..."}</span>
    </div>
  );
}

// Full page loading overlay
interface LoadingOverlayProps {
  message?: string;
  visible?: boolean;
}

function LoadingOverlay({ message = "Carregando...", visible = true }: LoadingOverlayProps) {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">
        <Spinner size="xl" />
        <p className="text-foreground font-medium animate-pulse">{message}</p>
      </div>
    </div>
  );
}

// Inline loading with optional text
interface LoadingInlineProps {
  text?: string;
  size?: VariantProps<typeof spinnerVariants>["size"];
}

function LoadingInline({ text, size = "sm" }: LoadingInlineProps) {
  return (
    <div className="flex items-center gap-2">
      <Spinner size={size} />
      {text && <span className="text-text-secondary text-sm">{text}</span>}
    </div>
  );
}

// Loading dots animation
function LoadingDots({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-1", className)}>
      <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0ms" }} />
      <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "150ms" }} />
      <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "300ms" }} />
    </div>
  );
}

// Skeleton pulse loading
function LoadingPulse({ className }: { className?: string }) {
  return (
    <div className={cn("animate-pulse-soft", className)}>
      <div className="h-4 bg-secondary rounded w-3/4 mb-2" />
      <div className="h-4 bg-secondary rounded w-1/2" />
    </div>
  );
}

export { Spinner, LoadingOverlay, LoadingInline, LoadingDots, LoadingPulse, spinnerVariants };
