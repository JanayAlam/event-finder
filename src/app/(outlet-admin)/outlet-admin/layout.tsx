import AdminNavigationLayout from "@/components/shared/layouts/admin-navigation-layout";
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
  return <AdminNavigationLayout>{children}</AdminNavigationLayout>;
}
