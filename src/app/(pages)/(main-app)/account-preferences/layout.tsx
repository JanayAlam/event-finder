import React, { PropsWithChildren } from "react";
import SettingsNavigation from "../../../../components/ui/account-preferences/settings-navigation";

const SettingsLayout: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <SettingsNavigation />
      <div className="flex-1 sm:flex-3 flex flex-col gap-2 lg:px-6">
        {children}
      </div>
    </div>
  );
};

export default SettingsLayout;
