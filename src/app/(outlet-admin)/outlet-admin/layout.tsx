import AdminNavigationLayout from "@/components/shared/layouts/admin-navigation-layout";
import Head from "next/head";
import React from "react";

export default function OutletAdminDashboardLayout({
  children
}: React.PropsWithChildren) {
  return (
    <>
      <Head>
        <title>Outlet Admin | Bhalo Thaki</title>
        <meta
          name="description"
          content="Bhalo Thaki's outlet admin dashboard"
        />
      </Head>

      <AdminNavigationLayout>
        <div className="min-h-[calc(100vh-60px)] bg-background-2 p-5">
          {children}
        </div>
      </AdminNavigationLayout>
    </>
  );
}
