import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { AlertCircle, CheckCircle, AlertTriangle, Info } from "lucide-react";

import { cn } from "./utils";

const alertVariants = cva(
  "relative w-full rounded-lg border p-4 flex items-start gap-3 text-sm transition-colors",
  {
    variants: {
      variant: {
        default: "bg-card border-border text-foreground",
        destructive:
          "bg-destructive/5 border-destructive/20 text-destructive dark:bg-destructive/10",
        success:
          "bg-success/5 border-success/20 text-success dark:bg-success/10",
        warning:
          "bg-warning/5 border-warning/20 text-warning dark:bg-warning/10",
        info:
          "bg-primary/5 border-primary/20 text-primary dark:bg-primary/10",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

const alertIcons = {
  default: Info,
  destructive: AlertCircle,
  success: CheckCircle,
  warning: AlertTriangle,
  info: Info,
};

function Alert({
  className,
  variant = "default",
  children,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof alertVariants>) {
  const Icon = alertIcons[variant || "default"];
  
  return (
    <div
      data-slot="alert"
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    >
      <Icon className="w-5 h-5 shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}

function AlertTitle({ className, ...props }: React.ComponentProps<"h5">) {
  return (
    <h5
      data-slot="alert-title"
      className={cn("font-semibold leading-none tracking-tight mb-1", className)}
      {...props}
    />
  );
}

function AlertDescription({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-description"
      className={cn("text-sm opacity-90 [&_p]:leading-relaxed", className)}
      {...props}
    />
  );
}

export { Alert, AlertTitle, AlertDescription };
