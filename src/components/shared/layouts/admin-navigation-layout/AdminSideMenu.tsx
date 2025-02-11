"use client";

import { logoutApi } from "@/api/auth";
import { CommonApiError } from "@/app/_types/common/error";
import { useAuthStore } from "@/store/auth-store";
import { getAWSLinkFromKey } from "@/utils/aws";
import { handlePrivateApiError } from "@/utils/error-handlers";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  ScrollShadow,
  User
} from "@heroui/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import toast from "react-hot-toast";
import LogoSVG from "/public/logo/bhalothaki-logo-green.svg";

const AdminSideMenu: React.FC = () => {
  const router = useRouter();

  const user = useAuthStore((state) => state.user);

  const logout = async () => {
    try {
      await logoutApi();
      router.push("/admin/login");
    } catch (err) {
      const { data, error } = handlePrivateApiError(err as CommonApiError);
      toast.error(data?.message || error || "Could not logout");
    }
  };

  if (!user) return null;

  return (
    <>
      <div className="h-[60px] flex items-center px-3">
        <Image src={LogoSVG} alt="logo" height={50} />
      </div>

      <ScrollShadow className="flex-1 overflow-y-auto max-h-[calc(100vh-188px)] px-2 scrollbar scrollbar-thumb-gray-500 scrollbar-track-gray-200">
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Accusantium
        praesentium sapiente at id eaque dolores tempore, adipisci rem ad beatae
        impedit mollitia obcaecati, a nulla blanditiis incidunt. Iste neque
        explicabo esse aut alias dolores soluta eum repudiandae hic molestias
        cum iste.
      </ScrollShadow>

      <div className="h-[80px] px-3 flex items-center">
        <Dropdown placement="bottom-start" showArrow>
          <DropdownTrigger>
            <div className="flex justify-between items-center transition-transform w-full cursor-pointer">
              <User
                as="button"
                avatarProps={{
                  isBordered: true,
                  src: getAWSLinkFromKey(user.profilePhoto)
                }}
                className="justify-start"
                description={user.email || user.phone}
                name={
                  user.firstName || user.firstName
                    ? user.firstName || "" + user.lastName || ""
                    : "Unnamed user"
                }
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-3"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m4.5 15.75 7.5-7.5 7.5 7.5"
                />
              </svg>
            </div>
          </DropdownTrigger>
          <DropdownMenu aria-label="User Actions" variant="flat">
            <DropdownItem key="profile" className="h-14 gap-2">
              <p className="font-bold">Signed in as</p>
              <p className="font-bold">@anmolsara</p>
            </DropdownItem>
            <DropdownItem key="settings">Account Settings</DropdownItem>
            <DropdownItem key="logout" color="danger" onPress={logout}>
              Log Out
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    </>
  );
};

export default AdminSideMenu;
