import { TInputFieldProps } from "../../molecules/form";

export type TFormField = {
  name: string;
  label: string;
  value: any;
  placeholder?: string;
  type: TInputFieldProps["type"];
};
