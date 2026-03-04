"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/shared/shadcn-components/card";

interface ITopDestinationsProps {
  locations: { _id: string; count: number }[] | undefined;
}

export const TopDestinations: React.FC<ITopDestinationsProps> = ({
  locations
}) => {
  return (
    <Card className="md:col-span-3 border-none shadow-lg bg-card/40 backdrop-blur-md">
      <CardHeader>
        <CardTitle>Top Destinations</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {locations?.length ? (
          locations.map((loc, i) => (
            <div key={i} className="flex items-center justify-between group">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-500 font-bold text-xs ring-1 ring-orange-500/20 transition-transform duration-300">
                  {i + 1}
                </div>
                <span className="text-sm font-medium">{loc._id}</span>
              </div>
              <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground bg-muted/50 px-2.5 py-1 rounded-md border border-border/50">
                {loc.count} Events
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-10 text-muted-foreground text-sm">
            No destination data available
          </div>
        )}
      </CardContent>
    </Card>
  );
};
