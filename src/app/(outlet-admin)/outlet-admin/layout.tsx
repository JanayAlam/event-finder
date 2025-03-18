"use client";

import AdminNavigationLayout from "@/components/shared/layouts/admin-navigation-layout";
import Head from "next/head";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { getSidebarMenuItems } from "./getSidebarMenuItems";

export default function OutletAdminDashboardLayout({
  children
}: React.PropsWithChildren) {
  const pathname = usePathname();
  const paths = pathname.split("/");
  const slugLevel1 = paths[2];
  const slugLevel2 = paths[3];

  const selectedKey = `${slugLevel1}${slugLevel2 ? `-${slugLevel2}` : ""}`;
  const [selectedKeys, setSelectedKeys] = useState<string[]>([selectedKey]);
  const [openKeys, setOpenKeys] = useState<string[]>([slugLevel1]);

  useEffect(() => {
    const { pathname } = location;
    const paths = pathname.split("/");
    const slugLevel1 = paths[2];
    const slugLevel2 = paths[3];
    const selectedKey = `${slugLevel1}${slugLevel2 ? `-${slugLevel2}` : ""}`;
    setOpenKeys((prev) => [...prev, slugLevel1]);
    setSelectedKeys([selectedKey]);
  }, [location]);

  const onOpenChange = (keys: string[]) => {
    setOpenKeys(keys);
  };

  const onSelectMenu = (menu: any) => {
    setSelectedKeys(menu.selectedKeys);
  };

  const items = getSidebarMenuItems(selectedKey);

  return (
    <>
      <Head>
        <title>Outlet Admin | Bhalo Thaki</title>
        <meta
          name="description"
          content="Bhalo Thaki's outlet admin dashboard"
        />
      </Head>

      <AdminNavigationLayout
        defaultSelectedKeys={["dashboard"]}
        defaultOpenKeys={["dashboard"]}
        openKeys={openKeys}
        selectedKeys={selectedKeys}
        onOpenChange={onOpenChange}
        onSelect={onSelectMenu}
        items={items}
      >
        <div className="min-h-[calc(100vh-60px)] bg-background-2 p-5">
          {children}
        </div>
      </AdminNavigationLayout>
    </>
  );
}
