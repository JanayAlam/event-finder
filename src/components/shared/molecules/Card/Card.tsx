import React from "react";
import Heading from "../../atoms/typography/heading";

interface CardProps {
  header?: string | React.ReactNode;
  className?: string;
  children: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ header, children, className = "" }) => {
  return (
    <div
      className={`bg-background border border-gray-200 rounded-none md:rounded-[6px] ${className}`}
    >
      {header && (
        <div className="p-4 md:py-[30px] md:px-[24px]">
          {typeof header === "string" ? (
            <Heading level={6}>{header}</Heading>
          ) : (
            header
          )}
        </div>
      )}
      <div className="p-4 md:p-[24px]">{children}</div>
    </div>
  );
};

export default Card;
