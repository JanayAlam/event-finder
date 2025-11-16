"use client";

import { useAuthStore } from "@/app/_store/auth-store";
import { Button } from "@/components/shared/atoms/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger
} from "@/components/shared/atoms/drawer";
import { Input } from "@/components/shared/atoms/input";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemTitle
} from "@/components/shared/atoms/item/Item";
import { NavbarLink } from "@/components/shared/atoms/links";
import { PAGE_WIDTH_CLASS_NAME } from "@/constants";
import { cn } from "@/utils/tailwind-utils";
import { AlignRight, ChevronRightIcon, XIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

interface MenuItem {
  key: string;
  label: string;
  href: string;
  shouldShowWhenLoggedIn: boolean;
  shouldShowWhenLoggedOut: boolean;
}

const menuItems: MenuItem[] = [
  {
    key: "explore-trips",
    label: "Explore trips",
    href: "#",
    shouldShowWhenLoggedIn: true,
    shouldShowWhenLoggedOut: true
  },
  {
    key: "my-trips",
    label: "My trips",
    href: "#",
    shouldShowWhenLoggedIn: true,
    shouldShowWhenLoggedOut: false
  },
  {
    key: "how-it-works",
    label: "How it works",
    href: "#",
    shouldShowWhenLoggedIn: false,
    shouldShowWhenLoggedOut: true
  },
  {
    key: "about-us",
    label: "About us",
    href: "#",
    shouldShowWhenLoggedIn: false,
    shouldShowWhenLoggedOut: true
  }
];

const SecondaryNavbar: React.FC = () => {
  const { isLoggedIn } = useAuthStore();

  const visibleMenuItems = menuItems.filter((item) => {
    return isLoggedIn
      ? item.shouldShowWhenLoggedIn
      : item.shouldShowWhenLoggedOut;
  });

  return (
    <div
      className={cn(
        "w-full flex justify-center",
        "border-b border-b-borders-1"
      )}
    >
      <div
        className={cn(
          PAGE_WIDTH_CLASS_NAME,
          "flex justify-between gap-1",
          "py-2"
        )}
      >
        <div className="hidden sm:flex justify-between items-center gap-6">
          {visibleMenuItems.map((item, index) => (
            <NavbarLink
              key={item.key}
              href={item.href}
              isActive={index === 0}
              label={item.label}
            />
          ))}
        </div>
        <Input placeholder="Search trips..." className="w-full sm:max-w-70" />
        <div className="block sm:hidden">
          <Drawer direction="right">
            <DrawerTrigger asChild>
              <Button variant="ghost" size="icon">
                <AlignRight />
              </Button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerTitle className="sr-only">Navigation Menu</DrawerTitle>
              <div className="p-4 flex flex-col gap-6">
                <div className="flex flex-row-reverse">
                  <DrawerClose asChild>
                    <Button variant="outline" size="icon">
                      <XIcon className="size-6" />
                    </Button>
                  </DrawerClose>
                </div>
                <div className="flex w-full flex-col gap-2">
                  {visibleMenuItems.map((item) => (
                    <Item key={item.key} variant="outline" size="sm" asChild>
                      <Link href={item.href}>
                        <ItemContent>
                          <ItemTitle>{item.label}</ItemTitle>
                        </ItemContent>
                        <ItemActions>
                          <ChevronRightIcon className="size-4" />
                        </ItemActions>
                      </Link>
                    </Item>
                  ))}
                </div>
              </div>
            </DrawerContent>
          </Drawer>
        </div>
      </div>
    </div>
  );
};

export default SecondaryNavbar;
