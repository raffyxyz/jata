import { cn } from "@/lib/utils/cn";

interface SkeletonProps {
  className?: string;
  style?: React.CSSProperties;
}

function Skeleton({ className, style }: SkeletonProps) {
  return (
    <div
      className={cn("animate-skeleton rounded-md", className)}
      style={{
        background: "linear-gradient(90deg, var(--bg-muted) 25%, var(--border) 50%, var(--bg-muted) 75%)",
        backgroundSize: "200% 100%",
        ...style,
      }}
    />
  );
}

interface SkeletonCardProps {
  className?: string;
}

function SkeletonCard({ className }: SkeletonCardProps) {
  return (
    <div
      className={cn("bg-bg-surface rounded-lg p-5 space-y-3", className)}
      style={{ borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-sm)" }}
    >
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
      <Skeleton className="h-3 w-2/3" />
    </div>
  );
}

export { Skeleton, SkeletonCard };
export type { SkeletonProps, SkeletonCardProps };
