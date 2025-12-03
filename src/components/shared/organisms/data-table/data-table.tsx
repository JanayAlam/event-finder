"use client";

import { flexRender, Table as TanStackTable } from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/shared/shadcn-components/table";
import { cn } from "@/utils/tailwind-utils";
import { Spinner } from "../../shadcn-components/spinner";

interface DataTableProps<TData> {
  isLoading?: boolean;
  table: TanStackTable<TData>;
  containerClassName?: string;
  showContainer?: boolean;
  emptyTableMessage?: string;
}

export function DataTable<TData>({
  isLoading,
  table,
  containerClassName,
  showContainer = true,
  emptyTableMessage = "No records"
}: DataTableProps<TData>) {
  const tableContent = (
    <div className="w-full">
      <div className="overflow-x-auto rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const isSelectColumn = header.column.id === "select";
                  const isActionsColumn = header.column.id === "actions";
                  const shrinkClass =
                    isSelectColumn || isActionsColumn
                      ? "w-[1%] whitespace-nowrap"
                      : "whitespace-nowrap";

                  return (
                    <TableHead
                      key={header.id}
                      className={shrinkClass}
                      style={
                        isSelectColumn || isActionsColumn
                          ? {
                              width: `${header.column.getSize()}px`,
                              minWidth: `${header.column.getSize()}px`,
                              maxWidth: `${header.column.getSize()}px`
                            }
                          : undefined
                      }
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={table.getAllColumns().length}
                  className="h-24 text-center"
                >
                  <div className="flex justify-center items-center">
                    <Spinner className="size-10" />
                  </div>
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => {
                    const isSelectColumn = cell.column.id === "select";
                    const isActionsColumn = cell.column.id === "actions";
                    const shrinkClass =
                      isSelectColumn || isActionsColumn
                        ? "w-[1%] whitespace-nowrap"
                        : "whitespace-nowrap";

                    return (
                      <TableCell
                        key={cell.id}
                        className={shrinkClass}
                        style={
                          isSelectColumn || isActionsColumn
                            ? {
                                width: `${cell.column.getSize()}px`,
                                minWidth: `${cell.column.getSize()}px`,
                                maxWidth: `${cell.column.getSize()}px`
                              }
                            : undefined
                        }
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={table.getAllColumns().length}
                  className="h-24 text-center"
                >
                  {emptyTableMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );

  if (!showContainer) {
    return tableContent;
  }

  return (
    <div
      className={cn(
        containerClassName ??
          "my-8 px-4 w-full flex items-center flex-col justify-center sm:my-12 sm:px-6 lg:my-20 lg:px-40"
      )}
    >
      {tableContent}
    </div>
  );
}
