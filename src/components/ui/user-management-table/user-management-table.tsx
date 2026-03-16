"use client";

import { DataTable } from "@/components/shared/organisms/data-table/data-table";
import { Input } from "@/components/shared/shadcn-components/input";
import UserRepository from "@/repositories/user.repository";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Search } from "lucide-react";
import React, { useMemo, useState } from "react";
import { toast } from "sonner";
import { useDebounce } from "use-debounce";
import { createUserManagementTableColumns } from "./columns";

export const UserManagementTable: React.FC = () => {
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [debouncedSearch] = useDebounce(search, 500);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-users", debouncedSearch, page],
    queryFn: () =>
      UserRepository.getAllUsers({
        search: debouncedSearch || undefined,
        page,
        limit: 10
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

  const columns = useMemo(
    () =>
      createUserManagementTableColumns({
        onBlock: (id) => mutateBlock(id),
        onUnblock: (id) => mutateUnblock(id)
      }),
    [mutateBlock, mutateUnblock]
  );

  const tableData = useMemo(() => data?.users ?? [], [data]);

  const totalPages = Math.ceil((data?.total ?? 0) / (data?.limit ?? 10));

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
        data={tableData}
        columns={columns}
        className="rounded-md"
        pagination={{
          page,
          totalPages,
          onPageChange: (p) => setPage(p)
        }}
      />
    </div>
  );
};
