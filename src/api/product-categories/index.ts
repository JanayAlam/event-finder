import { axiosInstance } from "@/axios";
import { ProductCategorySelectListItemResponse } from "../../../server/types/product-category";

export const getProductCategorySelectListApi = (outletId: string) => {
  return axiosInstance.get<ProductCategorySelectListItemResponse[]>(
    `/outlets/${outletId}/product-categories/select/list`
  );
};
