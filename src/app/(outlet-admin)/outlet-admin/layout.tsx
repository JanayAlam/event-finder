import AdminNavbar from "@/components/ui/navbars/admin-navbar";
import OutletAdminDashboardSidebar from "@/components/ui/sidebars/outlet-admin-dashboard-sidebar";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Outlet Admin | Bhalo Thaki",
  description: "Bhalo Thaki's outlet admin dashboard"
};

export default function OutletAdminDashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex flex-row">
      <OutletAdminDashboardSidebar />
      <div>
        <AdminNavbar />
        {children}
      </div>
    </main>
  );
}
