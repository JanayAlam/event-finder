import { Paragraph } from "@/components/shared/shadcn-components/typography";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import React from "react";

interface IIconWithTextProps {
  icon: LucideIcon;
  text: string | React.ReactNode;
  className?: string;
  iconClassName?: string;
}

export const IconWithText: React.FC<IIconWithTextProps> = ({
  icon: Icon,
  text,
  className,
  iconClassName
}) => {
  return (
    <div
      className={cn(
        "flex items-center gap-1.5 text-muted-foreground",
        className
      )}
    >
      <Icon className={cn("size-4 shrink-0", iconClassName)} />
      <Paragraph className="text-sm">{text}</Paragraph>
    </div>
  );
};
