import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Inbox, Search, FileX, AlertCircle, LucideIcon } from "lucide-react";
import { cn } from "./utils";
import { Button } from "./button";

const emptyStateVariants = cva(
  "flex flex-col items-center justify-center text-center",
  {
    variants: {
      size: {
        sm: "py-8 px-4",
        default: "py-12 px-6",
        lg: "py-16 px-8",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

const iconContainerVariants = cva(
  "flex items-center justify-center rounded-full mb-4",
  {
    variants: {
      size: {
        sm: "w-12 h-12",
        default: "w-16 h-16",
        lg: "w-20 h-20",
      },
      variant: {
        default: "bg-secondary text-text-muted",
        primary: "bg-primary/10 text-primary",
        warning: "bg-warning/10 text-warning",
        destructive: "bg-destructive/10 text-destructive",
      },
    },
    defaultVariants: {
      size: "default",
      variant: "default",
    },
  }
);

export interface EmptyStateProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof emptyStateVariants> {
  icon?: LucideIcon;
  iconVariant?: VariantProps<typeof iconContainerVariants>["variant"];
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    variant?: "default" | "outline" | "ghost";
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
}

function EmptyState({
  icon: Icon = Inbox,
  iconVariant = "default",
  title,
  description,
  action,
  secondaryAction,
  size,
  className,
  ...props
}: EmptyStateProps) {
  return (
    <div className={cn(emptyStateVariants({ size }), className)} {...props}>
      <div className={cn(iconContainerVariants({ size, variant: iconVariant }))}>
        <Icon
          className={cn(
            size === "sm" && "w-6 h-6",
            size === "default" && "w-8 h-8",
            size === "lg" && "w-10 h-10",
            !size && "w-8 h-8"
          )}
        />
      </div>

      <h3
        className={cn(
          "font-semibold text-foreground mb-2",
          size === "sm" && "text-base",
          size === "default" && "text-lg",
          size === "lg" && "text-xl",
          !size && "text-lg"
        )}
      >
        {title}
      </h3>

      {description && (
        <p
          className={cn(
            "text-text-secondary max-w-sm mb-6",
            size === "sm" && "text-sm",
            size === "default" && "text-sm",
            size === "lg" && "text-base",
            !size && "text-sm"
          )}
        >
          {description}
        </p>
      )}

      {(action || secondaryAction) && (
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {action && (
            <Button
              onClick={action.onClick}
              variant={action.variant || "default"}
            >
              {action.label}
            </Button>
          )}
          {secondaryAction && (
            <Button
              onClick={secondaryAction.onClick}
              variant="ghost"
            >
              {secondaryAction.label}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

// Pre-configured empty states for common scenarios
function NoDataState(props: Partial<EmptyStateProps>) {
  return (
    <EmptyState
      icon={Inbox}
      title="Nenhum dado encontrado"
      description="Não há registros para exibir no momento."
      {...props}
    />
  );
}

function NoSearchResults(props: Partial<EmptyStateProps>) {
  return (
    <EmptyState
      icon={Search}
      iconVariant="primary"
      title="Nenhum resultado encontrado"
      description="Tente ajustar os filtros ou termos de busca."
      {...props}
    />
  );
}

function NoFileState(props: Partial<EmptyStateProps>) {
  return (
    <EmptyState
      icon={FileX}
      title="Nenhum arquivo"
      description="Faça upload de um arquivo para começar."
      {...props}
    />
  );
}

function ErrorState(props: Partial<EmptyStateProps>) {
  return (
    <EmptyState
      icon={AlertCircle}
      iconVariant="destructive"
      title="Erro ao carregar"
      description="Ocorreu um erro ao carregar os dados. Tente novamente."
      {...props}
    />
  );
}

export {
  EmptyState,
  NoDataState,
  NoSearchResults,
  NoFileState,
  ErrorState,
  emptyStateVariants,
};
