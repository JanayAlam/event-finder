import { cn } from "@/utils/tailwind-utils";
import Link from "next/link";
import React from "react";

const activeTextClassName = "text-semibold";
const nonActiveTextClassName = "text-muted-foreground hover:text-semibold";

interface NavbarLinkProps {
  href: string;
  label: string;
  isActive: boolean;
  className?: string;
}

const NavbarLink: React.FC<NavbarLinkProps> = ({
  href,
  isActive,
  label,
  className
}) => {
  return (
    <Link href={href}>
      <p
        className={cn(
          "py-0",
          isActive ? activeTextClassName : nonActiveTextClassName,
          className
        )}
      >
        {label}
      </p>
    </Link>
  );
};

export { NavbarLink };
