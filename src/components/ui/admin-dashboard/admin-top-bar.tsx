"use client";

import { Button } from "@/components/shared/shadcn-components/button";
import { useSidebarState } from "@/hooks/use-sidebar-state";
import { cn } from "@/lib/utils";
import { Bell, Menu } from "lucide-react";
import { League_Spartan } from "next/font/google";
import Link from "next/link";
import React from "react";
import ThemeToggleButton from "../theme-toggle-button";
import UserDropdown from "./user-dropdown";

const leagueSpartan = League_Spartan({
  weight: ["400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  display: "swap"
});

const AdminTopBar: React.FC = () => {
  const { toggle } = useSidebarState();

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-topbar-border bg-topbar px-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggle}
          className="text-topbar-foreground hover:bg-muted lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <div className={cn(leagueSpartan.className, "flex items-center gap-1")}>
          <Link
            href={"/"}
            className="text-3xl font-extrabold text-primary select-none"
          >
            <span className="hidden sm:block">tripmate.</span>
            <span className="sm:hidden">tm.</span>
          </Link>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="relative text-topbar-foreground hover:bg-muted"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-primary" />
        </Button>

        <ThemeToggleButton />

        <div className="h-8 w-px bg-border" />

        <div className="flex items-center gap-3">
          <UserDropdown />
        </div>
      </div>
    </header>
  );
};

export default AdminTopBar;
