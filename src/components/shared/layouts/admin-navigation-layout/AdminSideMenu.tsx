"use client";

import Image from "next/image";
import React from "react";
import LogoSVG from "/public/logo/bhalothaki-logo-green.svg";

const isActive = (key: string, pathname: string) => {
  const urlKey = pathname.substring(1).split("_")[0] || "";

  if (key === urlKey) {
    return true;
  }

  return false;
};

const AdminSideMenu: React.FC = () => {
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
