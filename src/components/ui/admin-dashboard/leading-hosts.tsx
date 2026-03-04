"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/shared/shadcn-components/card";

interface ILeadingHostsProps {
  hosts: { id: string; email: string; eventCount: number }[] | undefined;
}

export const LeadingHosts: React.FC<ILeadingHostsProps> = ({ hosts }) => {
  return (
    <Card className="md:col-span-3 border-none shadow-lg bg-card/40 backdrop-blur-md">
      <CardHeader>
        <CardTitle>Leading Hosts</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {hosts?.length ? (
          hosts.map((host, i) => (
            <div key={i} className="flex items-center justify-between group">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500 font-bold text-xs ring-1 ring-blue-500/20">
                  {i + 1}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium truncate max-w-[150px]">
                    {host.email.split("@")[0]}
                  </span>
                  <span className="text-[10px] text-muted-foreground truncate max-w-[150px]">
                    {host.email}
                  </span>
                </div>
              </div>
              <div className="text-[10px] font-black uppercase tracking-widest text-primary bg-primary/10 px-2.5 py-1 rounded-md border border-primary/20">
                {host.eventCount} Organized
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-10 text-muted-foreground text-sm">
            No host data available
          </div>
        )}
      </CardContent>
    </Card>
  );
};
