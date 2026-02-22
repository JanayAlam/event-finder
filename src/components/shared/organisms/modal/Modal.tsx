"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/shared/shadcn-components/dialog";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import * as React from "react";
import { Button } from "../../shadcn-components/button";

export type TModalProps = {
  isOpen: boolean;
  closeHandler: () => void;
  okHandler?: () => void;
  loading?: boolean;
  title?: string;

  footer?: React.ReactNode;

  isCrossButtonVisible?: boolean;

  contentClassName?: string;
  headerClassName?: string;
  footerClassName?: string;

  cancelText?: string;
  okText?: string;
  buttonDisabled?: boolean;
  showFooter?: boolean;
};

export default function Modal({
  isOpen,
  closeHandler,
  okHandler,
  loading = false,
  title,
  children,
  footer,
  isCrossButtonVisible = true,
  contentClassName,
  headerClassName,
  footerClassName,
  cancelText = "Cancel",
  okText = "Ok",
  buttonDisabled = false,
  showFooter = true
}: React.PropsWithChildren<TModalProps>) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && closeHandler()}>
      <DialogContent
        className={cn(
          "sm:max-w-lg p-0 overflow-hidden gap-0",
          "border-border/60",
          "[&>button]:hidden",
          contentClassName
        )}
      >
        {(title || isCrossButtonVisible) && (
          <DialogHeader
            className={cn(
              "flex flex-row items-center justify-between space-y-0",
              "border-b border-b-border/60",
              "px-4 py-2 sm:px-4 sm:py-4",
              headerClassName
            )}
          >
            {title ? (
              <DialogTitle className="text-base font-semibold">
                {title}
              </DialogTitle>
            ) : (
              <span />
            )}

            {isCrossButtonVisible && (
              <DialogClose asChild>
                <button
                  type="button"
                  className="rounded-md p-1 hover:bg-accent"
                >
                  <X className="h-4 w-4" />
                </button>
              </DialogClose>
            )}
          </DialogHeader>
        )}

        {/* BODY */}
        <div className="bg-background px-4 py-4 sm:px-4 sm:py-6 max-h-[70vh] sm:max-h-[60vh] overflow-y-auto">
          {children}
        </div>

        {/* FOOTER */}
        {showFooter && (
          <div className="border-t border-t-border/60 px-4 py-2 sm:px-4 sm:py-4">
            {footer ? (
              footer
            ) : (
              <div className={cn("flex justify-end gap-2", footerClassName)}>
                <Button
                  variant="outline"
                  onClick={closeHandler}
                  disabled={buttonDisabled}
                >
                  {cancelText}
                </Button>
                <Button
                  onClick={okHandler}
                  isLoading={loading}
                  disabled={buttonDisabled || loading}
                >
                  {okText}
                </Button>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
