"use client";

import { TypographyMuted } from "@/components/shared/shadcn-components/typography";
import type { LucideIcon } from "lucide-react";

type AIFeatureCardProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  className?: string;
};

export function AIFeatureCard({
  icon: Icon,
  title,
  description,
  className
}: AIFeatureCardProps) {
  return (
    <div
      className={[
        "rounded-lg border border-border/40 bg-background/60 p-4 flex flex-col gap-2",
        className
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="flex items-center gap-2 text-foreground">
        <Icon className="h-4 w-4 text-primary" />
        <span className="text-sm font-medium">{title}</span>
      </div>
      <TypographyMuted className="mt-2 text-sm">{description}</TypographyMuted>
    </div>
  );
}
