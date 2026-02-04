import { IDataTableColumn } from "@/components/shared/organisms/data-table/DataTable";
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from "@/components/shared/shadcn-components/avatar";
import { Button } from "@/components/shared/shadcn-components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/shared/shadcn-components/dropdown-menu";
import { Paragraph } from "@/components/shared/shadcn-components/typography";
import { getUIAvatar } from "@/utils/avatars";
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
): IDataTableColumn<TPendingReviewTableColumn>[] => [
  {
    header: "Account",
    cell: (item) => (
      <div className="flex items-center gap-2">
        <Avatar className="size-8">
          <AvatarImage
            src={getUIAvatar(item.name)}
            alt="User profile picture"
          />
          <AvatarFallback>{item.name.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <Paragraph className="font-medium">{item.name}</Paragraph>
      </div>
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
    header: "",
    className: "w-[50px] text-right",
    cell: (item) => {
      return (
        <div className="flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="size-8">
                <EllipsisVertical className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => handlers.onView(item.accountVerificationId)}
              >
                View
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handlers.onAccept(item.accountVerificationId)}
              >
                Accept
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handlers.onDecline(item.accountVerificationId)}
              >
                Decline
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    }
  }
];
