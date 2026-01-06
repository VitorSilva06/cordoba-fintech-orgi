import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { TrendingUp, TrendingDown, Minus, LucideIcon } from "lucide-react";
import { cn } from "./utils";
import { Card } from "./card";

const statCardVariants = cva(
  "relative overflow-hidden transition-all duration-200",
  {
    variants: {
      variant: {
        default: "",
        elevated: "hover:shadow-md hover:-translate-y-0.5",
        outlined: "border-2",
        gradient: "bg-gradient-to-br",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const iconContainerVariants = cva(
  "flex items-center justify-center rounded-xl transition-transform group-hover:scale-105",
  {
    variants: {
      color: {
        primary: "bg-primary/10 text-primary",
        success: "bg-success/10 text-success",
        warning: "bg-warning/10 text-warning",
        destructive: "bg-destructive/10 text-destructive",
        info: "bg-[#5b9bd5]/10 text-[#5b9bd5]",
        neutral: "bg-secondary text-text-secondary",
      },
      size: {
        sm: "w-10 h-10",
        default: "w-12 h-12",
        lg: "w-14 h-14",
      },
    },
    defaultVariants: {
      color: "primary",
      size: "default",
    },
  }
);

export interface StatCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof statCardVariants> {
  title: string;
  value: string | number;
  icon?: LucideIcon;
  iconColor?: VariantProps<typeof iconContainerVariants>["color"];
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  subtitle?: string;
  loading?: boolean;
}

function StatCard({
  title,
  value,
  icon: Icon,
  iconColor = "primary",
  trend,
  trendValue,
  subtitle,
  loading = false,
  variant,
  className,
  ...props
}: StatCardProps) {
  const TrendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;

  if (loading) {
    return (
      <Card className={cn("p-6", className)} {...props}>
        <div className="animate-pulse">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-secondary rounded-xl" />
            <div className="w-16 h-4 bg-secondary rounded" />
          </div>
          <div className="w-24 h-4 bg-secondary rounded mb-2" />
          <div className="w-32 h-8 bg-secondary rounded" />
        </div>
      </Card>
    );
  }

  return (
    <Card
      className={cn(statCardVariants({ variant }), "p-6 group", className)}
      {...props}
    >
      <div className="flex items-start justify-between mb-4">
        {Icon && (
          <div className={cn(iconContainerVariants({ color: iconColor }))}>
            <Icon className="w-6 h-6" />
          </div>
        )}
        {trend && trendValue && (
          <div
            className={cn(
              "flex items-center gap-1 text-sm font-medium px-2 py-1 rounded-full",
              trend === "up" && "text-success bg-success/10",
              trend === "down" && "text-destructive bg-destructive/10",
              trend === "neutral" && "text-text-muted bg-secondary"
            )}
          >
            <TrendIcon className="w-3 h-3" />
            <span>{trendValue}</span>
          </div>
        )}
      </div>

      <p className="text-text-secondary text-sm font-medium mb-1">{title}</p>
      <p className="text-foreground text-2xl font-bold tracking-tight">
        {typeof value === "number" ? value.toLocaleString("pt-BR") : value}
      </p>
      
      {subtitle && (
        <p className="text-text-muted text-xs mt-2">{subtitle}</p>
      )}
    </Card>
  );
}

// Grid wrapper for stat cards
interface StatGridProps extends React.HTMLAttributes<HTMLDivElement> {
  columns?: 2 | 3 | 4 | 5 | 6;
}

function StatGrid({ columns = 4, className, children, ...props }: StatGridProps) {
  return (
    <div
      className={cn(
        "grid gap-4",
        columns === 2 && "grid-cols-1 sm:grid-cols-2",
        columns === 3 && "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
        columns === 4 && "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
        columns === 5 && "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5",
        columns === 6 && "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export { StatCard, StatGrid, statCardVariants };
