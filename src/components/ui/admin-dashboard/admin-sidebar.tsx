"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from "@/components/shared/shadcn-components/tooltip";
import { useSidebarState } from "@/hooks/use-sidebar-state";
import { cn } from "@/lib/utils";
import { PRIVATE_ADMIN_ONLY_PAGE_ROUTE } from "@/routes";
import {
  Calendar,
  ChevronDown,
  Facebook,
  LayoutDashboard,
  PanelLeft,
  UserLock,
  Users
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";

type AdminNavItem = {
  key: string;
  label: string;
  href?: string;
  icon?: React.ReactNode;
  children?: AdminNavItem[];
};

const NAV_ITEMS: AdminNavItem[] = [
  {
    key: "0",
    label: "Dashboard",
    icon: <LayoutDashboard />,
    href: PRIVATE_ADMIN_ONLY_PAGE_ROUTE.ADMIN_DASHBOARD
  },
  {
    key: "user-management",
    label: "Users",
    icon: <Users />,
    href: PRIVATE_ADMIN_ONLY_PAGE_ROUTE.USER_MANAGEMENT
  },
  {
    key: "1",
    label: "Approvals",
    icon: <UserLock />,
    children: [
      {
        key: "1-1",
        label: "Host approval",
        href: PRIVATE_ADMIN_ONLY_PAGE_ROUTE.APPROVAL_HOST_VERIFICATION
      },
      {
        key: "1.2",
        label: "Account approval",
        href: PRIVATE_ADMIN_ONLY_PAGE_ROUTE.APPROVAL_ACCOUNT_VERIFICATION
      }
    ]
  },
  {
    key: "2",
    label: "Events",
    icon: <Calendar />,
    href: PRIVATE_ADMIN_ONLY_PAGE_ROUTE.EVENTS
  },
  {
    key: "3",
    label: "Facebook Management",
    icon: <Facebook />,
    href: PRIVATE_ADMIN_ONLY_PAGE_ROUTE.FACEBOOK_INTEGRATION
  }
];

interface SidebarItemProps {
  item: AdminNavItem;
  collapsed: boolean;
}

const SidebarItem = ({ item, collapsed }: SidebarItemProps) => {
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(false);

  const isActive = (href?: string) => {
    if (!href) return false;
    return href === "/admin"
      ? pathname === "/admin"
      : pathname?.startsWith(href);
  };

  const hasChildren = !!item.children?.length;
  const isAnyChildActive =
    hasChildren && item.children?.some((child) => isActive(child.href));

  // Parent item with children
  if (hasChildren) {
    if (collapsed) {
      // In collapsed mode, show as tooltip with children
      return (
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className={cn(
                "flex w-full items-center justify-center rounded-lg px-2 py-2.5 text-sm font-medium transition-colors",
                "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                isAnyChildActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground"
              )}
            >
              <div className="h-5 w-5 shrink-0 [&>svg]:h-5 [&>svg]:w-5">
                {item.icon}
              </div>
            </button>
          </TooltipTrigger>
          <TooltipContent side="right" className="font-medium">
            <div className="space-y-1">
              <div className="font-semibold">{item.label}</div>
              {item.children?.map((child) => (
                <Link
                  key={child.key}
                  href={child.href ?? "#"}
                  className="block px-2 py-1 text-xs hover:underline"
                >
                  {child.label}
                </Link>
              ))}
            </div>
          </TooltipContent>
        </Tooltip>
      );
    }

    // Expanded mode with collapsible children
    return (
      <div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={cn(
            "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
            "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
            isAnyChildActive
              ? "bg-sidebar-accent text-sidebar-accent-foreground"
              : "text-sidebar-foreground"
          )}
        >
          <div className="h-5 w-5 shrink-0 [&>svg]:h-5 [&>svg]:w-5">
            {item.icon}
          </div>
          <span className="flex-1 truncate text-left text-[14px] font-medium">
            {item.label}
          </span>
          <ChevronDown
            className={cn(
              "h-4 w-4 shrink-0 transition-transform",
              isExpanded && "rotate-180"
            )}
          />
        </button>
        {isExpanded && (
          <div className="mt-2! ml-2! border-l border-sidebar-border pl-2 flex flex-col gap-1">
            {item.children?.map((child) => (
              <Link
                key={child.key}
                href={child.href ?? "#"}
                className={cn(
                  "block rounded-lg px-3 py-2 text-sm transition-colors",
                  "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  isActive(child.href)
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground"
                )}
              >
                {child.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Simple link item without children
  const link = (
    <Link
      href={item.href ?? "#"}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
        "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        isActive(item.href)
          ? "bg-sidebar-accent text-sidebar-accent-foreground"
          : "text-sidebar-foreground",
        collapsed && "justify-center px-2"
      )}
    >
      <div className="h-5 w-5 shrink-0 [&>svg]:h-5 [&>svg]:w-5">
        {item.icon}
      </div>
      {!collapsed && <span className="truncate">{item.label}</span>}
    </Link>
  );

  if (collapsed) {
    return (
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>{link}</TooltipTrigger>
        <TooltipContent side="right" className="font-medium">
          {item.label}
        </TooltipContent>
      </Tooltip>
    );
  }

  return link;
};

const AppSidebar = () => {
  const { collapsed, toggle } = useSidebarState();

  return (
    <aside
      className={cn(
        "sidebar-transition flex h-screen flex-col border-r border-sidebar-border bg-sidebar",
        collapsed ? "w-[68px]" : "w-[260px]"
      )}
    >
      {/* Logo area */}
      <div
        className={cn(
          "flex h-16 items-center border-b border-sidebar-border px-4",
          collapsed ? "justify-center" : "gap-3"
        )}
      >
        <button
          onClick={toggle}
          className="flex items-center justify-center rounded-lg p-2 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
        >
          <PanelLeft className="h-5 w-5" />
        </button>
        {!collapsed && (
          <span className="text-lg font-bold text-sidebar-accent-foreground truncate">
            Admin
          </span>
        )}
      </div>

      {/* Main navigation */}
      <nav className="flex-1 flex flex-col gap-1 overflow-y-auto px-3 py-4">
        {NAV_ITEMS.map((item) => (
          <SidebarItem key={item.key} item={item} collapsed={collapsed} />
        ))}
      </nav>
    </aside>
  );
};

export default AppSidebar;
