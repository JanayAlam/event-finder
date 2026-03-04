"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/shared/shadcn-components/card";
import { cn } from "@/lib/utils";
import { ArrowRight, LucideIcon } from "lucide-react";
import Link from "next/link";

interface IStatCardProps {
  title: string;
  value: number | string;
  description: string;
  icon: LucideIcon;
  color: string;
  bg: string;
  bgFullOpacity: string;
  link?: string;
}

export const StatCard: React.FC<IStatCardProps> = ({
  title,
  value,
  description,
  icon: Icon,
  color,
  bg,
  bgFullOpacity,
  link
}) => {
  return (
    <Card className="group relative overflow-hidden border-none shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-card/40 backdrop-blur-md border border-white/10">
      <div
        className={cn(
          "absolute top-0 right-0 w-32 h-32 -mr-12 -mt-12 rounded-full blur-3xl opacity-20 transition-all duration-700 group-hover:opacity-40 group-hover:scale-110",
          bgFullOpacity
        )}
      />

      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 relative z-10">
        <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground sm:max-w-[130px]">
          {title}
        </CardTitle>
        <div
          className={cn(
            "p-3 rounded-xl shadow-inner transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3",
            bg
          )}
        >
          <Icon className={cn("h-5 w-5", color)} />
        </div>
      </CardHeader>

      <CardContent className="relative z-10 flex flex-col gap-2">
        <div className="text-3xl font-bold tracking-tight">{value}</div>
        <p className="text-xs text-muted-foreground mt-2 font-medium">
          {description}
        </p>

        {link && (
          <Link
            href={link}
            className={cn(
              "mt-4 flex items-center text-xs font-bold text-primary opacity-0 transform translate-x-[-10px] transition-all duration-300",
              "group-hover:opacity-100 group-hover:translate-x-0"
            )}
          >
            View Details <ArrowRight className="ml-1 h-3 w-3" />
          </Link>
        )}
      </CardContent>
    </Card>
  );
};
