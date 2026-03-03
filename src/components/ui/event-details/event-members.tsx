import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from "@/components/shared/shadcn-components/avatar";
import { Empty, EmptyTitle } from "@/components/shared/shadcn-components/empty";
import { Separator } from "@/components/shared/shadcn-components/separator";
import {
  H4,
  Paragraph
} from "@/components/shared/shadcn-components/typography";
import { getImageUrl } from "@/lib/utils";
import { PUBLIC_DYNAMIC_PAGE_ROUTE } from "@/routes";
import Link from "next/link";
import React from "react";
import { TEventDetail } from "../../../../server/models/event.model";
import { TUserWithProfile } from "../../../../server/models/user.model";

interface IMemberCardProps {
  member: TUserWithProfile;
}

const MemberCard: React.FC<IMemberCardProps> = ({ member }) => (
  <Link
    href={PUBLIC_DYNAMIC_PAGE_ROUTE.PROFILE(
      member.profile?._id.toString() || "#"
    )}
  >
    <div className="flex items-center gap-3 p-3 border rounded-lg">
      <Avatar className="w-10 h-10 shrink-0">
        <AvatarImage
          src={getImageUrl(member.profile?.profileImage, {
            name: member.profile?.firstName
          })}
          alt={`${member.profile?.firstName} ${member.profile?.lastName}`}
          className="object-cover"
        />
        <AvatarFallback className="bg-secondary font-bold">
          {`${member.profile?.firstName?.[0]} ${member.profile?.lastName?.[0]}`}
        </AvatarFallback>
      </Avatar>
      <Paragraph className="font-medium text-sm mt-0!">
        {`${member.profile?.firstName} ${member.profile?.lastName}`}
      </Paragraph>
    </div>
  </Link>
);

interface IEventMembersProps {
  event: TEventDetail;
}

export const EventMembers: React.FC<IEventMembersProps> = ({ event }) => {
  const otherMembers = event.members.filter(
    (m) => m._id.toString() !== event.host?._id.toString()
  );

  return (
    <div className="flex flex-col gap-10">
      {/* Host Section */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <H4>Host</H4>
          <Separator />
        </div>
        {event.host ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <MemberCard member={event.host} />
          </div>
        ) : (
          <Empty className="py-8">
            <EmptyTitle>No host assigned</EmptyTitle>
          </Empty>
        )}
      </div>

      {/* Members Section */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <H4>Members ({otherMembers.length})</H4>
          <Separator />
        </div>
        {otherMembers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {otherMembers.map((member) => (
              <MemberCard key={member._id.toString()} member={member} />
            ))}
          </div>
        ) : (
          <Empty className="py-8">
            <EmptyTitle>No other members yet</EmptyTitle>
          </Empty>
        )}
      </div>
    </div>
  );
};
