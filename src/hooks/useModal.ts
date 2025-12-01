import { useState } from "react";

const useModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  const openModalHandler = () => setIsOpen(true);
  const closeModalHandler = (_cb?: () => void) => setIsOpen(false);
  const submitModalHandler = (_cb?: () => void) => {};

  return { isOpen, openModalHandler, closeModalHandler, submitModalHandler };
};

export default useModal;
