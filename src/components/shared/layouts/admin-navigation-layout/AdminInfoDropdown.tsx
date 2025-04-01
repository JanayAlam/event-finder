"use client";

import { logoutApi } from "@/api/auth";
import { CommonApiError } from "@/app/_types/common/error";
import { useAuthStore } from "@/store/auth-store";
import { getAWSLinkFromKey } from "@/utils/aws";
import { handlePrivateApiError } from "@/utils/error-handlers";
import {
  DownOutlined,
  LogoutOutlined,
  SettingOutlined
} from "@ant-design/icons";
import { Avatar, Dropdown } from "antd";
import { useRouter } from "next/navigation";
import React from "react";
import toast from "react-hot-toast";

const AdminInfoDropdown: React.FC = () => {
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);

  const router = useRouter();

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
    <Dropdown
      className="hidden md:flex"
      trigger={["click"]}
      menu={{
        items: [
          {
            key: "settings",
            icon: <SettingOutlined />,
            label: "Account settings"
          },
          {
            key: "logout",
            danger: true,
            icon: <LogoutOutlined />,
            label: "Logout",
            onClick: logout
          }
        ]
      }}
    >
      <div className="h-[60px] px-3 cursor-pointer flex gap-2 items-center hover:bg-gray-100">
        {user.profilePhoto ? (
          <Avatar
            size="large"
            src={
              <img
                src={getAWSLinkFromKey(user.profilePhoto) || undefined}
                alt="User profile photo"
              />
            }
          />
        ) : null}
        <div className="flex flex-col">
          <p className="font-medium text-sm max-w-[180px] truncate">
            {user.lastName || user.firstName || "Unnamed User"}
          </p>
          {user.outlet ? (
            <p className="text-xs text-gray-500 max-w-[180px] truncate">
              {user.outlet.name}
            </p>
          ) : (
            <p className="text-xs text-gray-500 max-w-[180px] truncate">
              {user.email || user.phone}
            </p>
          )}
        </div>
        <DownOutlined className="text-sm text-gray-500" />
      </div>
    </Dropdown>
  );
};

export default AdminInfoDropdown;
