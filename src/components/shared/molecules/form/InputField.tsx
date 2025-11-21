import { cn } from "@/utils/tailwind-utils";
import React, { useCallback } from "react";
import {
  FieldError,
  FieldErrorsImpl,
  FieldValues,
  Merge,
  UseFormRegister
} from "react-hook-form";
import { Input } from "../../shadcn-components/input";
import { Label } from "../../shadcn-components/label";

export type TInputFieldProps = {
  id?: string;
  isRequired?: boolean;
  label: string;
  name: string;
  error?: FieldError | Merge<FieldError, FieldErrorsImpl<any>>;
  register?: UseFormRegister<FieldValues>;
} & Omit<React.ComponentProps<"input">, "name">;

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
  const { id, isRequired, label, name, type, error, register, ...rest } = props;

  const renderLabel = useCallback((): React.ReactNode => {
    return (
      <Label htmlFor={id}>
        <div className="flex items-center">
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
        <Input
          {...(register ? register(name) : {})}
          type={type ?? "text"}
          id={id}
          name={name}
          className={cn(error && "border border-destructive")}
          {...rest}
        />
        {error ? (
          <p className="text-destructive text-sm">{getErrorMessage(error)}</p>
        ) : null}
      </div>
    </div>
  );
};

export default InputField;
