import Link from "next/link";
import React from "react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items?: BreadcrumbItem[];
  separator?: string;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({
  items = [],
  separator = "/"
}) => {
  if (!items.length) {
    return null;
  }

  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center space-x-2 text-xs">
        {items.map((item, index) => {
          return (
            <li key={index} className="flex items-center">
              {!item.href ? (
                <span className="font-medium text-gray-900" aria-current="page">
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="text-gray-500 hover:text-blue-600 hover:underline transition-colors"
                >
                  {item.label}
                </Link>
              )}

              <span className="ml-2 text-gray-400" aria-hidden="true">
                {separator}
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
