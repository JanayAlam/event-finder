import React from "react";

interface Props {
  text?: string;
  icon?: React.ReactNode;
  className?: string;
}

const TextButton: React.FC<Props> = ({ text, icon, className }) => {
  return (
    <button
      className={
        "p-4 flex gap-2 btn btn-ghost hover:bg-red-400" + className || ""
      }
    >
      {icon}
      {text}
    </button>
  );
};

export default TextButton;
