import { TInputFieldProps } from "../../molecules/form";

export type TFormField = {
  name: string;
  label: string;
  placeholder?: string;
  isRequired?: boolean;
  type: TInputFieldProps["type"];
  options?: TInputFieldProps["options"];
};
