"use client";

import { cn } from "@/lib/utils";
import React, { useCallback } from "react";
import { Control, useController } from "react-hook-form";
import { Label } from "../../shadcn-components/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "../../shadcn-components/select";

export type TSelectFieldProps = {
  id?: string;
  isRequired?: boolean;
  label: string;
  options: { label: string; value: string | number }[];
  control?: Control<any>;
  name?: string;
} & React.ComponentProps<typeof SelectTrigger>;

const SelectField: React.FC<TSelectFieldProps> = (props) => {
  const { id, isRequired, label, options, control, name, className, ...rest } =
    props;

  const {
    field,
    fieldState: { error }
  } = useController({
    name: name || "",
    control
  });

  const renderLabel = useCallback((): React.ReactNode => {
    return (
      <Label htmlFor={id}>
        <div className="flex items-center gap-0.5 text-sm font-medium">
          {label}
          {isRequired && <span className="text-destructive">*</span>}
        </div>
      </Label>
    );
  }, [id, isRequired, label]);

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {renderLabel()}
      <div className="flex flex-col gap-0.5">
        <Select
          onValueChange={field.onChange}
          value={field.value?.toString() ?? ""}
        >
          <SelectTrigger
            id={id}
            className={cn(error && "border-destructive", className)}
            {...rest}
          >
            <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value.toString()}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {error ? (
          <p className="text-destructive text-sm">{error.message}</p>
        ) : null}
      </div>
    </div>
  );
};

export default SelectField;
