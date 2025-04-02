import React from "react";

type TextAlign =
  | "left"
  | "right"
  | "center"
  | "justify"
  | "initial"
  | "inherit";

export type LabelLevel = 1 | 2 | 3;

interface LabelProps {
  level?: LabelLevel;
  children: React.ReactNode;
  textAlign?: TextAlign;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLLabelElement>) => void;
}

const labelMobileFontSize = [
  "text-[1rem]",
  "text-[0.875rem]",
  "text-[0.75rem]"
];

const labelMobileLineHeight = [
  "leading-[1.25rem]",
  "leading-[1.125rem]",
  "leading-[1rem]"
];

const labelDesktopFontSize = [
  "text-[1rem]",
  "text-[0.875rem]",
  "text-[0.75rem]"
];

const labelDesktopLineHeight = [
  "leading-[1.25rem]",
  "leading-[1.125rem]",
  "leading-[1rem]"
];

const labelFontWeight = ["font-semibold", "font-medium", "font-normal"]; // 600, 500, 400

const Label: React.FC<LabelProps> = ({
  level = 1,
  children,
  textAlign = "left",
  className = "",
  onClick
}) => {
  return (
    <label
      className={`${labelMobileFontSize[level - 1]} ${labelMobileLineHeight[level - 1]} ${labelFontWeight[level - 1]} md:${labelDesktopFontSize[level - 1]} md:${labelDesktopLineHeight[level - 1]} text-${textAlign} text-[#3F4451] ${className}`}
      onClick={onClick}
    >
      {children}
    </label>
  );
};

export default Label;
