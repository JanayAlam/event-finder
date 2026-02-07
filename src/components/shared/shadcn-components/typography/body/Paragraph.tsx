import { cn } from "@/lib/utils";
import React, { PropsWithChildren } from "react";

export type TParagraphProps = PropsWithChildren & {
  className?: string;
};

export const Paragraph: React.FC<TParagraphProps> = ({
  className,
  children
}) => {
  return (
    <p className={cn("leading-7 not-first:mt-6", className)}>{children}</p>
  );
};
