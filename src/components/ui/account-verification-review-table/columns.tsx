import { DataTableColumnHeader } from "@/components/shared/organisms/data-table";
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from "@/components/shared/shadcn-components/avatar";
import { Button } from "@/components/shared/shadcn-components/button";
import { Checkbox } from "@/components/shared/shadcn-components/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/shared/shadcn-components/dropdown-menu";
import { Paragraph } from "@/components/shared/shadcn-components/typography";
import { ColumnDef } from "@tanstack/react-table";
import { EllipsisVertical } from "lucide-react";

export type TPendingReviewTableColumn = {
  accountVerificationId: string;
  name: string;
  email: string;
  requestedAt: string;
};

export type TColumnHandlers = {
  onView: (accountVerificationId: string) => void;
  onAccept: (accountVerificationId: string) => void;
  onDecline: (accountVerificationId: string) => void;
};

export const createColumns = (
  handlers: TColumnHandlers
): ColumnDef<TPendingReviewTableColumn>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
    size: 40
  },
  {
    accessorKey: "name",
    enableSorting: false,
    enableHiding: false,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Account" />
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Avatar>
          <AvatarImage
            src={`https://ui-avatars.com/api/?name=${row.getValue("name")}`}
            alt="User profile picture"
          />
          <AvatarFallback>{row.getValue("name")}</AvatarFallback>
        </Avatar>
        <Paragraph className="font-medium">{row.getValue("name")}</Paragraph>
      </div>
    )
  },
  {
    accessorKey: "email",
    enableSorting: false,
    enableHiding: false,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email address" />
    ),
    cell: ({ row }) => <Paragraph>{row.getValue("email")}</Paragraph>
  },
  {
    accessorKey: "requestedAt",
    enableHiding: false,
    enableSorting: false,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Requested at" />
    ),
    cell: ({ row }) => <Paragraph>{row.getValue("requestedAt")}</Paragraph>
  },
  {
    id: "actions",
    enableHiding: false,
    size: 60,
    cell: ({ row }) => {
      const verification = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <EllipsisVertical />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() =>
                handlers.onView(verification.accountVerificationId)
              }
            >
              View
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                handlers.onAccept(verification.accountVerificationId)
              }
            >
              Accept
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                handlers.onDecline(verification.accountVerificationId)
              }
            >
              Decline
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }
  }
];
