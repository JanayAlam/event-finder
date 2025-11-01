import { cn } from "@/utils/tailwind-utils";
import React, { PropsWithChildren } from "react";

export interface ITypographyMutedProps extends PropsWithChildren {
  className?: string;
}

export const TypographyMuted: React.FC<ITypographyMutedProps> = (props) => {
  return (
    <p className={cn("text-muted-foreground", props.className)}>
      {props.children}
    </p>
  );
};
