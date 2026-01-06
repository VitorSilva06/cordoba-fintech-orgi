import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "./utils";
import { 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Info, 
  X,
  Loader2
} from "lucide-react";

/* ==========================================================================
   Notification Banner
   ========================================================================== */

const notificationVariants = cva(
  [
    "relative flex items-start gap-3 p-4 rounded-lg border",
    "animate-fade-in",
  ],
  {
    variants: {
      variant: {
        default: [
          "bg-gray-50 dark:bg-gray-800/50",
          "border-gray-200 dark:border-gray-700",
          "text-gray-900 dark:text-gray-100",
        ],
        success: [
          "bg-green-50 dark:bg-green-950/30",
          "border-green-200 dark:border-green-800",
          "text-green-800 dark:text-green-200",
        ],
        error: [
          "bg-red-50 dark:bg-red-950/30",
          "border-red-200 dark:border-red-800",
          "text-red-800 dark:text-red-200",
        ],
        warning: [
          "bg-amber-50 dark:bg-amber-950/30",
          "border-amber-200 dark:border-amber-800",
          "text-amber-800 dark:text-amber-200",
        ],
        info: [
          "bg-blue-50 dark:bg-blue-950/30",
          "border-blue-200 dark:border-blue-800",
          "text-blue-800 dark:text-blue-200",
        ],
        loading: [
          "bg-gray-50 dark:bg-gray-800/50",
          "border-gray-200 dark:border-gray-700",
          "text-gray-900 dark:text-gray-100",
        ],
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const notificationIconVariants = cva("shrink-0 mt-0.5", {
  variants: {
    variant: {
      default: "text-gray-500 dark:text-gray-400",
      success: "text-green-600 dark:text-green-400",
      error: "text-red-600 dark:text-red-400",
      warning: "text-amber-600 dark:text-amber-400",
      info: "text-blue-600 dark:text-blue-400",
      loading: "text-[var(--brand-primary)] animate-spin",
    },
    size: {
      sm: "size-4",
      default: "size-5",
      lg: "size-6",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

interface NotificationProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof notificationVariants> {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  showIcon?: boolean;
  closable?: boolean;
  onClose?: () => void;
  action?: React.ReactNode;
}

const iconMap = {
  default: Info,
  success: CheckCircle2,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
  loading: Loader2,
};

function Notification({
  className,
  variant = "default",
  title,
  description,
  icon,
  showIcon = true,
  closable,
  onClose,
  action,
  children,
  ...props
}: NotificationProps) {
  const IconComponent = iconMap[variant ?? "default"];

  return (
    <div
      data-slot="notification"
      role="alert"
      className={cn(notificationVariants({ variant }), className)}
      {...props}
    >
      {showIcon && (
        <span className={cn(notificationIconVariants({ variant }))}>
          {icon ?? <IconComponent />}
        </span>
      )}
      <div className="flex-1 min-w-0 space-y-1">
        {title && (
          <h4 className="font-semibold text-sm leading-tight">{title}</h4>
        )}
        {description && (
          <p className="text-sm opacity-90">{description}</p>
        )}
        {children}
        {action && (
          <div className="pt-2">{action}</div>
        )}
      </div>
      {closable && (
        <button
          type="button"
          onClick={onClose}
          className={cn(
            "shrink-0 p-1 rounded-md -m-1",
            "hover:bg-black/5 dark:hover:bg-white/5",
            "text-current opacity-60 hover:opacity-100",
            "transition-all"
          )}
          aria-label="Fechar"
        >
          <X className="size-4" />
        </button>
      )}
    </div>
  );
}

/* ==========================================================================
   Inline Alert (more compact)
   ========================================================================== */

interface InlineAlertProps 
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof notificationVariants> {
  showIcon?: boolean;
}

function InlineAlert({
  className,
  variant = "default",
  showIcon = true,
  children,
  ...props
}: InlineAlertProps) {
  const IconComponent = iconMap[variant ?? "default"];

  return (
    <div
      data-slot="inline-alert"
      role="alert"
      className={cn(
        "flex items-center gap-2 px-3 py-2 rounded-md text-sm",
        variant === "default" && "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300",
        variant === "success" && "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300",
        variant === "error" && "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300",
        variant === "warning" && "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300",
        variant === "info" && "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300",
        variant === "loading" && "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300",
        className
      )}
      {...props}
    >
      {showIcon && (
        <IconComponent className={cn(
          "shrink-0 size-4",
          variant === "loading" && "animate-spin text-[var(--brand-primary)]"
        )} />
      )}
      <span className="flex-1">{children}</span>
    </div>
  );
}

/* ==========================================================================
   Status Indicator
   ========================================================================== */

const statusVariants = cva(
  "inline-flex items-center gap-1.5 text-xs font-medium",
  {
    variants: {
      variant: {
        default: "text-gray-600 dark:text-gray-400",
        success: "text-green-600 dark:text-green-400",
        error: "text-red-600 dark:text-red-400",
        warning: "text-amber-600 dark:text-amber-400",
        info: "text-blue-600 dark:text-blue-400",
        pending: "text-gray-500 dark:text-gray-400",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const statusDotVariants = cva("size-2 rounded-full", {
  variants: {
    variant: {
      default: "bg-gray-400 dark:bg-gray-500",
      success: "bg-green-500 dark:bg-green-400",
      error: "bg-red-500 dark:bg-red-400",
      warning: "bg-amber-500 dark:bg-amber-400",
      info: "bg-blue-500 dark:bg-blue-400",
      pending: "bg-gray-400 dark:bg-gray-500 animate-pulse",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

interface StatusIndicatorProps 
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof statusVariants> {
  showDot?: boolean;
  pulse?: boolean;
}

function StatusIndicator({
  className,
  variant = "default",
  showDot = true,
  pulse,
  children,
  ...props
}: StatusIndicatorProps) {
  return (
    <span
      data-slot="status-indicator"
      className={cn(statusVariants({ variant }), className)}
      {...props}
    >
      {showDot && (
        <span 
          className={cn(
            statusDotVariants({ variant }),
            pulse && "animate-pulse"
          )} 
        />
      )}
      {children}
    </span>
  );
}

/* ==========================================================================
   Connection Status
   ========================================================================== */

interface ConnectionStatusProps extends React.HTMLAttributes<HTMLDivElement> {
  status: "connected" | "disconnected" | "connecting" | "error";
  showLabel?: boolean;
}

const connectionLabels = {
  connected: "Conectado",
  disconnected: "Desconectado",
  connecting: "Conectando...",
  error: "Erro de conexão",
};

function ConnectionStatus({
  className,
  status,
  showLabel = true,
  ...props
}: ConnectionStatusProps) {
  const variantMap = {
    connected: "success",
    disconnected: "default",
    connecting: "pending",
    error: "error",
  } as const;

  return (
    <StatusIndicator
      variant={variantMap[status]}
      pulse={status === "connecting"}
      className={className}
      {...props}
    >
      {showLabel && connectionLabels[status]}
    </StatusIndicator>
  );
}

/* ==========================================================================
   Process Status
   ========================================================================== */

interface ProcessStatusProps extends React.HTMLAttributes<HTMLDivElement> {
  status: "idle" | "running" | "completed" | "failed" | "paused";
  showLabel?: boolean;
}

const processLabels = {
  idle: "Aguardando",
  running: "Em execução",
  completed: "Concluído",
  failed: "Falhou",
  paused: "Pausado",
};

const processIcons = {
  idle: Info,
  running: Loader2,
  completed: CheckCircle2,
  failed: XCircle,
  paused: AlertTriangle,
};

function ProcessStatus({
  className,
  status,
  showLabel = true,
  ...props
}: ProcessStatusProps) {
  const variantMap = {
    idle: "default",
    running: "info",
    completed: "success",
    failed: "error",
    paused: "warning",
  } as const;

  const Icon = processIcons[status];

  return (
    <span
      data-slot="process-status"
      className={cn(statusVariants({ variant: variantMap[status] }), className)}
      {...props}
    >
      <Icon 
        className={cn(
          "size-3.5",
          status === "running" && "animate-spin"
        )} 
      />
      {showLabel && processLabels[status]}
    </span>
  );
}

export {
  Notification,
  InlineAlert,
  StatusIndicator,
  ConnectionStatus,
  ProcessStatus,
  notificationVariants,
};
