import { Spinner } from "@heroui/react";
import React from "react";

const LoadingPage: React.FC = () => {
  return (
    <div className="h-screen w-full flex justify-center items-center">
      <Spinner size="lg" />
    </div>
  );
};

export default LoadingPage;
