"use client";

import { Spinner } from "@/components/shared/shadcn-components/spinner/Spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/shared/shadcn-components/table/Table";
import { cn } from "@/utils/tailwind-utils";
import { ReactNode } from "react";

import { FileX } from "lucide-react";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle
} from "../../shadcn-components/empty";
import { TablePagination } from "./TablePagination";

export interface IDataTableColumn<T> {
  header: ReactNode | ((props: { data: T[] }) => ReactNode);
  cell: (item: T, index: number) => ReactNode;
  className?: string;
}

interface IDataTableProps<T> {
  data: T[];
  columns: IDataTableColumn<T>[];
  isLoading?: boolean;
  emptyMessage?: string;
  className?: string;
  pagination?: {
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
  };
}

export function DataTable<T>({
  data,
  columns,
  isLoading,
  emptyMessage = "No Records Found",
  className,
  pagination
}: IDataTableProps<T>) {
  return (
    <div className="flex flex-col gap-4">
      <div className={cn("rounded-md border overflow-hidden", className)}>
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column, index) => (
                <TableHead key={index} className={column.className}>
                  {typeof column.header === "function"
                    ? column.header({ data })
                    : column.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  <div className="flex justify-center">
                    <Spinner className="size-6" />
                  </div>
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  <Empty>
                    <EmptyHeader>
                      <EmptyMedia variant="icon">
                        <FileX />
                      </EmptyMedia>
                      <EmptyTitle>{emptyMessage}</EmptyTitle>
                    </EmptyHeader>
                  </Empty>
                </TableCell>
              </TableRow>
            ) : (
              data.map((item, rowIndex) => (
                <TableRow key={rowIndex}>
                  {columns.map((column, colIndex) => (
                    <TableCell key={colIndex} className={column.className}>
                      {column.cell(item, rowIndex)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      {pagination && (
        <TablePagination
          page={pagination.page}
          totalPages={pagination.totalPages}
          onPageChange={pagination.onPageChange}
          isLoading={isLoading}
        />
      )}
    </div>
  );
}
