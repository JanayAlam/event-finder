"use client";

import { Spin } from "antd";
import React, { useMemo } from "react";
import { useForm } from "react-hook-form";

// Components
import InputFieldWithLabel from "@/components/shared/molecules/inputs/InputFieldWithLabel";
import SelectFieldWithLabel from "@/components/shared/molecules/inputs/SelectFieldWithLabel";
import TextAreaWithLabel from "@/components/shared/molecules/inputs/TextAreaFieldWithLabel";
import Modal from "@/components/shared/organisms/modal";

// Types
import {
  createProductCategoryApi,
  getProductCategoryAvailableParentSelectListApi,
  getProductCategorySelectListApi,
  updateProductCategoryApi
} from "@/api/product-categories";
import { CommonApiError } from "@/app/_types/common/error";
import { useAuthStore } from "@/store/auth-store";
import { handlePrivateApiError } from "@/utils/error-handlers";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProductCategory } from "@prisma/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  ProductCategoryCreateRequest,
  ProductCategoryUpdateRequest
} from "../../../../../server/types/product-category";
import { ProductCategoryCreateDTOSchema } from "../../../../../server/validationSchemas/product-category";

interface CreateEditProductCategoryModalProps {
  isOpen: boolean;
  closeHandler: () => void;
  category?: ProductCategory;
}

const ProductCategoryFormModal: React.FC<
  CreateEditProductCategoryModalProps
> = ({ isOpen, closeHandler, category }) => {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const queryClient = useQueryClient();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isLoading }
  } = useForm<ProductCategoryCreateRequest>({
    resolver: zodResolver(ProductCategoryCreateDTOSchema),
    values: {
      title: category?.title || "",
      subtitle: category?.subtitle || "",
      slug: category?.slug || "",
      metaTitle: category?.metaTitle || "",
      metaDescription: category?.metaDescription || "",
      parentCategoryId: category?.parentCategoryId || undefined,
      categoryType: category?.categoryType || "PHYSICAL"
    }
  });

  const createCategoryMutation = useMutation({
    mutationFn: ({
      outletId,
      requestBody
    }: {
      outletId: string;
      requestBody: ProductCategoryCreateRequest;
    }) => createProductCategoryApi(outletId, requestBody),
    onSuccess: () => {
      toast.success("Category created successfully");
      queryClient.invalidateQueries({
        queryKey: ["productCategoryList"]
      });
      reset();
      closeHandler();
    },
    onError: () => {
      toast.error("Error creating category");
    }
  });

  const updateCategoryMutation = useMutation({
    mutationFn: ({
      outletId,
      productId,
      requestBody
    }: {
      outletId: string;
      productId: string;
      requestBody: ProductCategoryUpdateRequest;
    }) => updateProductCategoryApi(outletId, productId, requestBody),
    onSuccess: () => {
      toast.success("Category updated successfully");
      queryClient.invalidateQueries({
        queryKey: ["productCategoryList"]
      });
      reset();
      closeHandler();
    },
    onError: () => {
      toast.error("Error updating category");
    }
  });

  const onSubmit = (
    data: ProductCategoryCreateRequest | ProductCategoryUpdateRequest
  ) => {
    if (!user?.outlet?.id) return;

    if (category?.id) {
      updateCategoryMutation.mutate({
        outletId: user.outlet.id,
        productId: category.id,
        requestBody: data as ProductCategoryUpdateRequest
      });
      closeHandler();
      return;
    }

    createCategoryMutation.mutate({
      outletId: user.outlet.id,
      requestBody: data as ProductCategoryCreateRequest
    });
    closeHandler();
  };

  const modalTitle = category ? "Edit category" : "Create category";
  const modalOkText = category ? "Update" : "Create";

  const { data: allCategories, isLoading: isAllCategoriesLoading } = useQuery({
    queryKey: ["productCategories", user?.outlet?.id],
    queryFn: async () => {
      if (!user?.outlet?.id) return [];

      try {
        const { data } = await getProductCategorySelectListApi(user.outlet.id);
        return data;
      } catch (err) {
        const { data, error } = handlePrivateApiError(
          err as CommonApiError,
          logout
        );
        toast.error(
          data?.message ||
            error ||
            "Could not fetch product categories select list"
        );
        return [];
      }
    },
    enabled: !category && !!user?.outlet?.id
  });

  const { data: availableParents, isLoading: isAvailableParentsLoading } =
    useQuery({
      queryKey: ["availableParentCategories", user?.outlet?.id, category?.id],
      queryFn: async () => {
        if (!user?.outlet?.id || !category?.id) return [];
        try {
          const { data } = await getProductCategoryAvailableParentSelectListApi(
            user.outlet.id,
            category.id
          );
          return data;
        } catch (err) {
          const { data, error } = handlePrivateApiError(
            err as CommonApiError,
            logout
          );
          toast.error(
            data?.message ||
              error ||
              "Could not fetch product category's available select list"
          );
          return [];
        }
      },
      enabled: !!category && !!user?.outlet?.id
    });

  const parentCategoryOptions = useMemo(() => {
    const options = category ? availableParents || [] : allCategories || [];
    return options.map((option) => ({
      label: option.title,
      value: option.id
    }));
  }, [category, availableParents, allCategories]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Modal
        isOpen={isOpen}
        cancelHandler={closeHandler}
        title={modalTitle}
        okText={modalOkText}
        isOkLoading={isLoading}
      >
        {isAllCategoriesLoading || isAvailableParentsLoading ? (
          <div className="text-center">
            <Spin />
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <SelectFieldWithLabel
              allowClear
              label="Parent category"
              name="parentCategoryId"
              control={control}
              error={errors.parentCategoryId}
              placeholder="Select a parent category"
              options={parentCategoryOptions}
            />

            <InputFieldWithLabel
              isRequired
              control={control}
              label="Title"
              name="title"
              type="text"
              placeholder="e.g., Smartphones"
              error={errors.title}
            />

            <InputFieldWithLabel
              isRequired
              control={control}
              label="Slug"
              name="slug"
              type="text"
              placeholder="e.g., smartphones-category"
              error={errors.slug}
            />

            <InputFieldWithLabel
              control={control}
              label="Subtitle"
              name="subtitle"
              type="text"
              placeholder="e.g., Latest models and brands"
              error={errors.subtitle}
            />

            <SelectFieldWithLabel
              label="Category type"
              name="categoryType"
              control={control}
              error={errors.categoryType}
              defaultValue={category?.categoryType || "PHYSICAL"}
              options={[
                { label: "Physical", value: "PHYSICAL" },
                { label: "Digital", value: "DIGITAL" }
              ]}
            />

            <InputFieldWithLabel
              control={control}
              label="Meta title"
              name="metaTitle"
              type="text"
              placeholder="e.g., Buy Smartphones Online"
              error={errors.metaTitle}
            />

            <TextAreaWithLabel
              rows={2}
              control={control}
              label="Meta description"
              name="metaDescription"
              placeholder="e.g., Explore a wide range of smartphones from top brands at affordable prices."
              error={errors.metaDescription}
            />
          </div>
        )}
      </Modal>
    </form>
  );
};

export default ProductCategoryFormModal;
