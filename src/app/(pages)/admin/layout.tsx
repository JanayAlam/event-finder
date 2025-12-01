import React from "react";

import {
  Sidebar,
  SidebarInset,
  SidebarProvider,
  SidebarTrigger
} from "@/components/shared/shadcn-components/sidebar";

import AdminSidebar from "@/components/ui/admin-sidebar/AdminSidebar";
import { cn } from "@/utils/tailwind-utils";

export default function AdminDashboardLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <AdminSidebar />
      </Sidebar>

      <SidebarInset>
        <header className="flex h-14 items-center gap-2 border-b bg-background/80 px-4 backdrop-blur-sm">
          <SidebarTrigger />
          <div className={cn("text-base font-bold")}>
            <span>TripMate Admin</span>
          </div>
        </header>

        <main>{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
