import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ConfigProvider } from "antd";
import React from "react";
import antdThemeConfig from "./_themes/antd-theme";

export function Providers({ children }: React.PropsWithChildren) {
  return (
    <main>
      <AntdRegistry>
        <ConfigProvider theme={antdThemeConfig}>{children}</ConfigProvider>
      </AntdRegistry>
    </main>
  );
}
