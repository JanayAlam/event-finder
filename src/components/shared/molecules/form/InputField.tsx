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
  error?: FieldError | Merge<FieldError, FieldErrorsImpl<any>> | string;
  register?: UseFormRegister<FieldValues>;
} & Omit<React.ComponentProps<"input">, "name">;

const InputField: React.FC<TInputFieldProps> = (props) => {
  const {
    id,
    isRequired,
    label,
    name,
    type,
    error: _,
    register,
    ...rest
  } = props;

  const renderLabel = useCallback((): React.ReactNode => {
    if (!label) return null;
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
      <Input
        {...(register ? register(name) : {})}
        type={type ?? "text"}
        id={id}
        name={name}
        {...rest}
      />
    </div>
  );
};

export default InputField;
