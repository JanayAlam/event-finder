import { cn } from "@/lib/utils";
import { PackageX } from "lucide-react";
import React from "react";
import {
  Empty,
  EmptyDescription,
  EmptyMedia
} from "../../shadcn-components/empty";

interface IEmptyDataProps {
  message?: string;
  content?: React.ReactNode;
  className?: string;
}

export const EmptyData: React.FC<IEmptyDataProps> = ({
  message = "No data found",
  content,
  className
}) => {
  return (
    <Empty className={cn("flex flex-col gap-2", className)}>
      <EmptyMedia>
        <PackageX className="size-5 text-muted-foreground" />
      </EmptyMedia>
      <EmptyDescription>{message}</EmptyDescription>
      {content}
    </Empty>
  );
};
