import { useState } from "react";

const useModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  const openModalHandler = () => setIsOpen(true);
  const closeModalHandler = (cb?: () => void) => setIsOpen(false);
  const submitModalHandler = (cb?: () => void) => {};

  return { isOpen, openModalHandler, closeModalHandler, submitModalHandler };
};

export default useModal;
