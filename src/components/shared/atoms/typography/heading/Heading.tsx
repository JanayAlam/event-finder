import React, { JSX } from "react";

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

type TextAlign =
  | "left"
  | "right"
  | "center"
  | "justify"
  | "initial"
  | "inherit";

interface HeadingProps {
  level?: HeadingLevel;
  children: React.ReactNode;
  textAlign?: TextAlign;
  className?: string;
}

const headingMobileFontSize = [
  "text-[1.75rem]",
  "text-[1.5rem]",
  "text-[1.25rem]",
  "text-[1.25rem]",
  "text-[1.25rem]",
  "text-[1.25rem]"
];

const headingMobileLineHeight = [
  "leading-[2rem]",
  "leading-[1.875rem]",
  "leading-[1.75rem]",
  "leading-[1.75rem]",
  "leading-[1.75rem]",
  "leading-[1.75rem]"
];

const headingDesktopFontSize = [
  "text-[3.75rem]",
  "text-[3rem]",
  "text-[2.75rem]",
  "text-[2.25rem]",
  "text-[1.75rem]",
  "text-[1.5rem]"
];

const headingDesktopLineHeight = [
  "leading-[4.5rem]",
  "leading-[3.5rem]",
  "leading-[3.25rem]",
  "leading-[2.75rem]",
  "leading-[2.375rem]",
  "leading-[2rem]"
];

const headingFontWeight = [
  "font-bold", // 700
  "font-bold", // 700
  "font-bold", // 600
  "font-bold", // 600
  "font-bold", // 500
  "font-bold" // 400
];

const Heading: React.FC<HeadingProps> = ({
  level = 1,
  children,
  className = "",
  textAlign = "left"
}) => {
  const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements;

  return (
    <HeadingTag
      className={`${headingMobileFontSize[level - 1]} ${headingMobileLineHeight[level - 1]} ${headingFontWeight[level - 1]} md:${headingDesktopFontSize[level - 1]} md:${headingDesktopLineHeight[level - 1]} text-${textAlign} text-[#263B5E] ${className}`}
    >
      {children}
    </HeadingTag>
  );
};

export default Heading;
