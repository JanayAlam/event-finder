import { getProductListApi, updateProductStatusApi } from "@/api/products";
import Paragraph from "@/components/shared/atoms/typography/Paragraph";
import { useAuthStore } from "@/store/auth-store";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Pagination, Spin } from "antd";
import React, { useState } from "react";
import toast from "react-hot-toast";
import {
  ProductListResponse,
  TProductStatusUpdate
} from "../../../../../../server/types/product";
import ProductListItem from "./ProductListItem";

interface ProductListProps {}

const ProductList: React.FC<ProductListProps> = () => {
  const user = useAuthStore((state) => state.user);
  const queryClient = useQueryClient();

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { data, isLoading, isError } = useQuery<
    ProductListResponse | undefined
  >({
    queryKey: ["productList", currentPage, pageSize],
    queryFn: async () => {
      if (!user?.outlet?.id) return;

      const response = await getProductListApi(user.outlet.id, {
        page: currentPage,
        pageSize
      });
      return response.data;
    },
    placeholderData: (previousData) => previousData
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({
      productId,
      field,
      value
    }: {
      productId: string;
      field: "isActive" | "isFeatured" | "isBestSeller" | "isNewArrival";
      value: boolean;
    }) => {
      if (!user?.outlet?.id) throw new Error("Outlet ID not found");

      const updateData: TProductStatusUpdate = {
        [field]: value
      };

      return updateProductStatusApi(user.outlet.id, productId, updateData);
    },
    onSuccess: (response, variable) => {
      queryClient.setQueryData(
        ["productList", currentPage, pageSize],
        (oldData: ProductListResponse | undefined) => {
          if (!oldData) return oldData;

          const updatedProducts = oldData.products.map((product) => {
            if (product.id === response.data.id) {
              return {
                ...product,
                [variable.field]: response.data[variable.field]
              };
            }
            return product;
          });

          return {
            ...oldData,
            products: updatedProducts
          };
        }
      );

      toast.success(`Product status updated successfully`);
    },
    onError: (error: Error) => {
      console.error("Failed to update product status:", error);
      toast.error("Failed to update product status. Please try again.");
    }
  });

  const handleStatusToggleChange = (
    productId: string,
    field: "isActive" | "isFeatured" | "isBestSeller" | "isNewArrival",
    value: boolean
  ) => {
    updateStatusMutation.mutate({ productId, field, value });
  };

  const products = data?.products || [];
  const totalProducts = data?.meta.total || 0;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Spin size="large" />
      </div>
    );
  }

  if (isError || !products.length) {
    return (
      <div className="flex justify-center items-center h-full">
        <Paragraph level={4}>No product found</Paragraph>
      </div>
    );
  }

  const handlePageChange = (page: number, pageSize: number) => {
    setCurrentPage(page);
    setPageSize(pageSize);
  };

  return (
    <div className="flex flex-col gap-10">
      <div className="w-full flex flex-col gap-5">
        {products.map((product) => (
          <ProductListItem
            key={product.id}
            product={product}
            handleToggleChange={(field, value) =>
              handleStatusToggleChange(product.id, field, value)
            }
          />
        ))}
      </div>
      <div className="flex flex-col gap-4">
        <hr />
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={totalProducts}
          onChange={handlePageChange}
          showSizeChanger
        />
      </div>
    </div>
  );
};

export default ProductList;
