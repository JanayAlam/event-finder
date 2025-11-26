"use client";

import { cn } from "@/utils/tailwind-utils";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { InputField, InputFieldSkeleton } from "../../molecules/form";
import { Button } from "../../shadcn-components/button";
import { Skeleton } from "../../shadcn-components/skeleton";
import { TFormField } from "./form.types";

const GRID_CLASSNAME = {
  "1": "xs:grid-cols-1",
  "2": "xs:grid-cols-2",
  "3": "xs:grid-cols-3"
};

const isFormField = (
  field: TFormField | React.ReactNode | null
): field is TFormField => {
  return field !== null && typeof field === "object" && "name" in field;
};

export type TFormProps<T extends z.ZodObject<any>> = {
  fields: Array<(TFormField | React.ReactNode | null)[]>;
  defaultValues?: any;
  validationSchema?: T;
  isLoading?: boolean;
  submitButtonLabel?: string;
  submitButtonClassName?: string;
  onSubmitCallback: (data: z.infer<T>) => void | Promise<void>;
  isSubmitButtonLoading?: boolean;
};

function Form<T extends z.ZodObject<any>>(
  props: TFormProps<T>
): React.ReactElement {
  const {
    fields: fieldDimention,
    defaultValues,
    validationSchema,
    isLoading,
    submitButtonLabel,
    submitButtonClassName,
    onSubmitCallback,
    isSubmitButtonLoading
  } = props;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<z.infer<T>>({
    defaultValues: defaultValues as any,
    resolver: validationSchema
      ? (zodResolver(validationSchema) as any)
      : undefined,
    reValidateMode: "onBlur"
  });

  useEffect(() => {
    if (!isLoading && defaultValues) {
      reset(defaultValues as any);
    }
  }, [defaultValues, reset, isLoading]);

  return (
    <form
      onSubmit={handleSubmit(onSubmitCallback)}
      className="flex flex-col gap-4"
    >
      <div className="flex flex-col gap-4">
        {fieldDimention.map((dimention, idx) => (
          <div
            key={`${dimention.length}${idx}`}
            className={cn(
              "grid gap-4",
              "grid-cols-1",
              dimention.length === 3
                ? GRID_CLASSNAME["3"]
                : dimention.length === 2
                  ? GRID_CLASSNAME["2"]
                  : GRID_CLASSNAME["1"]
            )}
          >
            {dimention.map((field, fieldIndex) =>
              isFormField(field) ? (
                isLoading ? (
                  <InputFieldSkeleton
                    key={`skeleton-${field.name}${fieldIndex}`}
                  />
                ) : (
                  <InputField
                    key={`${field.name}${fieldIndex}`}
                    register={register(field.name as any)}
                    type={field.type}
                    label={field.label}
                    name={field.name}
                    placeholder={field.placeholder}
                    isRequired={field.isRequired}
                    error={errors[field.name]}
                  />
                )
              ) : field ? (
                <React.Fragment key={`node-${Math.random()}-${fieldIndex}`}>
                  {field}
                </React.Fragment>
              ) : (
                <div key={`empty-${fieldIndex}`} className="hidden sm:block" />
              )
            )}
          </div>
        ))}
      </div>
      <div className="flex gap-4">
        {isLoading ? (
          <Skeleton className="h-9 w-24" />
        ) : (
          <Button
            type="submit"
            isLoading={isSubmitting || isSubmitButtonLoading}
            disabled={isSubmitting || isSubmitButtonLoading}
            className={submitButtonClassName}
          >
            {submitButtonLabel ?? "Submit"}
          </Button>
        )}
      </div>
    </form>
  );
}

export default Form;
