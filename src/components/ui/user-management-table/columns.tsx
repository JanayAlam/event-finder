import { IDataTableColumn } from "@/components/shared/organisms/data-table/data-table";
import { Badge } from "@/components/shared/shadcn-components/badge";
import { Button } from "@/components/shared/shadcn-components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/shared/shadcn-components/dropdown-menu";
import { Paragraph } from "@/components/shared/shadcn-components/typography";
import { TUserWithProfileAndAccountVerification } from "@/repositories/user.repository";
import { PUBLIC_DYNAMIC_PAGE_ROUTE } from "@/routes";
import { EllipsisVertical } from "lucide-react";
import Link from "next/link";
import { VERIFICATION_STATUS } from "../../../../common/types";
import {
  ACCOUNT_VERIFICATION_STATUS,
  USER_ROLE
} from "../../../../server/enums";

export type TColumnHandlers = {
  onBlock: (userId: string) => void;
  onUnblock: (userId: string) => void;
};

export const createColumns = (
  handlers: TColumnHandlers
): IDataTableColumn<TUserWithProfileAndAccountVerification>[] => [
  {
    header: <span className="px-2">Full name</span>,
    cell: (user) => {
      const fullName = `${user.profile?.firstName ?? ""} ${user.profile?.lastName ?? ""}`;
      return (
        <div className="flex items-center gap-2 px-2">
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
    }
  },
  {
    header: "Email",
    cell: (user) => <Paragraph>{user.email}</Paragraph>
  },
  {
    header: "Role",
    cell: (user) => {
      const role = user.role;
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
    }
  },
  {
    header: "Verification",
    cell: (user) => {
      const accountVerification = user.accountVerification;
      let status = VERIFICATION_STATUS.NOT_INITIATED;

      if (accountVerification) {
        if (!accountVerification.isReviewed) {
          status = VERIFICATION_STATUS.PENDING;
        } else {
          const reviews = accountVerification.reviews || [];
          const hasPositiveReview = reviews.some(
            (r) => r.status !== ACCOUNT_VERIFICATION_STATUS.DECLINED
          );

          if (hasPositiveReview) {
            status = VERIFICATION_STATUS.VERIFIED;
          } else if (reviews.length > 0) {
            status = VERIFICATION_STATUS.DECLINED;
          }
        }
      } else {
        return null;
      }

      const getVariant = (
        s: VERIFICATION_STATUS
      ): "default" | "secondary" | "destructive" | "outline" | "success" => {
        switch (s) {
          case VERIFICATION_STATUS.VERIFIED:
            return "success";
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
    }
  },
  {
    header: "",
    className: "w-[50px] text-right",
    cell: (user) => {
      const profileUrl = user.profile?._id
        ? PUBLIC_DYNAMIC_PAGE_ROUTE.PROFILE(user.profile._id.toString())
        : null;

      return (
        <div className="flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="size-8">
                <EllipsisVertical className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {profileUrl && (
                <Link href={profileUrl}>
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                </Link>
              )}
              {user.role === USER_ROLE.ADMIN && (
                <>
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
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    }
  }
];
