import { DataTableColumnHeader } from "@/components/shared/organisms/data-table";
import { Badge } from "@/components/shared/shadcn-components/badge";
import { Button } from "@/components/shared/shadcn-components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/shared/shadcn-components/dropdown-menu";
import { Paragraph } from "@/components/shared/shadcn-components/typography";
import { TUserWithProfile } from "@/repositories/user.repository";
import { ColumnDef } from "@tanstack/react-table";
import { EllipsisVertical } from "lucide-react";
import { VERIFICATION_STATUS } from "../../../../common/types";
import { USER_ROLE } from "../../../../server/enums";

export type TColumnHandlers = {
  onBlock: (userId: string) => void;
  onUnblock: (userId: string) => void;
};

export const createColumns = (
  handlers: TColumnHandlers
): ColumnDef<TUserWithProfile>[] => [
  {
    accessorKey: "fullName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Full name" />
    ),
    cell: ({ row }) => {
      const user = row.original;
      const fullName = `${user.profile?.firstName ?? ""} ${user.profile?.lastName ?? ""}`;
      return (
        <div className="flex items-center gap-2">
          <Paragraph className="font-medium">{fullName}</Paragraph>
          {user.isBlocked && (
            <Badge
              variant="destructive"
              className="h-5 px-1.5 py-0 text-[10px] uppercase font-bold"
            >
              Blocked
            </Badge>
          )}
        </div>
      );
    },
    enableSorting: false
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }) => <Paragraph>{row.original.email}</Paragraph>,
    enableSorting: false
  },
  {
    accessorKey: "role",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Role" />
    ),
    cell: ({ row }) => {
      const role = row.original.role;
      return (
        <Badge
          variant={
            role === USER_ROLE.ADMIN
              ? "default"
              : role === USER_ROLE.HOST
                ? "secondary"
                : "outline"
          }
          className="capitalize"
        >
          {role}
        </Badge>
      );
    },
    enableSorting: false
  },
  {
    accessorKey: "verificationStatus",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Verification" />
    ),
    cell: ({ row }) => {
      const status =
        row.original.accountVerification?.status ??
        VERIFICATION_STATUS.NOT_INITIATED;

      const getVariant = (s: VERIFICATION_STATUS) => {
        switch (s) {
          case VERIFICATION_STATUS.VERIFIED:
            return "default";
          case VERIFICATION_STATUS.PENDING:
            return "secondary";
          case VERIFICATION_STATUS.DECLINED:
            return "destructive";
          default:
            return "outline";
        }
      };

      return (
        <Badge variant={getVariant(status)} className="capitalize">
          {status.replace("_", " ")}
        </Badge>
      );
    },
    enableSorting: false
  },
  {
    id: "actions",
    enableHiding: false,
    size: 60,
    cell: ({ row }) => {
      const user = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <EllipsisVertical />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {user.isBlocked ? (
              <DropdownMenuItem
                onClick={() => handlers.onUnblock(user._id.toString())}
              >
                Unblock
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem
                onClick={() => handlers.onBlock(user._id.toString())}
                className="text-destructive focus:text-destructive"
              >
                Block
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }
  }
];
