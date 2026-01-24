import { cn } from "@/utils/tailwind-utils";
import React, { useCallback } from "react";
import {
  FieldError,
  FieldErrorsImpl,
  Merge,
  UseFormRegisterReturn
} from "react-hook-form";
import { ImageInput } from "../../atoms/inputs";
import { Input } from "../../shadcn-components/input";
import { Label } from "../../shadcn-components/label";

export type TInputFieldProps = {
  id?: string;
  isRequired?: boolean;
  label: string;
  error?: FieldError | Merge<FieldError, FieldErrorsImpl<any>>;
  register?: UseFormRegisterReturn<string>;
} & React.ComponentProps<"input">;

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

const InputField: React.FC<TInputFieldProps> = (props) => {
  const { id, isRequired, label, type, error, register, ...rest } = props;

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
    <div className="flex flex-col gap-2">
      {renderLabel()}
      <div className="flex flex-col gap-0.5">
        {type === "file" ? (
          <ImageInput
            type="file"
            id={id}
            className={cn(error && "border border-destructive")}
            {...rest}
            {...register}
          />
        ) : (
          <Input
            type={type ?? "text"}
            id={id}
            className={cn(error && "border border-destructive")}
            {...rest}
            {...register}
          />
        )}
        {error ? (
          <p className="text-destructive text-sm">{getErrorMessage(error)}</p>
        ) : null}
      </div>
    </div>
  );
};

export default InputField;
