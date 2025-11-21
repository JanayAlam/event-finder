"use client";

import { cn } from "@/utils/tailwind-utils";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useMemo } from "react";
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

export type TFormProps<T extends z.ZodObject<any>> = {
  fields: Array<(TFormField | null)[]>;
  validationSchema?: T;
  isLoading?: boolean;
  submitButtonLabel?: string;
  onSubmitCallback: (data: z.infer<T>) => void | Promise<void>;
};

function Form<T extends z.ZodObject<any>>(
  props: TFormProps<T>
): React.ReactElement {
  const {
    fields: fieldDimention,
    validationSchema,
    isLoading,
    submitButtonLabel,
    onSubmitCallback
  } = props;

  const formDefaultValues = useMemo(
    () =>
      fieldDimention.flat().reduce(
        (acc, cur) => {
          if (cur !== null) {
            acc[cur.name] = cur.value;
          }
          return acc;
        },
        {} as Record<string, any>
      ),
    [fieldDimention]
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<z.infer<T>>({
    defaultValues: formDefaultValues as any,
    resolver: validationSchema
      ? (zodResolver(validationSchema) as any)
      : undefined
  });

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
              field !== null ? (
                isLoading ? (
                  <InputFieldSkeleton
                    key={`skeleton-${field.name}${fieldIndex}`}
                  />
                ) : (
                  <InputField
                    key={`${field.name}${fieldIndex}`}
                    register={register as any}
                    type={field.type}
                    label={field.label}
                    name={field.name}
                    placeholder={field.placeholder}
                    error={errors[field.name]}
                  />
                )
              ) : (
                <div key={`empty-${fieldIndex}`} />
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
            isLoading={isSubmitting}
            disabled={isSubmitting}
          >
            {submitButtonLabel ?? "Submit"}
          </Button>
        )}
      </div>
    </form>
  );
}

export default Form;
