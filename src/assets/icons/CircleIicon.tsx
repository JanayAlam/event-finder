import Icon from "@ant-design/icons";
import { PropsWithChildren } from "react";
import { IconProps } from "./icon-types";

const CircleSvg = () => (
  <svg
    width="10"
    height="10"
    viewBox="0 0 8 8"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="4" cy="4" r="3.5" stroke="currentColor" strokeOpacity="0.5" />
  </svg>
);

const CircleIcon: React.FC<PropsWithChildren<IconProps>> = (props) => (
  <Icon component={CircleSvg} {...props} />
);

export default CircleIcon;
