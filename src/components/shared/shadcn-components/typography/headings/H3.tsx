import { cn } from "@/utils/tailwind-utils";
import React, { PropsWithChildren } from "react";

type TH3Props = React.ComponentProps<"h3"> & PropsWithChildren;

export const H3: React.FC<TH3Props> = ({ className, children, ...rest }) => {
  return (
    <h3
      className={cn(
        "scroll-m-20 text-2xl font-semibold tracking-tight",
        className
      )}
      {...rest}
    >
      {children}
    </h3>
  );
};
