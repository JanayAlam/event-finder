"use client";

import Modal from "@/components/shared/organisms/modal";
import { ProductCategory } from "@prisma/client";
import React from "react";

interface CreateEditProductCategoryModalProps {
  isOpen: boolean;
  closeHandler: () => void;
  category?: ProductCategory;
}

const CreateEditProductCategoryModal: React.FC<
  CreateEditProductCategoryModalProps
> = ({ isOpen, closeHandler, category }) => {
  return (
    <Modal
      isOpen={isOpen}
      cancelHandler={closeHandler}
      title="Product category"
    >
      Something
    </Modal>
  );
};

export default CreateEditProductCategoryModal;
