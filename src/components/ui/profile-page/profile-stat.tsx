import { TypographyMuted } from "@/components/shared/shadcn-components/typography";
import React from "react";

interface ProfileStatProps {
  value: string | number;
  label: string;
}

export const ProfileStat: React.FC<ProfileStatProps> = ({ value, label }) => {
  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-3xl font-bold">{value}</span>
      <TypographyMuted className="text-xs">{label}</TypographyMuted>
    </div>
  );
};
