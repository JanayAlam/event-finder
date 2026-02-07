import { cn } from "@/lib/utils";
import React, { PropsWithChildren } from "react";

type TH2Props = React.ComponentProps<"h2"> & PropsWithChildren;

export const H2: React.FC<TH2Props> = ({ className, children, ...rest }) => {
  return (
    <h2
      className={cn(
        "text-3xl font-semibold tracking-tight first:mt-0",
        className
      )}
      {...rest}
    >
      {children}
    </h2>
  );
};
