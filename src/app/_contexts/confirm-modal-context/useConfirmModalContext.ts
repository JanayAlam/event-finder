import { useContext } from "react";
import { ConfirmModalContext } from "./ConfirmModalContext";

export const useConfirmModalContext = () => {
  const context = useContext(ConfirmModalContext);

  if (!context) {
    throw new Error(
      "useConfirmModalContext must be used within a ConfirmModalProvider"
    );
  }

  return context;
};
