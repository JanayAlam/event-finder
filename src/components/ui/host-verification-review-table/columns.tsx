import { IDataTableColumn } from "@/components/shared/organisms/data-table/data-table";
import { Button } from "@/components/shared/shadcn-components/button";
import { Paragraph } from "@/components/shared/shadcn-components/typography";
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
): IDataTableColumn<TPendingHostRequestTableColumn>[] => [
  {
    header: <span className="px-2">First name</span>,
    cell: (item) => (
      <Paragraph className="font-medium px-2">{item.firstName}</Paragraph>
    )
  },
  {
    header: "Last name",
    cell: (item) => (
      <Paragraph className="font-medium">{item.lastName}</Paragraph>
    )
  },
  {
    header: "Date of birth",
    cell: (item) => (
      <Paragraph className="font-medium">{item.dateOfBirth}</Paragraph>
    )
  },
  {
    header: "Email address",
    cell: (item) => <Paragraph>{item.email}</Paragraph>
  },
  {
    header: "Requested at",
    cell: (item) => <Paragraph>{item.requestedAt}</Paragraph>
  },
  {
    header: "Verification details",
    className: "text-center",
    cell: (item) => {
      return (
        <div className="flex justify-center">
          <Button
            variant="outline"
            onClick={() => {
              handlers.onView(item.promotionPendingId);
            }}
          >
            Details
          </Button>
        </div>
      );
    }
  },
  {
    header: "Actions",
    className: "text-center",
    cell: (item) => {
      return (
        <div className="flex gap-2 items-center justify-center">
          <Button
            size="icon"
            variant="outline"
            className="bg-success/10! border border-success! text-success hover:text-success"
            title="Accept request"
            onClick={() => handlers.onAccept(item.promotionPendingId)}
          >
            <CircleCheckBig className="size-4" />
          </Button>
          <Button
            size="icon"
            variant="outline"
            className="bg-destructive/10! border border-destructive! text-destructive hover:text-destructive"
            title="Reject request"
            onClick={() => handlers.onReject(item.promotionPendingId)}
          >
            <Ban className="size-4" />
          </Button>
        </div>
      );
    }
  }
];
