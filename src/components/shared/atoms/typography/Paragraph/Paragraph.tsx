import React from "react";

type TextAlign =
  | "left"
  | "right"
  | "center"
  | "justify"
  | "initial"
  | "inherit";

export type ParagraphLevel = 1 | 2 | 3 | 4 | 5 | 6;

interface ParagraphProps {
  level?: ParagraphLevel;
  children: React.ReactNode;
  textAlign?: TextAlign;
  fontWeight?: string;
  className?: string;
}

const paragraphMobileFontSize = [
  "text-[1rem]",
  "text-[1rem]",
  "text-[0.875rem]",
  "text-[0.875rem]",
  "text-[0.75rem]",
  "text-[0.75rem]"
];

const paragraphMobileLineHeight = [
  "leading-[1.5rem]",
  "leading-[1.5rem]",
  "leading-[1.3125rem]",
  "leading-[1.3125rem]",
  "leading-[1.125rem]",
  "leading-[1.125rem]"
];

const paragraphDesktopFontSize = [
  "text-[1.125rem]",
  "text-[1rem]",
  "text-[1rem]",
  "text-[0.875rem]",
  "text-[0.875rem]",
  "text-[0.75rem]"
];

const paragraphDesktopLineHeight = [
  "leading-[1.625rem]",
  "leading-[1.5rem]",
  "leading-[1.5rem]",
  "leading-[1.3125rem]",
  "leading-[1.3125rem]",
  "leading-[1.125rem]"
];

const Paragraph: React.FC<ParagraphProps> = ({
  level = 4,
  children,
  textAlign = "left",
  fontWeight,
  className = ""
}) => {
  return (
    <p
      className={`${paragraphMobileFontSize[level - 1]} ${paragraphMobileLineHeight[level - 1]} md:${paragraphDesktopFontSize[level - 1]} md:${paragraphDesktopLineHeight[level - 1]} text-${textAlign} ${fontWeight ? "font-" + fontWeight : "font-normal"} text-[#3F4451] ${className}`}
    >
      {children}
    </p>
  );
};

export default Paragraph;
