import React, { PropsWithChildren } from "react";

const Button: React.FC<PropsWithChildren> = ({ children, ...rest }) => {
  return <button {...rest}>{children}</button>;
};

export default Button;
