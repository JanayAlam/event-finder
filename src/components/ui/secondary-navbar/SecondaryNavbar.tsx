"use client";

import { Input } from "@/components/shared/atoms/input";
import { NavbarLink } from "@/components/shared/atoms/links";
import { PAGE_WIDTH_CLASS_NAME } from "@/constants";
import { cn } from "@/utils/tailwind-utils";
import React from "react";

const SecondaryNavbar: React.FC = () => {
  return (
    <div
      className={cn("w-full flex justify-center border-b border-b-borders-1")}
    >
      <div
        className={cn(
          PAGE_WIDTH_CLASS_NAME,
          "flex justify-between gap-1",
          "py-2"
        )}
      >
        <div className="flex justify-between items-center gap-6">
          <NavbarLink href="#" isActive label="Explore trips" />
          <NavbarLink href="#" isActive={false} label="My trips" />
          <NavbarLink href="#" isActive={false} label="How it works" />
          <NavbarLink href="#" isActive={false} label="About us" />
        </div>
        <div>
          <Input placeholder="Search trips..." />
        </div>
      </div>
    </div>
  );
};

export default SecondaryNavbar;
