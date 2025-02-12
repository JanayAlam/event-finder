import AdminNavigationLayout from "@/components/shared/layouts/admin-navigation-layout";
import React from "react";

// export const metadata: Metadata = {
//   title: "Outlet Admin | Bhalo Thaki",
//   description: "Bhalo Thaki's outlet admin dashboard"
// };

export default function OutletAdminDashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminNavigationLayout>
      <div className="min-h-[calc(100vh-50px)] bg-background-2 p-5">
        {children}
      </div>
    </AdminNavigationLayout>
  );
}
