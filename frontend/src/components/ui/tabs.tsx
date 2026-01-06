"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";

import { cn } from "./utils";

function Tabs({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn("flex flex-col gap-4", className)}
      {...props}
    />
  );
}

function TabsList({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(
        "inline-flex h-10 items-center justify-start gap-1 rounded-lg p-1",
        "bg-secondary dark:bg-muted/50",
        "border border-border",
        className,
      )}
      {...props}
    />
  );
}

function TabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        // Base
        "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md px-3 py-1.5",
        "text-sm font-medium text-text-secondary",
        // Transition
        "transition-all duration-200",
        // Hover
        "hover:text-foreground",
        // Active state
        "data-[state=active]:bg-card data-[state=active]:text-foreground",
        "data-[state=active]:shadow-sm data-[state=active]:border data-[state=active]:border-border",
        // Dark mode active
        "dark:data-[state=active]:bg-card dark:data-[state=active]:text-foreground",
        // Focus
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
        // Disabled
        "disabled:pointer-events-none disabled:opacity-50",
        // Icons
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg]:w-4 [&_svg]:h-4",
        className,
      )}
      {...props}
    />
  );
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn(
        "flex-1 outline-none",
        "focus-visible:outline-none",
        "data-[state=inactive]:hidden",
        "animate-fade-in",
        className,
      )}
      {...props}
    />
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
