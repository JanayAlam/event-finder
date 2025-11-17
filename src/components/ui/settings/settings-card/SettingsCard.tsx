import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/shared/atoms/card";
import { H3 } from "@/components/shared/atoms/typography";
import React, { PropsWithChildren } from "react";

type TSettingsCardProps = PropsWithChildren & {
  title: string;
  description: string;
};

const SettingsCard: React.FC<TSettingsCardProps> = ({
  title,
  description,
  children
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <H3>{title}</H3>
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
};

export default SettingsCard;
