"use client";

import { PAGE_WIDTH_CLASS_NAME } from "@/constants";
import { cn } from "@/utils/tailwind-utils";
import { League_Spartan } from "next/font/google";
import Link from "next/link";
import React from "react";
import Button from "../../atoms/button";
import ThemeToggleButton from "../../ui/theme-toggle-button";

const leagueSpartan = League_Spartan({
  weight: ["400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  display: "swap"
});

interface TapNavbarProps {}

const TapNavbar: React.FC<TapNavbarProps> = () => {
  return (
    <div className="border-b border-b-borders-1 w-full flex justify-center">
      <div
        className={cn(
          PAGE_WIDTH_CLASS_NAME,
          "h-16 flex items-center justify-between"
        )}
      >
        <div className={cn(leagueSpartan.className, "flex items-center gap-1")}>
          <Link
            href={"/"}
            className="text-4xl font-extrabold text-primary-main select-none"
          >
            tripmate.
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">Login/Signup</Button>
          <ThemeToggleButton />
        </div>
      </div>
    </div>
  );
};

export default TapNavbar;
