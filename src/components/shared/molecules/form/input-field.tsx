import { cn } from "@/lib/utils";
import React, { useCallback, useMemo, useState } from "react";
import {
  Control,
  FieldError,
  FieldErrorsImpl,
  Merge,
  useController
} from "react-hook-form";
import { ImageInput } from "../../atoms/inputs";
import { DateInput } from "../../shadcn-components/date-input";
import { DateTimePicker } from "../../shadcn-components/datetime-picker";

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
    type?:
      | React.HTMLInputTypeAttribute
      | "select"
      | "editable-select"
      | "textarea"
      | "datetime-local";
  };

const parseDateTimeValue = (value: unknown): Date | undefined => {
  if (!value) return undefined;

  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? undefined : value;
  }

  if (typeof value === "string") {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? undefined : date;
  }

  return undefined;
};

const formatLocalDateTime = (value?: Date): string => {
  if (!value) return "";

  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");
  const hour = String(value.getHours()).padStart(2, "0");
  const minute = String(value.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hour}:${minute}`;
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
  const [isEditableSelectOpen, setIsEditableSelectOpen] = useState(false);

  const inputValue =
    typeof field.value === "string"
      ? field.value
      : field.value?.toString?.() || "";

  const filteredOptions = useMemo(() => {
    if (!options?.length) return [];
    const query = inputValue.trim().toLowerCase();
    if (!query) return options.slice(0, 100);

    return options
      .filter((option) => option.label.toLowerCase().includes(query))
      .slice(0, 100);
  }, [inputValue, options]);

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
        ) : type === "datetime-local" ? (
          <DateTimePicker
            id={id}
            className={cn(error && "border-destructive")}
            value={parseDateTimeValue(field.value)}
            onChange={(value) => field.onChange(formatLocalDateTime(value))}
            onBlur={field.onBlur}
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
        ) : type === "editable-select" ? (
          <div className="relative">
            <Input
              id={id}
              className={cn(error && "border border-destructive")}
              {...rest}
              {...field}
              value={inputValue}
              autoComplete="off"
              onFocus={() => setIsEditableSelectOpen(true)}
              onBlur={() => {
                field.onBlur();
                setTimeout(() => setIsEditableSelectOpen(false), 120);
              }}
            />
            {isEditableSelectOpen && filteredOptions.length ? (
              <div className="absolute top-full left-0 z-50 mt-1 max-h-56 w-full overflow-y-auto rounded-md border bg-popover p-1 text-popover-foreground shadow-md">
                {filteredOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    className="flex w-full cursor-pointer items-center rounded-sm px-2 py-1.5 text-left text-sm hover:bg-accent hover:text-accent-foreground"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      field.onChange(option.value);
                      setIsEditableSelectOpen(false);
                    }}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            ) : null}
          </div>
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
