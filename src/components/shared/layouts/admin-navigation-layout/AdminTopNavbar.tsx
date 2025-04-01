import { MenuUnfoldOutlined } from "@ant-design/icons";
import { Button, Drawer } from "antd";
import Image from "next/image";
import { MenuProps } from "rc-menu";
import React, { useState } from "react";
import AdminInfoDropdown from "./AdminInfoDropdown";
import AdminSideMenu from "./AdminSideMenu";
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

const AdminTopNavbar: React.FC<IProps> = ({
  defaultOpenKeys,
  defaultSelectedKeys,
  onOpenChange,
  onSelect,
  openKeys,
  selectedKeys,
  items
}) => {
  const [isSidebarDrawerOpen, setIsSidebarDrawerOpen] = useState(false);

  return (
    <div className="sticky top-0">
      <nav className="border-b border-gray-100 w-full h-[60px]">
        <div className="h-full flex items-center justify-between md:justify-end md:px-10">
          <Button
            color="default"
            variant="text"
            className="md:hidden bg-transparent h-full"
            onClick={() => setIsSidebarDrawerOpen(true)}
          >
            <MenuUnfoldOutlined />
          </Button>

          <div className="flex-1 flex flex-row-reverse md:flex-row justify-between">
            <Image
              src={LogoSVG}
              alt="logo"
              height={40}
              className="px-4 md:px-0"
            />
            <AdminInfoDropdown />
          </div>
        </div>
      </nav>

      <Drawer
        open={isSidebarDrawerOpen}
        placement={"left"}
        onClose={() => setIsSidebarDrawerOpen(false)}
        size="default"
      >
        <div className="min-h-[calc(100vh-108px)] w-full py-0 md:py-[16px] flex flex-col gap-[8px]">
          <AdminSideMenu
            defaultSelectedKeys={defaultSelectedKeys}
            defaultOpenKeys={defaultOpenKeys}
            openKeys={openKeys}
            selectedKeys={selectedKeys}
            onOpenChange={onOpenChange}
            onSelect={onSelect}
            items={items}
          />
        </div>
      </Drawer>
    </div>
  );
};

export default AdminTopNavbar;
