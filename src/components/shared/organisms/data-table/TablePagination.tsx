"use client";

import { Button } from "@/components/shared/shadcn-components/button";
import { Skeleton } from "@/components/shared/shadcn-components/skeleton/skeleton";
import { Paragraph } from "@/components/shared/shadcn-components/typography";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface TablePaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
  className?: string;
}

export function TablePagination({
  page,
  totalPages,
  onPageChange,
  isLoading,
  className
}: TablePaginationProps) {
  return (
    <div className={`flex items-center justify-end gap-4 py-2 ${className}`}>
      {isLoading ? (
        <>
          <Skeleton className="h-4 w-24" />
          <div className="flex items-center gap-2">
            <Skeleton className="size-9 rounded-md" />
            <Skeleton className="size-9 rounded-md" />
          </div>
        </>
      ) : (
        <>
          <Paragraph className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </Paragraph>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => onPageChange(Math.max(1, page - 1))}
              disabled={page === 1}
              className="size-9"
            >
              <ChevronLeft className="size-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => onPageChange(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="size-9"
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
