import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Card as ShadCNCard
} from "@/components/shared/shadcn-components/card";
import { H3 } from "@/components/shared/shadcn-components/typography";
import { cn } from "@/utils/tailwind-utils";
import React, { PropsWithChildren } from "react";

type TSettingsCardProps = PropsWithChildren & {
  title?: string | React.ReactNode;
  description?: string;
  rootClassName?: string;
  headerClassName?: string;
  bodyClassName?: string;
};

const Card: React.FC<TSettingsCardProps> = ({
  title,
  description,
  children,
  rootClassName,
  headerClassName,
  bodyClassName
}) => {
  return (
    <ShadCNCard className={rootClassName}>
      {title || description ? (
        <CardHeader className={headerClassName}>
          {title ? (
            <CardTitle>
              {typeof title === "string" ? <H3>{title}</H3> : title}
            </CardTitle>
          ) : null}
          {description ? (
            <CardDescription>{description}</CardDescription>
          ) : null}
        </CardHeader>
      ) : null}
      {children ? (
        <CardContent className={cn(bodyClassName)}>{children}</CardContent>
      ) : null}
    </ShadCNCard>
  );
};

export default Card;
