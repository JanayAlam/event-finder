import Label from "@/components/shared/atoms/typography/Label";
import Paragraph from "@/components/shared/atoms/typography/Paragraph";
import {
  Control,
  Controller,
  FieldError,
  FieldValues,
  Path,
  RegisterOptions
} from "react-hook-form";

interface InputFieldWithLabelProps<TFieldValues extends FieldValues> {
  name: Path<TFieldValues>;
  control: Control<TFieldValues>;
  label: string;
  placeholder?: string;
  type?: "text" | "password" | "email" | "number";
  rules?: Omit<
    RegisterOptions<TFieldValues, Path<TFieldValues>>,
    "valueAsNumber" | "valueAsDate" | "setValueAs" | "disabled"
  >;
  error?: FieldError;
  className?: string;
  isDisabled?: boolean;
  isRequired?: boolean;
}

function InputFieldWithLabel<TFieldValues extends FieldValues>({
  name,
  control,
  label,
  placeholder,
  type = "text",
  rules,
  error,
  className = "",
  isDisabled = false,
  isRequired = false
}: InputFieldWithLabelProps<TFieldValues>) {
  return (
    <div className={`flex flex-col w-full ${className}`}>
      <div className="flex gap-1">
        <Label level={2} className="mb-2">
          {label}
        </Label>
        {isRequired && <Paragraph className="text-error">*</Paragraph>}
      </div>
      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field }) => (
          <input
            {...field}
            type={type}
            placeholder={placeholder}
            className={`w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary ${error ? "focus:border-error focus:ring-error" : ""}`}
            disabled={isDisabled}
          />
        )}
      />
      {error ? (
        <Paragraph level={4} className="text-error">
          {error.message}
        </Paragraph>
      ) : null}
    </div>
  );
}

export default InputFieldWithLabel;
