import { getAllProductCategoryApi } from "@/api/product-categories";
import { useConfirmModalContext } from "@/app/_contexts/confirm-modal-context/useConfirmModalContext";
import Label from "@/components/shared/atoms/typography/Label";
import TagButton from "@/components/shared/buttons/tag-button";
import { useAuthStore } from "@/store/auth-store";
import { ProductCategory } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { Table, TableProps } from "antd";
import React from "react";
import { GetAllProductCategoryItemResponse } from "../../../../../../server/types/product-category";

interface ProductCategoryListProps {
  openEditModalHandler: (productCategory: ProductCategory) => void;
}

const ProductCategoryList: React.FC<ProductCategoryListProps> = ({
  openEditModalHandler
}) => {
  const user = useAuthStore((state) => state.user);

  const { openConfirmModal } = useConfirmModalContext();

  const { data, isLoading } = useQuery<
    GetAllProductCategoryItemResponse[] | undefined
  >({
    queryKey: ["productCategoryList"],
    queryFn: async () => {
      if (!user?.outlet?.id) return;

      const { data } = await getAllProductCategoryApi(user.outlet.id);
      return data;
    },
    placeholderData: (previousData) => previousData
  });

  const columns: TableProps<ProductCategory>["columns"] = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (title: string) => (
        <Label level={2} fontWeight="bold">
          {title}
        </Label>
      )
    },
    {
      title: "Parent Category",
      dataIndex: "parentCategory",
      key: "parentCategory",
      render: (
        parentCategory: GetAllProductCategoryItemResponse["parentCategory"]
      ) => <Label level={2}>{parentCategory?.title || "---"}</Label>
    },
    {
      title: "",
      dataIndex: "",
      key: "x",
      width: 150,
      render: (_, record) => (
        <div className="flex gap-2">
          <TagButton
            colorType="edit"
            onClick={() => {
              openEditModalHandler(record);
            }}
            title="Edit"
          />
          <TagButton
            colorType="delete"
            onClick={() => {
              openConfirmModal({
                title: "Delete Product Category",
                message:
                  "Are you sure you want to delete this product category?",
                modalType: "error",
                onConfirm: async () => {}
              });
            }}
            title="Delete"
          />
        </div>
      )
    }
  ];

  return (
    <Table<GetAllProductCategoryItemResponse>
      loading={isLoading}
      bordered
      columns={columns}
      dataSource={data?.map((item) => ({ key: item.id, ...item }))}
      style={{ borderRadius: 6 }}
    />
  );
};

export default ProductCategoryList;
