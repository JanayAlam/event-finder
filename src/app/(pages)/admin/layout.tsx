import React from "react";

import { TooltipProvider } from "@/components/shared/shadcn-components/tooltip";
import AdminSidebar from "@/components/ui/admin-dashboard/admin-sidebar";
import AdminTopBar from "@/components/ui/admin-dashboard/admin-top-bar";
import { PAGE_WIDTH_CLASS_NAME } from "@/constants";
import { SidebarStateProvider } from "@/hooks/use-sidebar-state";
import { cn } from "@/lib/utils";

export default function AdminLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <TooltipProvider>
      <SidebarStateProvider>
        <div className="flex h-screen w-full overflow-hidden">
          <AdminSidebar />
          <div className="flex flex-1 flex-col overflow-hidden">
            <AdminTopBar />
            <main className="flex-1 overflow-y-auto p-6">
              <div className="w-full flex justify-center">
                <div className={cn(PAGE_WIDTH_CLASS_NAME)}>{children}</div>
              </div>
            </main>
          </div>
        </div>
      </SidebarStateProvider>
    </TooltipProvider>
  );
}
