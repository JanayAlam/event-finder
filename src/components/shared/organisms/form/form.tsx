"use client";

import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect } from "react";
import { Control, FormState, useForm, UseFormReturn } from "react-hook-form";
import { z } from "zod";
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
  fields?: Array<(TFormField | React.ReactNode | null)[]>;
  defaultValues?: any;
  validationSchema?: T;
  isLoading?: boolean;
  submitButtonLabel?: string;
  submitButtonClassName?: string;
  onSubmitCallback: (data: z.infer<T>) => void | Promise<void>;
  onInvalidCallback?: (errors: FormState<z.input<T>>["errors"]) => void;
  isSubmitButtonLoading?: boolean;
  render?: (
    control: Control<z.input<T>>,
    formState: FormState<z.input<T>>
  ) => React.ReactNode;
  form?: UseFormReturn<z.input<T>>;
};

function Form<T extends z.ZodObject<any>>(
  props: TFormProps<T>
): React.ReactElement {
  const {
    fields: fieldDimension,
    defaultValues,
    validationSchema,
    isLoading,
    submitButtonLabel,
    submitButtonClassName,
    isSubmitButtonLoading,
    render,
    onSubmitCallback,
    onInvalidCallback
  } = props;

  const internalForm = useForm<z.input<T>>({
    defaultValues: defaultValues as any,
    resolver: validationSchema
      ? (zodResolver(validationSchema) as any)
      : undefined
  });

  const { control, handleSubmit, reset, formState } =
    props.form || internalForm;

  const { isSubmitting } = formState;

  useEffect(() => {
    if (!isLoading && defaultValues) {
      reset(defaultValues as any);
    }
  }, [defaultValues, reset, isLoading]);

  if (!fieldDimension && !render) {
    throw new Error(
      "One of field or render is required props of Form component"
    );
  }

  return (
    <form
      onSubmit={handleSubmit(
        onSubmitCallback as any,
        onInvalidCallback as any
      )}
      className="flex flex-col gap-4"
    >
      <div className="flex flex-col gap-4">
        {render
          ? render(control, formState)
          : fieldDimension?.map((dimension, idx) => (
              <div
                key={`${dimension.length}${idx}`}
                className={cn(
                  "grid gap-4",
                  "grid-cols-1",
                  dimension.length === 3
                    ? GRID_CLASSNAME["3"]
                    : dimension.length === 2
                      ? GRID_CLASSNAME["2"]
                      : GRID_CLASSNAME["1"]
                )}
              >
                {dimension.map((field, fieldIndex) =>
                  isFormField(field) ? (
                    isLoading ? (
                      <InputFieldSkeleton
                        key={`skeleton-${field.name}${fieldIndex}`}
                        isTextarea={field.type === "textarea"}
                      />
                    ) : (
                      <InputField
                        key={`${field.name}${fieldIndex}`}
                        id={field.name}
                        control={control}
                        type={field.type}
                        label={field.label}
                        name={field.name}
                        placeholder={field.placeholder}
                        isRequired={field.isRequired}
                        options={field.options}
                      />
                    )
                  ) : field ? (
                    <React.Fragment key={`node-${Math.random()}-${fieldIndex}`}>
                      {field}
                    </React.Fragment>
                  ) : (
                    <div
                      key={`empty-${fieldIndex}`}
                      className="hidden sm:block"
                    />
                  )
                )}
              </div>
            ))}
      </div>
      {!render ? (
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
      ) : null}
    </form>
  );
}

export default Form;
