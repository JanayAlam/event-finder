import { cn } from "@/lib/utils";
import React, { useCallback } from "react";
import {
  Control,
  FieldError,
  FieldErrorsImpl,
  Merge,
  useController
} from "react-hook-form";
import { ImageInput } from "../../atoms/inputs";
import { DateInput } from "../../shadcn-components/date-input";

import { Input } from "../../shadcn-components/input";
import { Label } from "../../shadcn-components/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "../../shadcn-components/select";

import { Textarea } from "../../shadcn-components/textarea";

export type TInputFieldProps = {
  id?: string;
  isRequired?: boolean;
  label: string;
  error?: FieldError | Merge<FieldError, FieldErrorsImpl<any>>;
  control?: Control<any>;
  name?: string;
  options?: { label: string; value: string }[];
} & Omit<React.ComponentProps<"input">, "type"> & {
    type?: React.HTMLInputTypeAttribute | "select" | "textarea";
  };

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
  const {
    id,
    isRequired,
    label,
    type,
    error: propError,
    control,
    name,
    options,
    ...rest
  } = props;

  const {
    field,
    fieldState: { error: controllerError }
  } = useController({
    name: name || "",
    control
  });

  const error = propError || controllerError;

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
            {...field}
            {...(rest as Omit<typeof rest, "value">)}
            value={typeof field.value === "string" ? field.value : undefined}
          />
        ) : type === "date" ? (
          <DateInput
            id={id}
            className={cn(error && "border border-destructive")}
            value={field.value}
            onChange={field.onChange}
            onBlur={field.onBlur}
            name={field.name}
          />
        ) : type === "select" ? (
          <Select
            onValueChange={field.onChange}
            value={field.value}
            key={field.value}
          >
            <SelectTrigger
              id={id}
              className={cn(error && "border border-destructive")}
            >
              <SelectValue
                placeholder={rest.placeholder || "Select an option"}
              />
            </SelectTrigger>
            <SelectContent>
              {options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : type === "textarea" ? (
          <Textarea
            id={id}
            className={cn(error && "border border-destructive")}
            {...(rest as any)}
            {...field}
            value={field.value ?? ""}
          />
        ) : (
          <Input
            type={type ?? "text"}
            id={id}
            className={cn(error && "border border-destructive")}
            {...rest}
            {...field}
            value={field.value ?? ""}
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
