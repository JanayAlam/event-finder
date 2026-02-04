"use client";

import { API_BASE_URL } from "@/config";
import { cn } from "@/utils/tailwind-utils";
import { ImagePlus, Trash2 } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "../../shadcn-components/button";
import { Spinner } from "../../shadcn-components/spinner/Spinner";

type TImageInputProps = React.ComponentProps<"input"> & {
  ratio?: number;
  isLoading?: boolean;
  value?: string | null;
  onRemove?: () => void;
};

const ImageInput = React.forwardRef<HTMLInputElement, TImageInputProps>(
  (
    {
      ratio = 0.5,
      onChange: originalOnChange,
      className: inputClassName,
      isLoading = false,
      value = null,
      onRemove,
      ...inputProps
    },
    forwardedRef
  ) => {
    const internalRef = useRef<HTMLInputElement>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const prevUrlRef = useRef<string | null>(null);

    const inputRef = (node: HTMLInputElement | null) => {
      internalRef.current = node;
      if (typeof forwardedRef === "function") {
        forwardedRef(node);
      } else if (forwardedRef) {
        forwardedRef.current = node;
      }
    };

    const handleClick = () => {
      if (isLoading) return;
      internalRef.current?.click();
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files[0]) {
        const url = URL.createObjectURL(files[0]);
        setPreview(url);
        if (prevUrlRef.current) {
          try {
            URL.revokeObjectURL(prevUrlRef.current);
          } catch {}
        }
        prevUrlRef.current = url;
      }

      if (typeof originalOnChange === "function") {
        originalOnChange(e);
      }
    };

    useEffect(() => {
      return () => {
        if (prevUrlRef.current) {
          try {
            URL.revokeObjectURL(prevUrlRef.current);
          } catch {}
        }
      };
    }, []);

    const paddingTop = `${ratio * 100}%`;

    // Priority: internal preview (selected file) > value prop (server path)
    const effectivePreview =
      preview || (value ? `${API_BASE_URL}/${value}` : null);

    return (
      <div>
        <input
          ref={inputRef}
          {...inputProps}
          type="file"
          onChange={handleChange}
          className="hidden"
          accept="image/*"
        />

        <div
          role="button"
          onClick={handleClick}
          className={cn(
            "w-full rounded-md overflow-hidden cursor-pointer border border-dashed border-input bg-primary-foreground relative transition-opacity group",
            inputClassName,
            isLoading && "opacity-60 cursor-not-allowed"
          )}
        >
          <div style={{ paddingTop }} />
          <div className="absolute inset-0 flex items-center justify-center transition-all">
            {isLoading ? (
              <Spinner className="text-brand-primary-main" />
            ) : effectivePreview ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={effectivePreview}
                  alt="Selected"
                  className="w-full h-full object-cover"
                />
                {onRemove && (
                  <Button
                    type="button"
                    size="icon"
                    className="absolute top-2 right-2 size-7 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity z-10"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (internalRef.current) {
                        internalRef.current.value = "";
                      }
                      setPreview(null);
                      onRemove();
                    }}
                  >
                    <Trash2 className="size-4 text-destructive" />
                  </Button>
                )}
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center gap-1 text-sm text-muted-foreground">
                <ImagePlus className="size-4" />
                <span>Click to select image</span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
);

ImageInput.displayName = "ImageInput";

export default ImageInput;
