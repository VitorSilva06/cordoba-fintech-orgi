"use client";

import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "./utils";

const avatarVariants = cva(
  "relative flex shrink-0 overflow-hidden rounded-full",
  {
    variants: {
      size: {
        xs: "w-6 h-6 text-xs",
        sm: "w-8 h-8 text-xs",
        default: "w-10 h-10 text-sm",
        lg: "w-12 h-12 text-base",
        xl: "w-16 h-16 text-lg",
        "2xl": "w-20 h-20 text-xl",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

interface AvatarProps
  extends React.ComponentProps<typeof AvatarPrimitive.Root>,
    VariantProps<typeof avatarVariants> {
  status?: "online" | "offline" | "busy" | "away";
}

function Avatar({
  className,
  size,
  status,
  children,
  ...props
}: AvatarProps) {
  return (
    <div className="relative inline-block">
      <AvatarPrimitive.Root
        data-slot="avatar"
        className={cn(avatarVariants({ size }), className)}
        {...props}
      >
        {children}
      </AvatarPrimitive.Root>
      {status && (
        <span
          className={cn(
            "absolute bottom-0 right-0 block rounded-full ring-2 ring-background",
            size === "xs" && "w-1.5 h-1.5",
            size === "sm" && "w-2 h-2",
            (!size || size === "default") && "w-2.5 h-2.5",
            size === "lg" && "w-3 h-3",
            size === "xl" && "w-3.5 h-3.5",
            size === "2xl" && "w-4 h-4",
            status === "online" && "bg-success",
            status === "offline" && "bg-text-muted",
            status === "busy" && "bg-destructive",
            status === "away" && "bg-warning"
          )}
        />
      )}
    </div>
  );
}

function AvatarImage({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn("aspect-square w-full h-full object-cover", className)}
      {...props}
    />
  );
}

const fallbackVariants = cva(
  "flex w-full h-full items-center justify-center rounded-full font-medium",
  {
    variants: {
      variant: {
        default: "bg-secondary text-text-secondary",
        primary: "bg-primary/10 text-primary",
        success: "bg-success/10 text-success",
        warning: "bg-warning/10 text-warning",
        destructive: "bg-destructive/10 text-destructive",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface AvatarFallbackProps
  extends React.ComponentProps<typeof AvatarPrimitive.Fallback>,
    VariantProps<typeof fallbackVariants> {}

function AvatarFallback({
  className,
  variant,
  ...props
}: AvatarFallbackProps) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(fallbackVariants({ variant }), className)}
      {...props}
    />
  );
}

// Helper to get initials from a name
function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

// Avatar Group component
interface AvatarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  max?: number;
  size?: VariantProps<typeof avatarVariants>["size"];
}

function AvatarGroup({
  children,
  max = 4,
  size = "default",
  className,
  ...props
}: AvatarGroupProps) {
  const avatars = React.Children.toArray(children);
  const visibleAvatars = avatars.slice(0, max);
  const remainingCount = avatars.length - max;

  return (
    <div className={cn("flex -space-x-2", className)} {...props}>
      {visibleAvatars.map((avatar, index) => (
        <div key={index} className="relative ring-2 ring-background rounded-full">
          {avatar}
        </div>
      ))}
      {remainingCount > 0 && (
        <Avatar size={size}>
          <AvatarFallback variant="primary">+{remainingCount}</AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}

export { Avatar, AvatarImage, AvatarFallback, AvatarGroup, getInitials, avatarVariants };
