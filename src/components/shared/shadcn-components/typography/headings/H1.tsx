import { cn } from "@/lib/utils";
import React, { PropsWithChildren } from "react";

type TH1Props = React.ComponentProps<"h1"> & PropsWithChildren;

export const H1: React.FC<TH1Props> = ({ className, children, ...rest }) => {
  return (
    <h1
      className={cn(
        "text-4xl font-extrabold tracking-tight text-balance",
        className
      )}
      {...rest}
    >
      {children}
    </h1>
  );
};
