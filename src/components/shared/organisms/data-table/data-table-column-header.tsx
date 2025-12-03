import { cn } from "@/utils/tailwind-utils";
import { Column } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ChevronsUpDown, EyeOff } from "lucide-react";
import { Button } from "../../shadcn-components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "../../shadcn-components/menu";

interface DataTableColumnHeaderProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  title: string;
  align?: "left" | "center" | "right";
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
  align = "left"
}: DataTableColumnHeaderProps<TData, TValue>) {
  const alignmentClasses = {
    left: "justify-start",
    center: "justify-center",
    right: "justify-end"
  };

  if (!column.getCanSort()) {
    return (
      <div className={cn("flex", alignmentClasses[align], className)}>
        {title}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex items-center gap-2",
        alignmentClasses[align],
        className
      )}
    >
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="data-[state=open]:bg-accent -ml-3 h-8"
          >
            <span>{title}</span>
            {column.getIsSorted() === "desc" ? (
              <ArrowDown />
            ) : column.getIsSorted() === "asc" ? (
              <ArrowUp />
            ) : (
              <ChevronsUpDown />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
            <ArrowUp />
            Asc
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
            <ArrowDown />
            Desc
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => column.toggleVisibility(false)}>
            <EyeOff />
            Hide
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
