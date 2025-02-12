"use client";

import { logoutApi } from "@/api/auth";
import { CommonApiError } from "@/app/_types/common/error";
import { useAuthStore } from "@/store/auth-store";
import { handlePrivateApiError } from "@/utils/error-handlers";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import toast from "react-hot-toast";
import LogoSVG from "/public/logo/bhalothaki-logo-green.svg";

const isActive = (key: string, pathname: string) => {
  const urlKey = pathname.substring(1).split("_")[0] || "";

  if (key === urlKey) {
    return true;
  }

  return false;
};

const AdminSideMenu: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();

  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);

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

  if (!user) return null;

  return (
    <>
      <div className="h-[60px] flex items-center px-3">
        <Image src={LogoSVG} alt="logo" height={50} />
      </div>

      <div className="flex-1 overflow-y-auto max-h-[calc(100vh-108px)] px-2 scrollbar scrollbar-thumb-gray-500 scrollbar-track-gray-200">
        {/* <menu className="w-full flex flex-col gap-1">
          {[
            {
              label: "Dashboard",
              link: "/outlet-admin",
              key: "outlet-admin"
            },
            {
              label: "Products",
              link: "/outlet-admin/products",
              key: "outlet-admin_products"
            }
          ].map((item) => {
            const bgStyles = isActive(item.key, pathname)
              ? "bg-teal-100 bg-opacity-25"
              : "hover:bg-teal-100 hover:bg-opacity-25 text-slate-900";

            return (
              <Link key={item.key} href={item.link}>
                <div
                  className={`px-4 py-2 text-teal-900 rounded-md ${bgStyles}`}
                >
                  {item.label}
                </div>
              </Link>
            );
          })}
        </menu> */}
      </div>
    </>
  );
};

export default AdminSideMenu;
