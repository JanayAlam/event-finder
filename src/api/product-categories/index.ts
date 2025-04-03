import { axiosInstance } from "@/axios";
import { ProductCategorySelectListItemResponse } from "../../../server/types/product-category";

export const getProductCategorySelectListApi = () => {
  return axiosInstance.get<ProductCategorySelectListItemResponse[]>(
    `/product-categories/select/list`
  );
};
