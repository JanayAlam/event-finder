"use client";

import Button from "@/components/shared/molecules/button";
import Card from "@/components/shared/molecules/Card";
import PageHeader from "@/components/shared/molecules/PageHeader";
import SearchInputBox from "@/components/shared/molecules/SearchInputBox";
import useBreakpoint from "@/hooks/general/useBreakpoints";
import useModal from "@/hooks/general/useModal";
import useSearch from "@/hooks/general/useSearch";
import { PlusOutlined } from "@ant-design/icons";

export default function Brands() {
  const { searchTerm, control, handleClear } = useSearch();
  const { isOpen, openModalHandler } = useModal();
  const { upSm } = useBreakpoint();

  return (
    <>
      <div className="flex flex-col gap-4 md:gap-7">
        <PageHeader headerText="Product brands" />

        <Card>
          <div className="flex justify-between items-center gap-3">
            <SearchInputBox
              control={control}
              searchTerm={searchTerm}
              onClear={handleClear}
              className="w-full md:max-w-[375px]"
              placeholder="Search brands..."
            />
            <Button
              onClick={openModalHandler}
              leftIcon={<PlusOutlined />}
              colorType="primary"
            >
              {upSm ? "Add brand" : null}
            </Button>
          </div>
        </Card>
      </div>
    </>
  );
}
