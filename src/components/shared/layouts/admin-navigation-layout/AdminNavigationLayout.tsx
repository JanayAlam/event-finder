"use client";

import React, { PropsWithChildren } from "react";
import AdminSideMenu from "./AdminSideMenu";
import AdminTopNavbar from "./AdminTopNavbar";

const AdminNavigationLayout: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="flex flex-row">
      <aside className="hidden min-h-[100vh] w-[260px] border-r py-[16px] md:flex md:flex-col md:gap-[8px]">
        <AdminSideMenu />
      </aside>

      <section className="flex-1">
        <AdminTopNavbar />
        {children}
      </section>
    </div>
  );
};

export default AdminNavigationLayout;
