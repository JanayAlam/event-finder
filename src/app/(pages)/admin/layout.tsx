import React from "react";

import {
  Sidebar,
  SidebarInset,
  SidebarProvider,
  SidebarTrigger
} from "@/components/shared/shadcn-components/sidebar";

import { Button } from "@/components/shared/shadcn-components/button";
import AdminSidebar from "@/components/ui/admin-sidebar/AdminSidebar";
import ThemeToggleButton from "@/components/ui/theme-toggle-button";
import { PAGE_WIDTH_CLASS_NAME } from "@/constants";
import { cn } from "@/utils/tailwind-utils";
import { Bell } from "lucide-react";

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
        <header className="flex h-14 border-b bg-background/80 px-4 backdrop-blur-sm items-center justify-between">
          <div className="flex items-center gap-2">
            <SidebarTrigger />
            <div className={cn("text-base font-bold")}>
              <span>TripMate Admin</span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <Button variant="ghost">
              <Bell />
            </Button>
            <ThemeToggleButton />
          </div>
        </header>

        <main className="w-full flex items-center justify-center">
          <div
            className={cn(
              "py-4 sm:py-6 px-0! sm:px-6! mx-auto",
              PAGE_WIDTH_CLASS_NAME
            )}
          >
            {children}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
