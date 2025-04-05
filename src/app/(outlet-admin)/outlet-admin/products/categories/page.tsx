"use client";

import Button from "@/components/shared/molecules/button";
import Card from "@/components/shared/molecules/Card";
import PageHeader from "@/components/shared/molecules/PageHeader";
import SearchInputBox from "@/components/shared/molecules/SearchInputBox";
import ProductCategoryList from "@/components/ui/lists/admin/ProductCategoryList";
import ProductCategoryFormModal from "@/components/ui/modals/product-category-form-modal";
import useBreakpoint from "@/hooks/general/useBreakpoints";
import useModal from "@/hooks/general/useModal";
import useSearch from "@/hooks/general/useSearch";
import { PlusOutlined } from "@ant-design/icons";
import { ProductCategory } from "@prisma/client";
import { useState } from "react";

export default function Categories() {
  const { upSm } = useBreakpoint();
  const { isOpen, openModalHandler, closeModalHandler } = useModal();

  const { control, searchTerm, debouncedSearchTerm, handleClear } = useSearch();

  const [selectedProductCategory, setSelectedProductCategory] =
    useState<ProductCategory>();

  const closeModal = () => {
    setSelectedProductCategory(undefined);
    closeModalHandler();
  };

  return (
    <>
      <div className="flex flex-col gap-4 md:gap-7">
        <PageHeader headerText="Product categories" />

        <Card>
          <div className="flex justify-between items-center gap-3">
            <SearchInputBox
              control={control}
              searchTerm={searchTerm}
              onClear={handleClear}
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

        <ProductCategoryList
          searchTerm={debouncedSearchTerm}
          openEditModalHandler={(productCategory) => {
            setSelectedProductCategory(productCategory);
            openModalHandler();
          }}
        />
      </div>

      <ProductCategoryFormModal
        isOpen={isOpen}
        closeHandler={closeModal}
        category={selectedProductCategory}
      />
    </>
  );
}
