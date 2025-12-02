"use client";

import { ColumnDef } from "@tanstack/react-table";

export type TPendingAccountVerificationReviewsColumn = {
  name?: string;
  createdAt: string;
  email: string;
};

export const columns: ColumnDef<TPendingAccountVerificationReviewsColumn>[] = [
  {
    accessorKey: "name",
    header: "Name"
  },
  {
    accessorKey: "email",
    header: "Email address"
  },
  {
    accessorKey: "createdAt",
    header: "Requested at"
  }
];
