import { cn } from "@/lib/utils/cn";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: boolean;
  hover?: boolean;
}

function Card({ children, className, padding = true, hover = false }: CardProps) {
  return (
    <div
      className={cn(
        "bg-bg-surface shadow-[var(--shadow-sm)] rounded-lg",
        padding && "p-5",
        hover && "transition-all duration-120 hover:shadow-[var(--shadow-md)]",
        className
      )}
      style={{ borderRadius: "var(--radius-lg)" }}
    >
      {children}
    </div>
  );
}

export { Card };
export type { CardProps };
