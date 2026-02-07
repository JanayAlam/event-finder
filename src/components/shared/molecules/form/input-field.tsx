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

export type TInputFieldProps = {
  id?: string;
  isRequired?: boolean;
  label: string;
  error?: FieldError | Merge<FieldError, FieldErrorsImpl<any>>;
  control?: Control<any>;
  name?: string;
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
  const {
    id,
    isRequired,
    label,
    type,
    error: propError,
    control,
    name,
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
