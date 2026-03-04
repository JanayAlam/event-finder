"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/shared/shadcn-components/card";
import { cn } from "@/lib/utils";

interface IGrowthChartProps {
  growth:
    | {
        users: { _id: { month: number; year: number }; count: number }[];
        events: { _id: { month: number; year: number }; count: number }[];
      }
    | undefined;
}

export const GrowthChart: React.FC<IGrowthChartProps> = ({ growth }) => {
  return (
    <Card className="md:col-span-4 border-none shadow-lg bg-card/40 backdrop-blur-md">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Platform Growth</CardTitle>
        <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-primary" />
            Users
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-orange-500" />
            Events
          </div>
        </div>
      </CardHeader>
      <CardContent className="h-[300px] flex flex-col justify-end gap-2 border-t border-border/50 pt-8 mt-2">
        <div className="flex items-end justify-between h-full px-4 gap-4">
          {growth?.users.map((item, i) => {
            const userMax = Math.max(...growth.users.map((u) => u.count), 1);
            const eventMax = Math.max(...growth.events.map((e) => e.count), 1);
            const max = Math.max(userMax, eventMax);

            const userHeight = (item.count / max) * 100;
            const eventCount =
              growth.events.find(
                (e) =>
                  e._id.month === item._id.month && e._id.year === item._id.year
              )?.count || 0;
            const eventHeight = (eventCount / max) * 100;

            const monthName = new Date(2000, item._id.month - 1).toLocaleString(
              "default",
              { month: "short" }
            );

            return (
              <div
                key={i}
                className="flex-1 flex flex-col items-center gap-3 group"
              >
                <div className="w-full flex items-end justify-center gap-1 h-full">
                  <div
                    className={cn(
                      "w-1/3 bg-primary/40 hover:bg-primary transition-all duration-500 rounded-t-sm relative group/bar"
                    )}
                    style={{ height: `${Math.max(userHeight, 2)}%` }}
                  >
                    <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground px-2 py-1 rounded text-[10px] font-bold opacity-0 group-hover/bar:opacity-100 transition-opacity shadow-xl border border-border z-20 whitespace-nowrap">
                      {item.count} Users
                    </div>
                  </div>
                  <div
                    className={cn(
                      "w-1/3 bg-orange-500/40 hover:bg-orange-500 transition-all duration-500 rounded-t-sm relative group/bar"
                    )}
                    style={{ height: `${Math.max(eventHeight, 2)}%` }}
                  >
                    <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground px-2 py-1 rounded text-[10px] font-bold opacity-0 group-hover/bar:opacity-100 transition-opacity shadow-xl border border-border z-20 whitespace-nowrap">
                      {eventCount} Events
                    </div>
                  </div>
                </div>
                <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">
                  {monthName}
                </span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
