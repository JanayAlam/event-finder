"use client";

import { cn } from "@/utils/tailwind-utils";
import React, { useCallback } from "react";
import {
  FieldError,
  FieldErrorsImpl,
  Merge,
  UseFormRegisterReturn
} from "react-hook-form";
import { Label } from "../../shadcn-components/label";
import { Textarea } from "../../shadcn-components/textarea";

export type TTextareaFieldProps = {
  id?: string;
  isRequired?: boolean;
  label: string;
  error?: FieldError | Merge<FieldError, FieldErrorsImpl<any>>;
  register?: UseFormRegisterReturn<string>;
} & React.ComponentProps<"textarea">;

const getErrorMessage = (
  error?: FieldError | Merge<FieldError, FieldErrorsImpl<any>>
): string | undefined => {
  if (!error) return undefined;

  if (typeof error.message === "string") return error.message;

  if (typeof error === "object") {
    for (const key in error) {
      const nested = (error as any)[key];
      const msg = getErrorMessage(nested);
      if (msg) return msg;
    }
  }

  return undefined;
};

const TextareaField: React.FC<TTextareaFieldProps> = (props) => {
  const { id, isRequired, label, error, register, className, ...rest } = props;

  const renderLabel = useCallback((): React.ReactNode => {
    return (
      <Label htmlFor={id}>
        <div className="flex items-center gap-0.5">
          {label}
          {isRequired && <span className="text-destructive">*</span>}
        </div>
      </Label>
    );
  }, [id, isRequired, label]);

  return (
    <div className="flex flex-col gap-1.5">
      {renderLabel()}
      <div className="flex flex-col gap-0.5">
        <Textarea
          id={id}
          className={cn(error && "border border-destructive", className)}
          {...rest}
          {...register}
        />
        {error ? (
          <p className="text-destructive text-sm">{getErrorMessage(error)}</p>
        ) : null}
      </div>
    </div>
  );
};

export default TextareaField;
