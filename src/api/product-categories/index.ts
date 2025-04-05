import { axiosInstance } from "@/axios";
import { ProductCategory } from "@prisma/client";
import {
  ProductCategoryCreateRequest,
  ProductCategoryGetAllQuery,
  ProductCategorySelectListItemResponse,
  ProductCategoryUpdateRequest
} from "../../../server/types/product-category";

export const createProductCategoryApi = (
  outletId: string,
  requestBody: ProductCategoryCreateRequest
) => {
  return axiosInstance.post<ProductCategory>(
    `/outlets/${outletId}/product-categories`,
    requestBody
  );
};

export const updateProductCategoryApi = (
  outletId: string,
  productCategoryId: string,
  requestBody: ProductCategoryUpdateRequest
) => {
  return axiosInstance.patch<ProductCategory>(
    `/outlets/${outletId}/product-categories/${productCategoryId}`,
    requestBody
  );
};

export const deleteProductCategoryApi = (
  outletId: string,
  productCategoryId: string
) => {
  return axiosInstance.delete<void>(
    `/outlets/${outletId}/product-categories/${productCategoryId}`
  );
};

export const removeParentCategoryApi = (
  outletId: string,
  productCategoryId: string
) => {
  return axiosInstance.delete<void>(
    `/outlets/${outletId}/product-categories/${productCategoryId}/remove-parent`
  );
};

export const getAllProductCategoryApi = (
  outletId: string,
  query?: ProductCategoryGetAllQuery
) => {
  return axiosInstance.get<ProductCategory[]>(
    `/outlets/${outletId}/product-categories`,
    { data: query }
  );
};

export const getProductCategorySelectListApi = (outletId: string) => {
  return axiosInstance.get<ProductCategorySelectListItemResponse[]>(
    `/outlets/${outletId}/product-categories/select/list`
  );
};

export const getProductCategoryAvailableParentSelectListApi = (
  outletId: string,
  productCategoryId: string
) => {
  return axiosInstance.get<ProductCategorySelectListItemResponse[]>(
    `/outlets/${outletId}/product-categories/${productCategoryId}/available-parents`
  );
};
