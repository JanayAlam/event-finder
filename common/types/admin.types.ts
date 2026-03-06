import { TEvent } from "../../server/models/event.model";
import { TPayment } from "../../server/models/payment.model";
import { TProfile } from "../../server/models/profile.model";
import { TUser } from "../../server/models/user.model";

type TAdminProfileSummaryDto = Pick<TProfile, "_id" | "firstName" | "lastName">;

type TAdminUserSummaryDto = Pick<TUser, "_id" | "email"> & {
  profile: TAdminProfileSummaryDto | null;
};

export type TAdminEventPaymentDto = Omit<
  TPayment,
  "user" | "event" | "gatewayResponse" | "valId" | "updatedAt"
> & {
  user: TAdminUserSummaryDto;
};

export type TAdminEventListItemDto = Pick<
  TEvent,
  "_id" | "title" | "placeName" | "entryFee" | "status" | "createdAt"
> & {
  host: TAdminUserSummaryDto | null;
  memberCount: number;
  totalCollection: number;
  payments: TAdminEventPaymentDto[];
};

export type TAdminEventListResponseDto = {
  events: TAdminEventListItemDto[];
  total: number;
  page: number;
  limit: number;
};
