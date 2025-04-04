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

interface Option {
  value: string | number;
  label: string;
}

interface SelectWithLabelProps<TFieldValues extends FieldValues> {
  name: Path<TFieldValues>;
  control: Control<TFieldValues>;
  label: string;
  placeholder?: string;
  options: Option[];
  rules?: Omit<
    RegisterOptions<TFieldValues, Path<TFieldValues>>,
    "valueAsNumber" | "valueAsDate" | "setValueAs" | "disabled"
  >;
  error?: FieldError;
  className?: string;
  isDisabled?: boolean;
  isRequired?: boolean;
  defaultValue?: string | number;
  allowClear?: boolean;
}

function SelectFieldWithLabel<TFieldValues extends FieldValues>({
  name,
  control,
  label,
  placeholder,
  options,
  rules,
  error,
  className = "",
  defaultValue = "",
  isDisabled = false,
  isRequired = false,
  allowClear = false
}: SelectWithLabelProps<TFieldValues>) {
  return (
    <div className={`flex flex-col w-full ${className}`}>
      <div className="flex gap-1">
        <Label level={2} className="mb-2">
          {label}
        </Label>
        {isRequired ? <Paragraph className="text-error">*</Paragraph> : null}
      </div>
      <div className="relative">
        <Controller
          name={name}
          control={control}
          rules={rules}
          defaultValue={defaultValue as any}
          render={({ field }) => (
            <div className="relative">
              <select
                {...field}
                className={`w-full rounded-md border border-gray-300 px-3 py-2 pr-10 cursor-pointer appearance-none focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary ${
                  error ? "focus:border-error focus:ring-error" : ""
                }`}
                disabled={isDisabled}
              >
                {placeholder ? (
                  <option value="" disabled>
                    {placeholder}
                  </option>
                ) : null}
                {options.map((option) => (
                  <option
                    key={option.value}
                    value={option.value}
                    className="hover:bg-primary"
                  >
                    {option.label}
                  </option>
                ))}
              </select>

              {field.value && allowClear ? (
                <button
                  type="button"
                  className="absolute inset-y-0 right-7 flex items-center pr-1 text-gray-500 hover:text-primary"
                  onClick={() => field.onChange(undefined)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18 18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              ) : null}

              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-4 text-gray-400"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m19.5 8.25-7.5 7.5-7.5-7.5"
                  />
                </svg>
              </div>
            </div>
          )}
        />
      </div>
      {error ? (
        <Paragraph level={4} className="text-error">
          {error.message}
        </Paragraph>
      ) : null}
    </div>
  );
}

export default SelectFieldWithLabel;
