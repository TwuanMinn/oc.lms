import { cn } from "@/lib/utils";

interface CategoryBadgeProps {
  name: string;
  className?: string;
}

export function CategoryBadge({ name, className }: CategoryBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary",
        className
      )}
    >
      {name}
    </span>
  );
}
