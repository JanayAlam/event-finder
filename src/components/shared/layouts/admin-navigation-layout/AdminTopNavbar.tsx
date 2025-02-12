import { MenuUnfoldOutlined } from "@ant-design/icons";
import { Button, Drawer } from "antd";
import React, { useState } from "react";
import AdminSideMenu from "./AdminSideMenu";

const AdminTopNavbar: React.FC = () => {
  const [isSidebarDrawerOpen, setIsSidebarDrawerOpen] = useState(false);

  return (
    <>
      <nav className="border-b border-gray-100 w-full h-[50px] ">
        <div className="md:hidden h-full flex items-center">
          <Button
            color="default"
            variant="text"
            className="bg-transparent h-full"
            onClick={() => setIsSidebarDrawerOpen(true)}
          >
            <MenuUnfoldOutlined />
          </Button>
        </div>
      </nav>

      <Drawer
        open={isSidebarDrawerOpen}
        placement={"left"}
        onClose={() => setIsSidebarDrawerOpen(false)}
        size="default"
      >
        <div className="min-h-[100vh] w-full py-[16px] flex flex-col gap-[8px]">
          <AdminSideMenu />
        </div>
      </Drawer>
    </>
  );
};

export default AdminTopNavbar;
