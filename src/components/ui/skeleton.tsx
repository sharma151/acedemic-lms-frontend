import { cn } from "@/lib/utils"

function Skeleton({
  className,
  shimmer = true,
  ...props
}: React.ComponentProps<"div"> & { shimmer?: boolean }) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        "rounded-md",
        shimmer ? "animate-shimmer" : "animate-pulse bg-muted",
        className
      )}
      {...props}
    />
  )
}

export { Skeleton }

