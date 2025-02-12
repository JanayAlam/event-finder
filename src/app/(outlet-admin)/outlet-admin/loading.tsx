import { Spin } from "antd";
import React from "react";

const LoadingPage: React.FC = () => {
  return (
    <div className="h-screen w-full flex justify-center items-center">
      <Spin />
    </div>
  );
};

export default LoadingPage;
