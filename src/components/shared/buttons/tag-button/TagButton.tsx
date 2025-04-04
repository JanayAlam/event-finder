import React from "react";

interface TagButtonProps {
  title: string;
  colorType: "success" | "edit" | "delete";
  onClick: () => void;
}

const TagButton: React.FC<TagButtonProps> = ({ title, colorType, onClick }) => {
  const buttonStyles = {
    success:
      "border border-green-500 text-green-600 bg-green-100 hover:bg-green-200",
    edit: "border border-blue-500 text-blue-600 bg-blue-100 hover:bg-blue-200",
    delete:
      "border border-error-500 text-error-600 bg-error-100 hover:bg-error-200"
  };

  return (
    <button
      onClick={onClick}
      className={`px-2 rounded-md font-normal text-sm ${buttonStyles[colorType]}`}
    >
      {title}
    </button>
  );
};

export default TagButton;
