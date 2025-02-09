import React from "react";

interface IProps {}

const OutletAdminDashboardSidebar: React.FC<IProps> = () => {
  return (
    <aside className="hidden md:block min-h-[100vh] w-[260px]">Sidebar</aside>
  );
};

export default OutletAdminDashboardSidebar;
