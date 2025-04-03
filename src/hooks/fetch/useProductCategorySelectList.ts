import { getProductCategorySelectListApi } from "@/api/product-categories";
import { CommonApiError } from "@/app/_types/common/error";
import { useAuthStore } from "@/store/auth-store";
import { handlePrivateApiError } from "@/utils/error-handlers";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { ProductCategorySelectListItemResponse } from "../../../server/types/product-category";

const useProductCategorySelectList = () => {
  const user = useAuthStore((state) => state.user);

  const [isLoading, setIsLoading] = useState(true);
  const [categoryOptions, setCategoryOptions] = useState<
    ProductCategorySelectListItemResponse[]
  >([]);

  const fetchSelectList = useCallback(async () => {
    if (!user?.outlet?.id) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    try {
      const { data } = await getProductCategorySelectListApi(user.outlet.id);
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
  }, [user]);

  useEffect(() => {
    fetchSelectList();
  }, [fetchSelectList]);

  return {
    isProductCategorySelectOptionLoading: isLoading,
    productCategorySelectOption: categoryOptions
  };
};

export default useProductCategorySelectList;
