import React, { useCallback } from "react";
import { Input } from "../../shadcn-components/input";
import { Label } from "../../shadcn-components/label";

type TInputFieldProps = {
  id?: string;
  isRequired?: boolean;
  label: string;
} & React.ComponentProps<"input">;

const InputField: React.FC<TInputFieldProps> = (props) => {
  const { id, isRequired, label, type, ...rest } = props;

  const renderLabel = useCallback((): React.ReactNode => {
    if (!label) return null;
    return (
      <Label htmlFor={id}>
        <div className="flex items-center">
          {label}
          {isRequired && <span className="text-destructive">*</span>}
        </div>
      </Label>
    );
  }, [id, isRequired, label]);

  return (
    <div className="flex flex-col gap-1.5">
      {renderLabel()}
      <Input type={type ?? "text"} id={id} {...rest} />
    </div>
  );
};

export default InputField;
