import React from "react";
import { Skeleton } from "../../shadcn-components/skeleton";

const InputFieldSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col gap-1.5">
      <Skeleton className="h-3.5 w-[150px] rounded-sm" />
      <Skeleton className="h-9 w-full rounded-md" />
    </div>
  );
};

export default InputFieldSkeleton;
