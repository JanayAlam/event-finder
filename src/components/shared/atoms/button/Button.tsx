import { ButtonProps, Button as HeroButton } from "@heroui/react";
import React from "react";

const Button: React.FC<ButtonProps> = ({ children, className, ...rest }) => {
  return (
    <HeroButton
      disableAnimation
      radius="sm"
      color="default"
      className={className ?? ""}
      {...rest}
    >
      {children}
    </HeroButton>
  );
};

export default Button;
