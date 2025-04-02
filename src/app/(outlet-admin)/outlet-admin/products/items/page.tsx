"use client";

import { ADD_PRODUCT_ROUTE } from "@/app/_routes/outlet-admin-routes";
import Button from "@/components/shared/molecules/Button";
import Card from "@/components/shared/molecules/Card";
import PageHeader from "@/components/shared/molecules/PageHeader";
import SearchInputBox from "@/components/shared/molecules/SearchInputBox";
import ProductList from "@/components/ui/lists/admin/ProductList";
import useBreakpoint from "@/hooks/useBreakpoints";
import { PlusOutlined } from "@ant-design/icons";

export default function Items() {
  const { upSm } = useBreakpoint();

  return (
    <div className="flex flex-col gap-4 md:gap-7">
      <PageHeader headerText="Products" />

      <Card>
        <div className="flex justify-between items-center gap-3">
          <SearchInputBox
            onSearch={() => {}}
            className="w-full md:max-w-[375px]"
            placeholder="Search products..."
          />
          <Button
            href={ADD_PRODUCT_ROUTE}
            leftIcon={<PlusOutlined />}
            colorType="primary"
          >
            {upSm ? "Add product" : null}
          </Button>
        </div>
      </Card>

      <Card>
        <ProductList />
      </Card>
    </div>
  );
}
