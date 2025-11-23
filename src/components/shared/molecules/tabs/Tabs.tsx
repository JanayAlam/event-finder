"use client";

import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
  Tabs as ShadCNTabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "../../shadcn-components/tabs";

export type TTabItem = {
  label: string;
  value: string;
};

export type TTabsProps = {
  items: TTabItem[];
  defaultValue?: string;
  queryKey?: string;
  render?: (label: string, value: string, index: number) => React.ReactNode;
};

const Tabs: React.FC<TTabsProps> = ({
  items,
  defaultValue,
  render,
  queryKey = "tab"
}) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialValue =
    searchParams.get(queryKey) || defaultValue || items[0]?.value;

  const [activeTab, setActiveTab] = useState(initialValue);

  useEffect(() => {
    const currentQuery = searchParams.get(queryKey);
    if (currentQuery !== activeTab) {
      const params = new URLSearchParams(searchParams.toString());
      params.set(queryKey, activeTab);
      router.replace(`?${params.toString()}`, { scroll: false });
    }
  }, [activeTab, queryKey, router, searchParams]);

  if (!items.length) {
    return null;
  }

  return (
    <ShadCNTabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList>
        {items.map(({ label, value }, idx) => (
          <TabsTrigger key={value + idx} value={value}>
            {label}
          </TabsTrigger>
        ))}
      </TabsList>
      <div className="mt-2!">
        {items.map(({ label, value }, idx) => (
          <TabsContent key={value} value={value}>
            {render?.(label, value, idx)}
          </TabsContent>
        ))}
      </div>
    </ShadCNTabs>
  );
};

export default Tabs;
