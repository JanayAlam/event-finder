"use client";

import { cn } from "@/lib/utils";
import React from "react";
import { Control, useController } from "react-hook-form";
import { Label } from "../../shadcn-components/label";
import { Slider } from "../../shadcn-components/slider";

export type TSliderFieldProps = {
  id?: string;
  isRequired?: boolean;
  label: string;
  control?: Control<any>;
  name?: string;
} & React.ComponentProps<typeof Slider>;

const SliderField: React.FC<TSliderFieldProps> = (props) => {
  const { id, isRequired, label, control, name, className, ...rest } = props;

  const {
    field,
    fieldState: { error }
  } = useController({
    name: name || "",
    control
  });

  const value = field.value ?? 1;

  const getColorClass = (val: number) => {
    if (val <= 2) return "destructive";
    if (val === 3) return "primary";
    return "success";
  };

  const color = getColorClass(value);

  return (
    <div className="flex flex-col gap-3 w-full">
      <Label htmlFor={id}>
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-0.5 text-sm font-medium">
            {label}
            {isRequired && <span className="text-destructive">*</span>}
          </div>
          <span
            className={cn(
              "text-sm font-bold transition-colors",
              color === "destructive" && "text-destructive",
              color === "primary" && "text-primary",
              color === "success" && "text-success"
            )}
          >
            {value}
          </span>
        </div>
      </Label>
      <div className="flex flex-col gap-1.5">
        <Slider
          id={id}
          className={cn("py-4", className)}
          {...rest}
          value={[value]}
          onValueChange={(values) => field.onChange(values[0])}
          rangeClassName={cn(
            "transition-colors",
            color === "destructive" && "bg-destructive",
            color === "primary" && "bg-primary",
            color === "success" && "bg-success"
          )}
          trackClassName={cn(
            "transition-colors",
            color === "destructive" && "bg-destructive/20",
            color === "primary" && "bg-primary/20",
            color === "success" && "bg-success/20"
          )}
          thumbClassName={cn(
            "transition-colors",
            color === "destructive" && "border-destructive",
            color === "primary" && "border-primary",
            color === "success" && "border-success"
          )}
        />
        {error ? (
          <p className="text-destructive text-sm">{error.message}</p>
        ) : null}
      </div>
    </div>
  );
};

export default SliderField;
