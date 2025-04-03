"use client";

import SelectFieldWithLabel from "@/components/shared/molecules/inputs/SelectFieldWithLabel";
import Modal from "@/components/shared/organisms/modal";
import { ProductCategory } from "@prisma/client";
import React from "react";
import { useForm } from "react-hook-form";

interface FormValues {
  parentCategoryId?: string;
}
interface CreateEditProductCategoryModalProps {
  isOpen: boolean;
  closeHandler: () => void;
  category?: ProductCategory;
}

const CreateEditProductCategoryModal: React.FC<
  CreateEditProductCategoryModalProps
> = ({ isOpen, closeHandler, category }) => {
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<FormValues>();

  return (
    <Modal
      isOpen={isOpen}
      cancelHandler={closeHandler}
      title="Product category"
    >
      <SelectFieldWithLabel
        label="Parent category"
        name="parentCategoryId"
        control={control}
        error={errors.parentCategoryId}
        placeholder="Select a parent"
        options={[
          { value: "anika", label: "Anika" },
          { value: "alam", label: "Alam" },
          { value: "sara", label: "Sara" }
        ]}
        rules={{ required: "Parent category is required" }}
      />
    </Modal>
  );
};

export default CreateEditProductCategoryModal;
