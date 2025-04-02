import Toggle from "@/components/shared/atoms/inputs/Toggle";
import Label from "@/components/shared/atoms/typography/Label";
import React from "react";

interface ToggleInputProps {
  label: string;
  size?: "small" | "middle";
  isChecked?: boolean;
  name?: string;
  defaultChecked?: boolean;
  isDisabled?: boolean;
  onChange?: (
    name: string | undefined,
    checked: boolean,
    event:
      | React.MouseEvent<HTMLButtonElement, MouseEvent>
      | React.KeyboardEvent<HTMLButtonElement>
  ) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  isLoading?: boolean;
  className?: string;
}

const ToggleInput: React.FC<ToggleInputProps> = ({
  label,
  isChecked,
  onChange,
  name,
  onFocus,
  isLoading,
  isDisabled = false,
  className = "",
  size = "small"
}) => {
  const handleLabelClick = () => {
    if (onChange) {
      onChange(name, !isChecked, {} as React.MouseEvent<HTMLButtonElement>);
    }
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Toggle
        isChecked={isChecked}
        isLoading={isLoading}
        onFocus={onFocus}
        name={name}
        onChange={onChange}
        isDisabled={isDisabled}
        size={size}
      />
      <Label
        className={`text-sm font-medium text-gray-700 cursor-pointer ${
          isDisabled ? "cursor-not-allowed text-gray-400" : ""
        }`}
        onClick={!isDisabled ? handleLabelClick : undefined}
      >
        {label}
      </Label>
    </div>
  );
};

export default ToggleInput;
