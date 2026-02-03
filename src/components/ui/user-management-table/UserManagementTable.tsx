"use client";

import { DataTable } from "@/components/shared/organisms/data-table";
import { Button } from "@/components/shared/shadcn-components/button";
import { Input } from "@/components/shared/shadcn-components/input";
import { Paragraph } from "@/components/shared/shadcn-components/typography";
import UserRepository from "@/repositories/user.repository";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { useDebounce } from "use-debounce";
import { createColumns } from "./columns";

export default function UserManagementTable() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 500);
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading } = useQuery({
    queryKey: ["admin-users", debouncedSearch, page],
    queryFn: () =>
      UserRepository.getAllUsers({
        search: debouncedSearch || undefined,
        page,
        limit
      })
  });

  const { mutate: mutateBlock } = useMutation({
    mutationFn: (id: string) => UserRepository.blockUser(id),
    onMutate: () => {
      return { toastId: toast.loading("Blocking user...") };
    },
    onSuccess: (_, __, context) => {
      toast.success("User blocked", { id: context?.toastId });
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
    onError: (error: any, __, context) => {
      toast.error(error?.message || "Failed to block user", {
        id: context?.toastId
      });
    }
  });

  const { mutate: mutateUnblock } = useMutation({
    mutationFn: (id: string) => UserRepository.unblockUser(id),
    onMutate: () => {
      return { toastId: toast.loading("Unblocking user...") };
    },
    onSuccess: (_, __, context) => {
      toast.success("User unblocked", { id: context?.toastId });
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
    onError: (error: any, __, context) => {
      toast.error(error?.message || "Failed to unblock user", {
        id: context?.toastId
      });
    }
  });

  const columns = createColumns({
    onBlock: (id) => mutateBlock(id),
    onUnblock: (id) => mutateUnblock(id)
  });

  const tableData = useMemo(() => data?.users ?? [], [data]);

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel()
  });

  const totalPages = Math.ceil((data?.total ?? 0) / limit);

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="relative w-full max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          placeholder="Search users by name or email..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="pl-9 h-11"
        />
      </div>

      <DataTable
        isLoading={isLoading}
        table={table}
        containerClassName="rounded-md overflow-hidden"
      />

      <div className="flex items-center justify-end gap-4 py-2">
        <Paragraph className="text-sm text-muted-foreground">
          Page {page} of {totalPages}
        </Paragraph>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="size-9"
          >
            <ChevronLeft className="size-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="size-9"
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
