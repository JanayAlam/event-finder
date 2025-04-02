import React from "react";

type TTextAlign =
  | "left"
  | "right"
  | "center"
  | "justify"
  | "initial"
  | "inherit";
export type TTitleLevel = 1 | 2 | 3;

interface TitleProps {
  level?: TTitleLevel;
  children: React.ReactNode;
  textAlign?: TTextAlign;
  className?: string;
}

const titleMobileFontSize = [
  "text-[1.125rem]",
  "text-[1rem]",
  "text-[0.875rem]"
];
const titleMobileLineHeight = [
  "leading-[1.625rem]",
  "leading-[1.5rem]",
  "leading-[1.3125rem]"
];

const titleDesktopFontSize = [
  "text-[1.25rem]",
  "text-[1.125rem]",
  "text-[1rem]"
];
const titleDesktopLineHeight = [
  "leading-[2rem]",
  "leading-[1.625rem]",
  "leading-[1.5rem]"
];

const titleFontWeight = ["font-semibold", "font-semibold", "font-medium"]; // 600, 600, 500

const Title: React.FC<TitleProps> = ({
  level = 1,
  children,
  textAlign = "left",
  className = ""
}) => {
  return (
    <p
      className={`${titleMobileFontSize[level - 1]} ${titleMobileLineHeight[level - 1]} md:${titleDesktopFontSize[level - 1]} md:${titleDesktopLineHeight[level - 1]} ${titleFontWeight[level - 1]} text-${textAlign} text-[#2D3039] ${className}`}
    >
      {children}
    </p>
  );
};

export default Title;
