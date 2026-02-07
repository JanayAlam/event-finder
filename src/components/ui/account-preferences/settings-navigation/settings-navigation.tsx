"use client";

import {
  Item,
  ItemActions,
  ItemContent,
  ItemTitle
} from "@/components/shared/shadcn-components/Item";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from "@/components/shared/shadcn-components/select";
import { cn } from "@/lib/utils";
import { PRIVATE_PAGE_ROUTE, PRIVATE_TRAVELER_ONLY_PAGE_ROUTE } from "@/routes";
import { useAuthStore } from "@/stores/auth-store";
import { ChevronRightIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";
import React, { useMemo } from "react";
import { USER_ROLE } from "../../../../../server/enums";

type TSideMenuItem = {
  key: string;
  label: string;
  href: string;
};

export type SettingsNavItem = {
  key: string;
  label: string;
  href: string;
};

const SettingsNavigation: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();

  const { user } = useAuthStore();

  const items: TSideMenuItem[] = useMemo(() => {
    const menuItems: TSideMenuItem[] = [
      {
        key: "personal-info",
        href: PRIVATE_PAGE_ROUTE.SETTINGS_PERSONAL_INFO,
        label: "Personal info"
      }
    ];

    if (user?.role !== USER_ROLE.ADMIN) {
      menuItems.push({
        key: "verification",
        href: PRIVATE_TRAVELER_ONLY_PAGE_ROUTE.SETTINGS_VERIFICATION,
        label: "Verification"
      });
    }

    return menuItems;
  }, [user]);

  const activeItem =
    items.find((item) => pathname?.startsWith(item.href)) ?? items[0];

  const handleSelect = (value: string) => {
    const target = items.find((item) => item.key === value);
    if (target) {
      router.push(target.href);
    }
  };

  return (
    <>
      <div className="flex-1 hidden sm:flex flex-col gap-2">
        {items.map((item) => {
          const isActive = pathname?.startsWith(item.href);

          return (
            <Item
              key={item.key}
              variant="outline"
              size="sm"
              asChild
              className={cn(
                "transition-colors",
                isActive && "bg-primary/4 text-primary"
              )}
            >
              <Link
                href={item.href}
                aria-current={isActive ? "page" : undefined}
              >
                <ItemContent>
                  <ItemTitle>{item.label}</ItemTitle>
                </ItemContent>
                <ItemActions>
                  <ChevronRightIcon className="size-4" />
                </ItemActions>
              </Link>
            </Item>
          );
        })}
      </div>
      <div className="flex-1 sm:hidden">
        <Select value={activeItem?.key} onValueChange={handleSelect}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a page" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Account preferences</SelectLabel>
              {items.map((item) => (
                <SelectItem key={item.key} value={item.key}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </>
  );
};

export default SettingsNavigation;
