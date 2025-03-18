"use client";

import { MenuProps } from "rc-menu";
import React, { PropsWithChildren } from "react";
import AdminSideMenu from "./AdminSideMenu";
import AdminTopNavbar from "./AdminTopNavbar";

interface IProps extends PropsWithChildren {
  defaultSelectedKeys: string[];
  defaultOpenKeys: string[];
  openKeys: string[];
  selectedKeys: string[];
  onOpenChange: (keys: string[]) => void;
  onSelect: (menu: any) => void;
  items: MenuProps["items"];
}

const AdminNavigationLayout: React.FC<IProps> = ({
  children,
  defaultOpenKeys,
  defaultSelectedKeys,
  onOpenChange,
  onSelect,
  openKeys,
  selectedKeys,
  items
}) => {
  const menuProps = {
    defaultSelectedKeys: defaultSelectedKeys,
    defaultOpenKeys: defaultOpenKeys,
    openKeys: openKeys,
    selectedKeys: selectedKeys,
    onOpenChange: onOpenChange,
    onSelect: onSelect,
    items: items
  };

  return (
    <div className="flex flex-row">
      <aside className="hidden min-h-[100vh] w-[260px] py-[16px] md:flex md:flex-col md:gap-[8px] bg-background">
        <AdminSideMenu {...menuProps} />
      </aside>

      <section className="flex-1">
        <AdminTopNavbar {...menuProps} />
        {children}
      </section>
    </div>
  );
};

export default AdminNavigationLayout;
