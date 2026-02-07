import { cn } from "@/lib/utils";
import React from "react";
import { Skeleton } from "../../shadcn-components/skeleton";

interface IInputFieldSkeletonProps {
  isTextarea?: boolean;
}

const InputFieldSkeleton: React.FC<IInputFieldSkeletonProps> = ({
  isTextarea
}) => {
  return (
    <div className="flex flex-col gap-1.5">
      <Skeleton className="h-3.5 w-[150px] rounded-sm" />
      <Skeleton
        className={cn("w-full rounded-md", isTextarea ? "h-18" : "h-9")}
      />
    </div>
  );
};

export default InputFieldSkeleton;
