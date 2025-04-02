import React from "react";
import Breadcrumb, { BreadcrumbItem } from "../../atoms/Breadcrumb";
import Heading from "../../atoms/typography/Heading";

interface PageHeaderProps {
  headerText: string;
  items?: BreadcrumbItem[];
}

const PageHeader: React.FC<PageHeaderProps> = ({ headerText, items = [] }) => {
  return (
    <div className="flex flex-col gap-2 px-5 pt-5 md:p-0">
      <Breadcrumb items={items} />
      <Heading level={2}>{headerText}</Heading>
    </div>
  );
};

export default PageHeader;
