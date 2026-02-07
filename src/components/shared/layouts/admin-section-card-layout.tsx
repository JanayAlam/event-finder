import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/shared/shadcn-components/card";
import React from "react";

interface AdminSectionCardLayoutProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export default function AdminSectionCardLayout({
  title,
  description,
  children
}: AdminSectionCardLayoutProps) {
  return (
    <Card className="border-l-0 border-r-0 rounded-none md:border-l md:border-r md:rounded-md">
      <CardHeader className="p-0 border-b pb-4 gap-1 sm:pb-4!">
        <CardTitle className="text-xl sm:text-2xl">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="p-0 pt-2">{children}</CardContent>
    </Card>
  );
}
