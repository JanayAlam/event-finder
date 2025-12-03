"use client";

import { Table } from "@tanstack/react-table";
import { Settings2 } from "lucide-react";

import { Button } from "@/components/shared/shadcn-components/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/shared/shadcn-components/dropdown-menu";

interface DataTableViewOptionsProps<TData> {
  table: Table<TData>;
  triggerLabel?: string;
  dropdownMenuLabel?: string;
}

export function DataTableViewOptions<TData>({
  table,
  triggerLabel = "View",
  dropdownMenuLabel = "Toggle columns"
}: DataTableViewOptionsProps<TData>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="ml-auto h-8">
          <Settings2 className="h-4 w-4 sm:mr-2" />
          <span className="hidden sm:inline">{triggerLabel}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[150px]">
        <DropdownMenuLabel>{dropdownMenuLabel}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {table
          .getAllColumns()
          .filter(
            (column) =>
              typeof column.accessorFn !== "undefined" && column.getCanHide()
          )
          .map((column) => {
            return (
              <DropdownMenuCheckboxItem
                key={column.id}
                className="capitalize"
                checked={column.getIsVisible()}
                onCheckedChange={(value) => column.toggleVisibility(!!value)}
              >
                {column.id}
              </DropdownMenuCheckboxItem>
            );
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
