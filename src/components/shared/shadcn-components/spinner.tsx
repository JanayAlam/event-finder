import { cn } from "@/lib/utils";
import { LoaderIcon } from "lucide-react";

function Spinner({ className, color, ...props }: React.ComponentProps<"svg">) {
  return (
    <LoaderIcon
      role="status"
      aria-label="Loading"
      className={cn(
        "size-4 animate-spin",
        color ? color : "text-primary",
        className
      )}
      {...props}
    />
  );
}

export { Spinner };
