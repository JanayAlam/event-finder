"use client";

import { ChevronRight, LayoutDashboard, UserLock } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from "@/components/shared/shadcn-components/collapsible";
import {
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem
} from "@/components/shared/shadcn-components/sidebar";
import SidebarFooterDropdown from "./SidebarFooterDropdown";

type AdminNavItem = {
  key: string;
  label: string;
  href?: string;
  icon?: React.ReactNode;
  children?: AdminNavItem[];
};

const NAV_ITEMS: AdminNavItem[] = [
  { key: "0", label: "Dashboard", icon: <LayoutDashboard />, href: "#" },
  {
    key: "1",
    label: "Approvals",
    icon: <UserLock />,
    children: [
      {
        key: "1-1",
        label: "Host approval",
        href: "#"
      },
      {
        key: "1.2",
        label: "Account approval",
        href: "#"
      }
    ]
  }
];

export default function AdminSidebar() {
  const pathname = usePathname();

  const isActive = (href?: string) => {
    if (!href) return false;
    return href === "/admin"
      ? pathname === "/admin"
      : pathname?.startsWith(href);
  };

  return (
    <>
      <SidebarContent className="mt-12!">
        <SidebarGroup>
          <SidebarMenu>
            {NAV_ITEMS.map((item) => {
              const hasChildren = !!item.children?.length;

              if (!hasChildren) {
                return (
                  <SidebarMenuItem key={item.key}>
                    <SidebarMenuButton asChild isActive={isActive(item.href)}>
                      <Link href={item.href ?? "#"}>
                        {item.icon}
                        <span className="truncate">{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              }

              return (
                <Collapsible
                  key={item.key}
                  asChild
                  defaultOpen={item.children?.some((child) =>
                    isActive(child.href)
                  )}
                  className="group/collapsible"
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton tooltip={item.label}>
                        {item.icon}
                        <span className="truncate text-sm">{item.label}</span>
                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.children!.map((child) => (
                          <SidebarMenuSubItem key={child.key}>
                            <SidebarMenuSubButton
                              asChild
                              isActive={isActive(child.href)}
                            >
                              <Link href={child.href ?? "#"}>
                                <span className=" truncate">{child.label}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="my-6!">
          <SidebarFooterDropdown />
        </div>
      </SidebarFooter>
    </>
  );
}
