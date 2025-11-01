import { Input } from "@/components/shared/atoms/input";
import { TypographyMuted } from "@/components/shared/atoms/typography";
import { PAGE_WIDTH_CLASS_NAME } from "@/constants";
import { cn } from "@/utils/tailwind-utils";
import Link from "next/link";
import React from "react";

const SecondaryNavbar: React.FC = () => {
  return (
    <div className="w-full flex justify-center border-b border-b-borders-1">
      <div
        className={cn(
          PAGE_WIDTH_CLASS_NAME,
          "flex justify-between gap-1",
          "py-2"
        )}
      >
        <div className="flex justify-between items-center gap-6">
          <Link href={"#"}>
            <TypographyMuted>Explore trips</TypographyMuted>
          </Link>
          <Link href={"#"}>
            <TypographyMuted>My trips</TypographyMuted>
          </Link>
          <Link href={"#"}>
            <TypographyMuted>How it works</TypographyMuted>
          </Link>
          <Link href={"#"}>
            <TypographyMuted>About us</TypographyMuted>
          </Link>
        </div>
        <div>
          <Input placeholder="Search trips..." />
        </div>
      </div>
    </div>
  );
};

export default SecondaryNavbar;
