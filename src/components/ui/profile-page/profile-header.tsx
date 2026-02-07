import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from "@/components/shared/shadcn-components/avatar";
import { Card } from "@/components/shared/shadcn-components/card";
import {
  H3,
  TypographyMuted
} from "@/components/shared/shadcn-components/typography";
import { cn } from "@/lib/utils";
import { Calendar, Star } from "lucide-react";
import React from "react";

export const ProfileHeader: React.FC = () => {
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
            src={`https://ui-avatars.com/api/?name=${"Janay".substring(0, 2).toUpperCase()}`}
            alt="User profile picture"
          />
          <AvatarFallback className="text-sm">
            {"Janay".substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="flex flex-col items-center gap-2 sm:items-start text-center sm:text-left">
          <H3 className="font-bold">Janay Alam</H3>
          <TypographyMuted>janay@example.com</TypographyMuted>

          <div className="flex flex-wrap justify-center sm:justify-start gap-4 mt-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <TypographyMuted>Joined Jan 2024</TypographyMuted>
            </div>
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-primary text-primary" />
              <TypographyMuted>4.8 Rating</TypographyMuted>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
