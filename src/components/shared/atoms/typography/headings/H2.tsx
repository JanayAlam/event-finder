import { cn } from "@/utils/tailwind-utils";
import React, { PropsWithChildren } from "react";

type TH2Props = React.ComponentProps<"h2"> & PropsWithChildren;

export const H2: React.FC<TH2Props> = ({ className, children, ...rest }) => {
  return (
    <h2
      className={cn(
        "scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0",
        className
      )}
      {...rest}
    >
      {children}
    </h2>
  );
};
