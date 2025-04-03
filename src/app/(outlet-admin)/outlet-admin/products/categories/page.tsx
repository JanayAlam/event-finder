"use client";

import Button from "@/components/shared/molecules/Button";
import Card from "@/components/shared/molecules/Card";
import PageHeader from "@/components/shared/molecules/PageHeader";
import SearchInputBox from "@/components/shared/molecules/SearchInputBox";
import ProductCategoryList from "@/components/ui/lists/admin/ProductCategoryList";
import useBreakpoint from "@/hooks/general/useBreakpoints";
import { PlusOutlined } from "@ant-design/icons";

export default function Categories() {
  const { upSm } = useBreakpoint();

  return (
    <div className="flex flex-col gap-4 md:gap-7">
      <PageHeader headerText="Product categories" />

      <Card>
        <div className="flex justify-between items-center gap-3">
          <SearchInputBox
            onSearch={() => {}}
            className="w-full md:max-w-[375px]"
            placeholder="Search categories..."
          />
          <Button
            onClick={() => {}}
            leftIcon={<PlusOutlined />}
            colorType="primary"
          >
            {upSm ? "Add category" : null}
          </Button>
        </div>
      </Card>

      <ProductCategoryList />
      {/* <Card>
      </Card> */}
    </div>
  );
}
