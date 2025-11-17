"use client";

import {
  Item,
  ItemActions,
  ItemContent,
  ItemTitle
} from "@/components/shared/atoms/item";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from "@/components/shared/atoms/select";
import { cn } from "@/utils/tailwind-utils";
import { ChevronRightIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";
import React from "react";

export type SettingsNavItem = {
  key: string;
  label: string;
  href: string;
};

type SettingsNavigationProps = {
  items: SettingsNavItem[];
};

const SettingsNavigation: React.FC<SettingsNavigationProps> = ({ items }) => {
  const pathname = usePathname();
  const router = useRouter();

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
              <SelectLabel>Settings</SelectLabel>
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
