import * as React from "react";
import { cn } from "./utils";
import { ChevronLeft, MoreHorizontal } from "lucide-react";
import { Button } from "./button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "./dropdown-menu";

/* ==========================================================================
   Page Header
   ========================================================================== */

interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  backHref?: string;
  onBack?: () => void;
  badge?: React.ReactNode;
  actions?: React.ReactNode;
  moreActions?: React.ReactNode;
}

function PageHeader({
  className,
  title,
  description,
  backHref,
  onBack,
  badge,
  actions,
  moreActions,
  children,
  ...props
}: PageHeaderProps) {
  return (
    <div
      data-slot="page-header"
      className={cn("space-y-4", className)}
      {...props}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            {(backHref || onBack) && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onBack}
                className="size-8 shrink-0"
                asChild={!!backHref}
              >
                {backHref ? (
                  <a href={backHref}>
                    <ChevronLeft className="size-4" />
                  </a>
                ) : (
                  <ChevronLeft className="size-4" />
                )}
              </Button>
            )}
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
                {title}
              </h1>
              {badge}
            </div>
          </div>
          {description && (
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-2xl">
              {description}
            </p>
          )}
        </div>
        {(actions || moreActions) && (
          <div className="flex items-center gap-2 shrink-0">
            {actions}
            {moreActions && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <MoreHorizontal className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {moreActions}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        )}
      </div>
      {children}
    </div>
  );
}

/* ==========================================================================
   Page Section
   ========================================================================== */

interface PageSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  actions?: React.ReactNode;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
}

function PageSection({
  className,
  title,
  description,
  actions,
  collapsible,
  defaultCollapsed = false,
  children,
  ...props
}: PageSectionProps) {
  const [collapsed, setCollapsed] = React.useState(defaultCollapsed);

  return (
    <section
      data-slot="page-section"
      className={cn("space-y-4", className)}
      {...props}
    >
      {(title || description || actions) && (
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            {title && (
              <div className="flex items-center gap-2">
                {collapsible && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setCollapsed(!collapsed)}
                    className="size-6 -ml-1"
                  >
                    <ChevronLeft
                      className={cn(
                        "size-4 transition-transform",
                        !collapsed && "-rotate-90"
                      )}
                    />
                  </Button>
                )}
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {title}
                </h2>
              </div>
            )}
            {description && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {description}
              </p>
            )}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}
      {(!collapsible || !collapsed) && children}
    </section>
  );
}

/* ==========================================================================
   Page Tabs Header
   ========================================================================== */

interface PageTabsHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  tabs: React.ReactNode;
}

function PageTabsHeader({
  className,
  title,
  description,
  tabs,
  ...props
}: PageTabsHeaderProps) {
  return (
    <div
      data-slot="page-tabs-header"
      className={cn("border-b border-gray-200 dark:border-gray-700", className)}
      {...props}
    >
      <div className="space-y-4 pb-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
            {title}
          </h1>
          {description && (
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-2xl">
              {description}
            </p>
          )}
        </div>
      </div>
      {tabs}
    </div>
  );
}

/* ==========================================================================
   Breadcrumb
   ========================================================================== */

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps extends React.HTMLAttributes<HTMLElement> {
  items: BreadcrumbItem[];
  separator?: React.ReactNode;
}

function Breadcrumb({
  className,
  items,
  separator = "/",
  ...props
}: BreadcrumbProps) {
  return (
    <nav
      data-slot="breadcrumb"
      aria-label="Breadcrumb"
      className={cn("flex items-center gap-1.5 text-sm", className)}
      {...props}
    >
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && (
            <span className="text-gray-400 dark:text-gray-500 mx-1">
              {separator}
            </span>
          )}
          {item.href && index < items.length - 1 ? (
            <a
              href={item.href}
              className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
            >
              {item.label}
            </a>
          ) : (
            <span
              className={cn(
                index === items.length - 1
                  ? "text-gray-900 dark:text-gray-100 font-medium"
                  : "text-gray-500 dark:text-gray-400"
              )}
            >
              {item.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}

/* ==========================================================================
   Stats Row (for page headers)
   ========================================================================== */

interface StatItemProps {
  label: string;
  value: string | number;
  change?: {
    value: string;
    type: "increase" | "decrease" | "neutral";
  };
}

interface StatsRowProps extends React.HTMLAttributes<HTMLDivElement> {
  stats: StatItemProps[];
}

function StatsRow({ className, stats, ...props }: StatsRowProps) {
  return (
    <div
      data-slot="stats-row"
      className={cn(
        "flex flex-wrap gap-6 py-4 border-y border-gray-200 dark:border-gray-700",
        className
      )}
      {...props}
    >
      {stats.map((stat, index) => (
        <div key={index} className="flex flex-col">
          <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            {stat.label}
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {stat.value}
            </span>
            {stat.change && (
              <span
                className={cn(
                  "text-xs font-medium",
                  stat.change.type === "increase" && "text-green-600 dark:text-green-400",
                  stat.change.type === "decrease" && "text-red-600 dark:text-red-400",
                  stat.change.type === "neutral" && "text-gray-500 dark:text-gray-400"
                )}
              >
                {stat.change.type === "increase" && "↑ "}
                {stat.change.type === "decrease" && "↓ "}
                {stat.change.value}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export {
  PageHeader,
  PageSection,
  PageTabsHeader,
  Breadcrumb,
  StatsRow,
};
