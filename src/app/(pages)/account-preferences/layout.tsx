import { PRIVATE_PAGE_ROUTE } from "@/routes";
import React, { PropsWithChildren } from "react";
import SettingsNavigation from "../../../components/ui/account-preferences/settings-navigation";

type TSideMenuItem = {
  key: string;
  label: string;
  href: string;
};

const menuItems: TSideMenuItem[] = [
  {
    key: "personal-info",
    href: PRIVATE_PAGE_ROUTE.SETTINGS_PERSONAL_INFO,
    label: "Personal info"
  },
  {
    key: "verification",
    href: PRIVATE_PAGE_ROUTE.SETTINGS_VERIFICATION,
    label: "Verification"
  }
];

const SettingsLayout: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <SettingsNavigation items={menuItems} />
      <div className="flex-1 sm:flex-3 flex flex-col gap-2 lg:px-6">
        {children}
      </div>
    </div>
  );
};

export default SettingsLayout;
