import { cn } from "@/lib/utils";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md dark:bg-primary-foreground/10 bg-input!",
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };
