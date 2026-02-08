import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from "@/components/shared/shadcn-components/avatar";
import { Badge } from "@/components/shared/shadcn-components/badge";
import { Card } from "@/components/shared/shadcn-components/card";
import { Separator } from "@/components/shared/shadcn-components/separator";
import {
  H3,
  TypographyMuted
} from "@/components/shared/shadcn-components/typography";
import { cn, getImageUrl } from "@/lib/utils";
import dayjs from "dayjs";
import { Calendar, Star, User as UserIcon } from "lucide-react";
import React from "react";
import { TProfile } from "../../../../server/models/profile.model";
import { TUser } from "../../../../server/models/user.model";
import { ProfileStat } from "./profile-stat";

interface ProfileHeaderProps {
  user: TUser & { profile: TProfile | null };
  stats: {
    tripsJoined: number;
    eventsHosted: number;
    rating: number;
    memberSinceYears: number;
  };
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  user,
  stats
}) => {
  const profile = user.profile;
  const fullName = profile
    ? `${profile.firstName} ${profile.lastName}`.trim()
    : "Unknown User";

  const genderLabel = profile?.gender
    ? profile.gender === "male"
      ? "Male"
      : profile.gender === "female"
        ? "Female"
        : profile.gender === "other"
          ? "Other"
          : "Unspecified"
    : undefined;

  const formattedDateOfBirth = profile?.dateOfBirth
    ? dayjs(profile.dateOfBirth).format("MMM DD, YYYY")
    : undefined;

  const joinedDate = dayjs(user.createdAt).format("MMM YYYY");

  return (
    <Card className="rounded-xl border-none shadow-none bg-input/20 dark:bg-input/15">
      <div
        className={cn(
          "py-4 sm:py-10 px-4 sm:px-20 lg:px-40",
          "flex flex-col sm:flex-row items-center gap-6"
        )}
      >
        <Avatar className="h-30 w-30">
          <AvatarImage
            src={
              getImageUrl(profile?.profileImage, {
                name: fullName
              }) || undefined
            }
            alt="User profile picture"
          />
          <AvatarFallback className="text-sm">
            {fullName.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="w-full flex flex-col items-center gap-2 sm:items-start text-center sm:text-left">
          <div className="flex items-center gap-2">
            <H3 className="font-bold">{fullName}</H3>
            {user.role === "host" && (
              <Badge variant="secondary" className="bg-info/50">
                Host
              </Badge>
            )}
          </div>
          <TypographyMuted>{user.email}</TypographyMuted>

          <div className="flex flex-wrap justify-center sm:justify-start gap-4 mt-2 text-sm text-muted-foreground">
            {formattedDateOfBirth && (
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <TypographyMuted>{formattedDateOfBirth}</TypographyMuted>
              </div>
            )}
            {genderLabel && (
              <div className="flex items-center gap-1">
                <UserIcon className="h-4 w-4" />
                <TypographyMuted>{genderLabel}</TypographyMuted>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <TypographyMuted>Joined {joinedDate}</TypographyMuted>
            </div>
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-primary text-primary" />
              <TypographyMuted>{stats.rating} Rating</TypographyMuted>
            </div>
          </div>

          <Separator className="my-2" />

          <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-6 mt-2">
            <ProfileStat value={stats.tripsJoined} label="Trips Joined" />
            <ProfileStat value={stats.eventsHosted} label="Events Hosted" />
            <ProfileStat value={stats.rating} label="Rating" />
            <ProfileStat
              value={`${stats.memberSinceYears}m.`}
              label="Member Since"
            />
          </div>
        </div>
      </div>
    </Card>
  );
};
