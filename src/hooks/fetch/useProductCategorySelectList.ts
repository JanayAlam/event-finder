import { getProductCategorySelectListApi } from "@/api/product-categories";
import { CommonApiError } from "@/app/_types/common/error";
import { handlePrivateApiError } from "@/utils/error-handlers";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { ProductCategorySelectListItemResponse } from "../../../server/types/product-category";

const useProductCategorySelectList = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [categoryOptions, setCategoryOptions] = useState<
    ProductCategorySelectListItemResponse[]
  >([]);

  const fetchSelectList = useCallback(async () => {
    try {
      const { data } = await getProductCategorySelectListApi();
      setCategoryOptions(data);
    } catch (err) {
      const { data, error } = handlePrivateApiError(err as CommonApiError);
      toast.error(
        data?.message ||
          error ||
          "Could not fetch product categories select list"
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSelectList();
  }, [fetchSelectList]);

  return {
    isProductCategorySelectOptionLoading: isLoading,
    productCategorySelectOption: categoryOptions
  };
};

export default useProductCategorySelectList;
