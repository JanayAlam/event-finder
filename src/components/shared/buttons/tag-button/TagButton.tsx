import React from "react";

interface TagButtonProps {
  title: React.ReactNode;
  colorType: "success" | "edit" | "delete" | "warning";
  onClick: () => void;
  hasNoPadding?: boolean;
  className?: string;
}

const TagButton: React.FC<TagButtonProps> = ({
  title,
  colorType,
  onClick,
  hasNoPadding = false,
  className
}) => {
  const buttonStyles = {
    success:
      "border border-green-500 text-green-600 bg-green-100 hover:bg-green-200",
    edit: "border border-blue-500 text-blue-600 bg-blue-100 hover:bg-blue-200",
    delete:
      "border border-error-500 text-error-600 bg-error-100 hover:bg-error-200",
    warning:
      "border border-warning-500 text-warning-600 bg-warning-100 hover:bg-warning-200"
  };

  return (
    <button
      onClick={onClick}
      className={`${hasNoPadding ? "px-0" : "px-2"} rounded-md font-normal text-sm ${buttonStyles[colorType]} ${className}`}
    >
      {title}
    </button>
  );
};

export default TagButton;
