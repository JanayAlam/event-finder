"use client";

import { Menu } from "antd";
import Image from "next/image";
import { MenuProps } from "rc-menu";
import React from "react";
import LogoSVG from "/public/logo/bhalothaki-logo-green.svg";

interface IProps {
  defaultSelectedKeys: string[];
  defaultOpenKeys: string[];
  openKeys: string[];
  selectedKeys: string[];
  onOpenChange: (keys: string[]) => void;
  onSelect: (menu: any) => void;
  items: MenuProps["items"];
}

const AdminSideMenu: React.FC<IProps> = ({
  defaultOpenKeys,
  defaultSelectedKeys,
  onOpenChange,
  onSelect,
  openKeys,
  selectedKeys,
  items
}) => {
  return (
    <>
      <div className="h-[60px] flex items-center px-3">
        <Image src={LogoSVG} alt="logo" height={50} />
      </div>

      <div className="flex-1 overflow-y-auto max-h-[calc(100vh-108px)] scrollbar scrollbar-thumb-gray-500 scrollbar-track-gray-200">
        <Menu
          defaultSelectedKeys={defaultSelectedKeys}
          defaultOpenKeys={defaultOpenKeys}
          openKeys={openKeys}
          selectedKeys={selectedKeys}
          onOpenChange={onOpenChange}
          mode="inline"
          onSelect={onSelect}
          items={items}
          className="border-0"
        />
      </div>
    </>
  );
};

export default AdminSideMenu;
