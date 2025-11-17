import { cn } from "@/utils/tailwind-utils";
import React, { PropsWithChildren } from "react";

type TH4Props = React.ComponentProps<"h4"> & PropsWithChildren;

export const H4: React.FC<TH4Props> = ({ className, children, ...rest }) => {
  return (
    <h3
      className={cn(
        "scroll-m-20 text-xl font-semibold tracking-tight",
        className
      )}
      {...rest}
    >
      {children}
    </h3>
  );
};
