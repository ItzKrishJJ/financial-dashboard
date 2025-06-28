import React from "react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  className?: string;
  highlighted?: boolean;
}

export function StatCard({
  title,
  value,
  subtitle,
  className,
  highlighted,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "rounded-lg bg-card p-6 border transition-colors",
        highlighted && "border-accent bg-accent/5",
        className,
      )}
    >
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">{title}</p>
        <p className="text-2xl font-bold text-card-foreground">{value}</p>
        {subtitle && (
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        )}
      </div>
    </div>
  );
}
