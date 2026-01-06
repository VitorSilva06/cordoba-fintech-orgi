import { cn } from "./utils";

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        "bg-secondary dark:bg-secondary/50 animate-pulse rounded-md",
        className
      )}
      {...props}
    />
  );
}

// Pre-built skeleton variants for common use cases
function SkeletonText({ lines = 3, className }: { lines?: number; className?: string }) {
  return (
    <div className={cn("space-y-2", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton 
          key={i} 
          className={cn("h-4", i === lines - 1 ? "w-3/4" : "w-full")} 
        />
      ))}
    </div>
  );
}

function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn("bg-card border border-border rounded-xl p-6 space-y-4", className)}>
      <div className="flex items-center space-x-4">
        <Skeleton className="h-12 w-12 rounded-xl" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
      <SkeletonText lines={2} />
    </div>
  );
}

function SkeletonTable({ rows = 5, cols = 4, className }: { rows?: number; cols?: number; className?: string }) {
  return (
    <div className={cn("space-y-3", className)}>
      {/* Header */}
      <div className="flex gap-4 pb-2 border-b border-border">
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={i} className="h-4 flex-1" />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex gap-4 py-2">
          {Array.from({ length: cols }).map((_, colIndex) => (
            <Skeleton key={colIndex} className="h-4 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}

function SkeletonStats({ className }: { className?: string }) {
  return (
    <div className={cn("bg-card border border-border rounded-xl p-6", className)}>
      <Skeleton className="h-12 w-12 rounded-xl mb-4" />
      <Skeleton className="h-3 w-20 mb-2" />
      <Skeleton className="h-7 w-24" />
    </div>
  );
}

export { 
  Skeleton, 
  SkeletonText, 
  SkeletonCard, 
  SkeletonTable, 
  SkeletonStats 
};
