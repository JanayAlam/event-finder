import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Card as ShadCNCard
} from "@/components/shared/shadcn-components/card";
import { H3 } from "@/components/shared/shadcn-components/typography";
import { cn } from "@/lib/utils";
import React, { PropsWithChildren } from "react";

type TSettingsCardProps = PropsWithChildren & {
  title?: string | React.ReactNode;
  description?: string;
  rootClassName?: string;
  headerClassName?: string;
  bodyClassName?: string;
  titleClassName?: string;
  descriptionClassName?: string;
};

const EFCard: React.FC<TSettingsCardProps> = ({
  title,
  description,
  children,
  rootClassName,
  headerClassName,
  bodyClassName,
  titleClassName,
  descriptionClassName
}) => {
  return (
    <ShadCNCard className={cn("shadow-none", rootClassName)}>
      {title || description ? (
        <CardHeader className={headerClassName}>
          {title ? (
            <CardTitle className={titleClassName}>
              {typeof title === "string" ? <H3>{title}</H3> : title}
            </CardTitle>
          ) : null}
          {description ? (
            <CardDescription className={descriptionClassName}>
              {description}
            </CardDescription>
          ) : null}
        </CardHeader>
      ) : null}
      {children ? (
        <CardContent
          className={cn(bodyClassName, !title && !description ? "pt-6" : null)}
        >
          {children}
        </CardContent>
      ) : null}
    </ShadCNCard>
  );
};

export default EFCard;
