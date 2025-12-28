import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export const BentoGrid = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-4 gap-4 max-w-7xl mx-auto px-4 py-10",
        className
      )}
    >
      {children}
    </div>
  );
};

export const BentoGridItem = ({
  title,
  description,
  header,
  icon,
  className,
  size = "1x1",
  onClick,
  active = false,
  loading = false,
}: {
  title?: string | ReactNode;
  description?: string | ReactNode;
  header?: ReactNode;
  icon?: ReactNode;
  className?: string;
  size?: "1x1" | "2x1" | "1x2" | "2x2";
  onClick?: () => void;
  active?: boolean;
  loading?: boolean;
}) => {
  const sizeClasses = {
    "1x1": "md:col-span-1 md:row-span-1",
    "2x1": "md:col-span-2 md:row-span-1",
    "1x2": "md:col-span-1 md:row-span-2",
    "2x2": "md:col-span-2 md:row-span-2",
  };

  return (
    <div
      onClick={!loading ? onClick : undefined}
      className={cn(
        "group relative overflow-hidden rounded-3xl border bg-card p-6 transition-all duration-300 ease-in-out flex flex-col justify-between will-change-transform",
        "hover:shadow-[0_20px_50px_rgba(16,185,129,0.1)] hover:-translate-y-1",
        onClick && !loading && "cursor-pointer active:scale-[0.98]",
        active && "ring-2 ring-primary border-transparent bg-primary/5",
        loading && "opacity-70 cursor-wait",
        sizeClasses[size],
        className
      )}
    >
      {/* Hover Gradient Effect */}
      <div className="absolute inset-0 bg-linear-to-br from-primary/10 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      
      {/* Animated Underline */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-primary transition-all duration-300 ease-out group-hover:w-full" />

      {header && (
        <div className={cn(
          "mb-4 relative z-10 transition-transform duration-300 group-hover:scale-105",
          active && "scale-105"
        )}>
          {header}
        </div>
      )}
      
      <div className="relative z-10">
        {icon && (
          <div className={cn(
            "mb-2 text-primary transition-all duration-300",
            active ? "scale-110 rotate-3" : "group-hover:scale-110"
          )}>
            {icon}
          </div>
        )}
        <div className={cn(
          "font-bold text-xl mb-1 transition-colors duration-300",
          active ? "text-primary" : "group-hover:text-primary"
        )}>
          {title}
        </div>
        <div className="text-muted-foreground text-sm">
          {description}
        </div>
      </div>
      
      <div className="absolute bottom-4 right-4 z-10">
        {loading ? (
          <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center">
            <div className="size-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className={cn(
            "size-8 rounded-full bg-primary/10 flex items-center justify-center text-primary transition-all duration-300",
            "opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0",
            active && "opacity-100 translate-x-0 bg-primary text-white"
          )}>
            →
          </div>
        )}
      </div>
    </div>
  );
};
