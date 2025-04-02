import { axiosInstance } from "@/axios";
import { Product } from "@prisma/client";
import {
  ProductListResponse,
  TProductStatusUpdate
} from "../../../server/types/product";

export const getProductListApi = (
  outletId: string,
  queryParam: {
    page: number;
    pageSize: number;
  }
) => {
  return axiosInstance.get<ProductListResponse>(
    `/outlets/${outletId}/products/list`,
    {
      params: queryParam
    }
  );
};

export const updateProductStatusApi = (
  outletId: string,
  productId: string,
  body: TProductStatusUpdate
) => {
  return axiosInstance.patch<Product>(
    `/outlets/${outletId}/products/${productId}/update/status`,
    body
  );
};
