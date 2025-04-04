import { useEffect, useRef } from "react";
import Title from "../../atoms/typography/Title";
import Button from "../../molecules/button";

interface ModalFooterProps {
  okText?: string;
  okHandler?: () => void;
  isOkLoading?: boolean;
  cancelText?: string;
  cancelHandler: () => void;
  okButtonColorType?: "primary" | "secondary" | "error" | "default";
}

interface ModalProps extends ModalFooterProps {
  isOpen?: boolean;
  title?: React.ReactNode;
  children?: React.ReactNode;
  footer?: React.ReactNode | null;
  width?: number | string;
  maskClosable?: boolean;
  centered?: boolean;
  className?: string;
  destroyOnClose?: boolean;
  zIndex?: number;
}

const getFooter = (
  footer: React.ReactNode | undefined,
  {
    okText,
    okHandler,
    cancelText,
    cancelHandler,
    isOkLoading,
    okButtonColorType
  }: Partial<ModalFooterProps>
) => {
  if (footer === undefined) {
    return (
      <div className="flex gap-2 items-center justify-end">
        <Button onClick={cancelHandler} type="button">
          {cancelText ?? "Cancel"}
        </Button>
        <Button
          onClick={okHandler}
          colorType={okButtonColorType || "primary"}
          type="submit"
          isLoading={isOkLoading}
        >
          {okText ?? "Ok"}
        </Button>
      </div>
    );
  }
  return footer;
};

const Modal: React.FC<ModalProps> = ({
  isOpen = false,
  title = "",
  children,
  footer,
  width = 520,
  okText,
  isOkLoading,
  okHandler,
  cancelText,
  cancelHandler,
  okButtonColorType,
  maskClosable = true,
  centered = false,
  className = "",
  destroyOnClose = false,
  zIndex = 1000
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        cancelHandler();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscapeKey);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
      document.body.style.overflow = "auto";
    };
  }, [isOpen, cancelHandler]);

  const handleMaskClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (
      modalRef.current &&
      !modalRef.current.contains(e.target as Node) &&
      maskClosable
    ) {
      cancelHandler();
    }
  };

  if (!isOpen && destroyOnClose) return null;

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-${zIndex} flex ${
        centered ? "items-center" : "items-start pt-24"
      } justify-center bg-black bg-opacity-50 transition-opacity duration-800 ease-in-out`}
      onClick={handleMaskClick}
      role="dialog"
      aria-modal="true"
    >
      <div
        ref={modalRef}
        className={`bg-white rounded-none md:rounded-md shadow-lg overflow-hidden ${className} transform transition-all duration-300 ease-in-out ${
          isOpen ? "translate-y-0 opacity-100" : "-translate-y-8 opacity-0"
        }`}
        style={{ width: typeof width === "number" ? `${width}px` : width }}
      >
        {/* Modal Header with bottom border */}
        {title && (
          <div className="px-6 py-3 flex items-center justify-between border-b border-gray-200">
            <Title level={1}>{title}</Title>
            <button
              onClick={cancelHandler}
              className="p-1 rounded-md hover:bg-gray-100 text-gray-600 focus:outline-none"
              aria-label="Close"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18 18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        )}

        {/* Modal Body */}
        <div className="px-6 py-4 max-h-[300px] md:max-h-[500px] overflow-auto">
          {children}
        </div>

        {/* Modal Footer with top border */}
        {footer !== null && (
          <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
            {getFooter(footer, {
              okText,
              cancelText,
              isOkLoading,
              okButtonColorType,
              okHandler,
              cancelHandler
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
