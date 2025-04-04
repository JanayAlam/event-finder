import { createContext } from "react";

export interface IOpenConfirmModalParam {
  title: string;
  message?: string;
  modalType: "default" | "error";
  onConfirm: () => Promise<void> | void;
}

export interface IConfirmModalContext {
  openConfirmModal: (props: IOpenConfirmModalParam) => void;
}

export const ConfirmModalContext = createContext<IConfirmModalContext | null>(
  null
);
