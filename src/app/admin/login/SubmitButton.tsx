"use client";

interface IProps {}

import React from "react";
import { useFormStatus } from "react-dom";

const SubmitButton: React.FC<IProps> = () => {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="flex w-full justify-center rounded-md border border-transparent bg-sky-400 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-opacity-75 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2"
    >
      Login
    </button>
  );
};

export default SubmitButton;
