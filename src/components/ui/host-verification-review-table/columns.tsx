import { DataTableColumnHeader } from "@/components/shared/organisms/data-table";
import { Button } from "@/components/shared/shadcn-components/button";
import { Checkbox } from "@/components/shared/shadcn-components/checkbox";
import { Paragraph } from "@/components/shared/shadcn-components/typography";
import { ColumnDef } from "@tanstack/react-table";
import { Ban, CircleCheckBig } from "lucide-react";

export type TPendingHostRequestTableColumn = {
  promotionPendingId: string;
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: string;
  requestedAt: string;
};

export type TColumnHandlers = {
  onView: (promotionPendingId: string) => void;
  onAccept: (promotionPendingId: string) => void;
  onReject: (promotionPendingId: string) => void;
};

export const createColumns = (
  handlers: TColumnHandlers
): ColumnDef<TPendingHostRequestTableColumn>[] => [
  {
    accessorKey: "select",
    enableHiding: false,
    enableSorting: false,
    enableColumnFilter: false,
    size: 40,
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
    )
  },
  {
    accessorKey: "firstName",
    enableSorting: false,
    enableHiding: false,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="First name" />
    ),
    cell: ({ row }) => (
      <Paragraph className="font-medium">{row.getValue("firstName")}</Paragraph>
    )
  },
  {
    accessorKey: "lastName",
    enableSorting: false,
    enableHiding: false,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Last name" />
    ),
    cell: ({ row }) => (
      <Paragraph className="font-medium">{row.getValue("lastName")}</Paragraph>
    )
  },
  {
    accessorKey: "dateOfBirth",
    enableSorting: false,
    enableHiding: false,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date of birth" />
    ),
    cell: ({ row }) => (
      <Paragraph className="font-medium">
        {row.getValue("dateOfBirth")}
      </Paragraph>
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
    accessorKey: "details",
    enableHiding: false,
    enableSorting: false,
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Verification details"
        align="center"
      />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex justify-center">
          <Button
            variant="outline"
            onClick={() => {
              handlers.onView(row.original.promotionPendingId);
            }}
          >
            Details
          </Button>
        </div>
      );
    }
  },
  {
    id: "actions",
    enableHiding: false,
    size: 100,
    cell: ({ row }) => {
      return (
        <div className="flex gap-2 items-center justify-center">
          <Button
            size="icon"
            variant="outline"
            className="bg-success/10! border border-success! text-success hover:text-success"
            title="Accept request"
            onClick={() => handlers.onAccept(row.original.promotionPendingId)}
          >
            <CircleCheckBig />
          </Button>
          <Button
            size="icon"
            variant="outline"
            className="bg-destructive/10! border border-destructive! text-destructive hover:text-destructive"
            title="Reject request"
            onClick={() => handlers.onReject(row.original.promotionPendingId)}
          >
            <Ban />
          </Button>
        </div>
      );
    }
  }
];
