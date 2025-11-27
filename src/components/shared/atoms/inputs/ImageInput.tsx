"use client";

import { cn } from "@/utils/tailwind-utils";
import { ImagePlus } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

type TImageInputProps = React.ComponentProps<"input"> & {
  /** Height = width * ratio. e.g. 0.75 means 3:4 (height 75% of width) */
  ratio?: number;
};

const ImageInput = React.forwardRef<HTMLInputElement, TImageInputProps>(
  (
    {
      ratio = 0.5,
      onChange: originalOnChange,
      className: inputClassName,
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

    return (
      <div>
        <input
          ref={inputRef}
          {...inputProps}
          type="file"
          onChange={handleChange}
          className="hidden"
          accept="Image/*"
        />

        <div
          role="button"
          onClick={handleClick}
          className={cn(
            `w-full rounded-md overflow-hidden cursor-pointer border border-dashed border-primary bg-primary-foreground`,
            inputClassName
          )}
          style={{ position: "relative" }}
        >
          <div style={{ paddingTop }} />
          <div
            style={{ position: "absolute", inset: 0 }}
            className="flex items-center justify-center"
          >
            {preview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={preview}
                alt="Selected"
                className="w-full h-full object-cover"
              />
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
