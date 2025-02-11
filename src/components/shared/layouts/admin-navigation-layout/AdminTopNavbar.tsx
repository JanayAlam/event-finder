import MenuIcon from "@/assets/icons/MenuIcon";
import Button from "@/components/shared/atoms/button";
import { Drawer, DrawerContent } from "@heroui/react";
import React, { useState } from "react";
import AdminSideMenu from "./AdminSideMenu";

const AdminTopNavbar: React.FC = () => {
  const [isSidebarDrawerOpen, setIsSidebarDrawerOpen] = useState(false);

  return (
    <>
      <nav className="md:hidden border-b-1 w-full h-[50px]">
        <div className="h-full flex items-center">
          <Button
            isIconOnly
            color="default"
            variant="flat"
            className="bg-transparent"
            onPress={() => setIsSidebarDrawerOpen(true)}
          >
            <MenuIcon />
          </Button>
        </div>
      </nav>

      <Drawer
        isOpen={isSidebarDrawerOpen}
        placement={"left"}
        onOpenChange={(isOpen) => setIsSidebarDrawerOpen(isOpen)}
        size="xs"
        radius="sm"
      >
        <DrawerContent>
          <div className="min-h-[100vh] w-full py-[16px] flex flex-col gap-[8px]">
            <AdminSideMenu />
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default AdminTopNavbar;
