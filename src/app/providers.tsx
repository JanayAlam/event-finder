import { AuthProvider } from "@/app/_providers/auth-provider";
import { ThemeProvider } from "@/app/_providers/theme-provider";
import React from "react";

export function Providers({ children }: React.PropsWithChildren) {
  return (
    <main>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <AuthProvider>{children}</AuthProvider>
      </ThemeProvider>
    </main>
  );
}
