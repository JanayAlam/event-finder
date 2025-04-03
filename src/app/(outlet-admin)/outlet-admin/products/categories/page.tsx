"use client";

import Button from "@/components/shared/molecules/Button";
import Card from "@/components/shared/molecules/Card";
import PageHeader from "@/components/shared/molecules/PageHeader";
import SearchInputBox from "@/components/shared/molecules/SearchInputBox";
import ProductCategoryList from "@/components/ui/lists/admin/ProductCategoryList";
import CreateEditProductCategoryModal from "@/components/ui/modals/create-edit-product-category-modal/CreateEditProductCategoryModal";
import useBreakpoint from "@/hooks/general/useBreakpoints";
import useModal from "@/hooks/general/useModal";
import { PlusOutlined } from "@ant-design/icons";

export default function Categories() {
  const { upSm } = useBreakpoint();
  const { isOpen, openModalHandler, closeModalHandler } = useModal();

  return (
    <>
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
              onClick={openModalHandler}
              leftIcon={<PlusOutlined />}
              colorType="primary"
            >
              {upSm ? "Add category" : null}
            </Button>
          </div>
        </Card>

        <ProductCategoryList />
      </div>

      <CreateEditProductCategoryModal
        isOpen={isOpen}
        closeHandler={closeModalHandler}
      />
    </>
  );
}
