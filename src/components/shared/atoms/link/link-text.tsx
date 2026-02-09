import { ArrowRight } from "lucide-react";
import Link from "next/link";
import React, { PropsWithChildren } from "react";

interface ILinkTextProps extends PropsWithChildren {
  href: string;
  showArrow?: boolean;
}

export const LinkText: React.FC<ILinkTextProps> = ({
  href,
  showArrow = true,
  children
}) => {
  return (
    <Link
      href={href}
      className="max-sm:hidden hover:underline underline-offset-4 flex items-center gap-1 group hover:text-primary/90 dark:hover:text-primary"
    >
      {children}
      {showArrow ? (
        <ArrowRight className="size-4 transition-transform duration-300 group-hover:-rotate-45" />
      ) : null}
    </Link>
  );
};
