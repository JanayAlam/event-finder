"use client";

import { useAuthStore } from "@/store/auth-store";
import { getUIAvatar } from "@/utils/avatars";
import { getAWSLinkFromKey } from "@/utils/aws";
import {
  DownOutlined,
  LogoutOutlined,
  SettingOutlined
} from "@ant-design/icons";
import { Avatar, Dropdown } from "antd";
import { useRouter } from "next/navigation";
import React from "react";

const AdminInfoDropdown: React.FC = () => {
  const router = useRouter();

  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  if (!user) return;

  return (
    <Dropdown
      className="flex"
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
            onClick: () => logout(router)
          }
        ]
      }}
    >
      <div className="h-[60px] px-3 cursor-pointer flex gap-2 items-center hover:bg-gray-100">
        <Avatar
          size="large"
          src={
            <img
              src={
                user.profilePhoto
                  ? getAWSLinkFromKey(user.profilePhoto) || undefined
                  : getUIAvatar(user.firstName || user.lastName || user.email)
              }
              alt="User profile photo"
            />
          }
        />

        <div className="hidden md:flex flex-col">
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
        <DownOutlined className="text-sm text-gray-500 hidden md:block" />
      </div>
    </Dropdown>
  );
};

export default AdminInfoDropdown;
