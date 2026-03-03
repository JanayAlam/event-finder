import { cn } from "@/lib/utils";
import { ListX } from "lucide-react";
import React from "react";
import {
  Empty,
  EmptyDescription,
  EmptyMedia
} from "../../shadcn-components/empty";

interface IEmptyListProps {
  message?: string;
  content?: React.ReactNode;
  className?: string;
}

export const EmptyList: React.FC<IEmptyListProps> = ({
  message = "No records found",
  content,
  className
}) => {
  return (
    <Empty className={cn("flex flex-col gap-2", className)}>
      <EmptyMedia>
        <ListX className="size-5 text-muted-foreground" />
      </EmptyMedia>
      <EmptyDescription>{message}</EmptyDescription>
      {content}
    </Empty>
  );
};
