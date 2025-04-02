"use client";

import { Switch } from "antd";
import { SwitchChangeEventHandler } from "antd/lib/switch";
import React from "react";

interface ToggleProps {
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
}

const Toggle: React.FC<ToggleProps> = (props) => {
  const {
    size = "small",
    isChecked,
    name,
    defaultChecked,
    isDisabled,
    onChange,
    isLoading
  } = props;

  const toggleSize = size === "small" ? "small" : "default";

  const wrapOnChange: SwitchChangeEventHandler = (
    isChecked: boolean,
    event:
      | React.MouseEvent<HTMLButtonElement, MouseEvent>
      | React.KeyboardEvent<HTMLButtonElement>
  ) => {
    if (onChange) {
      onChange(name, isChecked, event);
    }
  };

  return (
    <Switch
      size={toggleSize}
      checked={isChecked}
      defaultChecked={defaultChecked}
      disabled={isDisabled}
      onChange={wrapOnChange}
      loading={isLoading}
    />
  );
};

export default Toggle;
