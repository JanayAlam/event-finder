import Modal from "@/components/shared/organisms/modal";
import useModal from "@/hooks/general/useModal";
import React, {
  PropsWithChildren,
  useCallback,
  useMemo,
  useState
} from "react";
import {
  ConfirmModalContext,
  IOpenConfirmModalParam
} from "./ConfirmModalContext";

export const ConfirmModalProvider: React.FC<PropsWithChildren> = (props) => {
  const { isOpen, openModalHandler, closeModalHandler } = useModal();

  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] =
    useState<IOpenConfirmModalParam["title"]>("Confirm");
  const [message, setMessage] =
    useState<IOpenConfirmModalParam["message"]>("Are you sure?");
  const [modalType, setModalType] =
    useState<IOpenConfirmModalParam["modalType"]>("default");
  const [onConfirm, setOnConfirm] = useState<
    IOpenConfirmModalParam["onConfirm"]
  >(() => () => {});

  const openConfirmModal = useCallback(
    ({ title, message, modalType, onConfirm }: IOpenConfirmModalParam) => {
      setTitle(title);
      setMessage(message || "Are you sure?");
      setModalType(modalType);
      setOnConfirm(() => onConfirm);
      openModalHandler();
    },
    [openModalHandler]
  );

  const closeConfirmModal = useCallback(() => {
    setTitle("Confirm");
    setMessage("Are you sure?");
    setModalType("default");
    setOnConfirm(() => () => {});
    closeModalHandler();
  }, [closeModalHandler]);

  const okHandler = useCallback(async () => {
    setIsLoading(true);
    await onConfirm();
    setIsLoading(false);
    closeConfirmModal();
  }, [onConfirm, closeConfirmModal]);

  const value = useMemo(
    () => ({
      openConfirmModal
    }),
    [openConfirmModal]
  );

  return (
    <ConfirmModalContext.Provider value={value}>
      {props.children}
      {isOpen ? (
        <Modal
          isOpen={isOpen}
          title={title}
          okText="Confirm"
          isOkLoading={isLoading}
          okHandler={okHandler}
          okButtonColorType={modalType}
          cancelHandler={closeConfirmModal}
        >
          {/* TODO */}
          <p>{message}</p>
        </Modal>
      ) : null}
    </ConfirmModalContext.Provider>
  );
};
