import { logoutApi } from "@/api/auth";
import { CommonApiError } from "@/app/_types/common/error";
import { useAuthStore } from "@/store/auth-store";
import { getAWSLinkFromKey } from "@/utils/aws";
import { handlePrivateApiError } from "@/utils/error-handlers";
import { DownOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Avatar, Button, Drawer, Dropdown } from "antd";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";
import AdminSideMenu from "./AdminSideMenu";

const AdminTopNavbar: React.FC = () => {
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);

  const router = useRouter();

  const [isSidebarDrawerOpen, setIsSidebarDrawerOpen] = useState(false);

  const logout = async () => {
    try {
      await logoutApi();
      setUser(null);
      router.push("/admin/login");
    } catch (err) {
      const { data, error } = handlePrivateApiError(err as CommonApiError);
      toast.error(data?.message || error || "Could not logout");
    }
  };

  if (!user) return;

  return (
    <>
      <nav className="border-b border-gray-100 w-full h-[60px] sticky">
        <div className="h-full flex items-center justify-between md:justify-end md:px-10">
          <Button
            color="default"
            variant="text"
            className="md:hidden bg-transparent h-full"
            onClick={() => setIsSidebarDrawerOpen(true)}
          >
            <MenuUnfoldOutlined />
          </Button>

          <Dropdown
            trigger={["click"]}
            menu={{
              items: [
                {
                  key: "logout",
                  danger: true,
                  label: "Logout",
                  onClick: logout
                }
              ]
            }}
          >
            <div className="h-full px-3 cursor-pointer flex gap-2 items-center hover:bg-primary-50">
              <Avatar
                size="large"
                src={
                  <img
                    src={getAWSLinkFromKey(user.profilePhoto) || undefined}
                    alt="User profile photo"
                  />
                }
              />
              <div className="flex flex-col">
                <p className="font-medium text-sm max-w-[180px] truncate">
                  {user.lastName || user.firstName || "Unnamed User"}
                </p>
                {user.outlet ? (
                  <p className="text-xs text-gray-400  max-w-[180px] truncate">
                    {user.outlet.name}
                  </p>
                ) : (
                  <p className="text-xs text-gray-400 max-w-[180px] truncate">
                    {user.email || user.phone}
                  </p>
                )}
              </div>
              <DownOutlined className="text-sm text-gray-400" />
            </div>
          </Dropdown>
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
