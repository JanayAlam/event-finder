"use client";

import Link from "next/link";
import { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

export type ButtonColorType =
  | "primary"
  | "secondary"
  | "success"
  | "error"
  | "warning"
  | "default";
export type ButtonVariant = "solid" | "outlined" | "rounded" | "icon";
export type ButtonSize = "small" | "medium" | "large";
export type IconPosition = "left" | "right" | "both";

interface BaseProps {
  colorType?: ButtonColorType;
  variant?: ButtonVariant;
  size?: ButtonSize;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  iconPosition?: IconPosition;
  children?: ReactNode;
  className?: string;
  fullWidth?: boolean;
  disabled?: boolean;
}

export interface ButtonProps
  extends BaseProps,
    ButtonHTMLAttributes<HTMLButtonElement> {
  href?: undefined;
}

export interface LinkButtonProps
  extends BaseProps,
    Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
  href: string;
}

export type CombinedButtonProps = ButtonProps | LinkButtonProps;

const isLinkProps = (props: CombinedButtonProps): props is LinkButtonProps => {
  return props.href !== undefined;
};

const Button = (props: CombinedButtonProps) => {
  const {
    colorType = "default",
    variant = "solid",
    size = "medium",
    leftIcon,
    rightIcon,
    iconPosition = "left",
    children,
    className = "",
    fullWidth = false,
    disabled = false,
    ...rest
  } = props;

  const sizeStyles = {
    small: "text-xs py-1 px-4",
    medium: "text-sm py-2 px-6",
    large: "text-base py-3 px-8"
  };

  const iconSizeStyles = {
    small: "p-1",
    medium: "p-2",
    large: "p-3"
  };

  const buttonSizeStyles =
    variant === "icon" ? iconSizeStyles[size] : sizeStyles[size];

  const colorStyles = {
    solid: {
      primary:
        "bg-primary hover:bg-primary-600 focus:bg-primary-600 active:bg-primary-700 text-white",
      secondary:
        "bg-secondary hover:bg-secondary-600 focus:bg-secondary-600 active:bg-secondary-700 text-white",
      success:
        "bg-success hover:bg-success-600 focus:bg-success-600 active:bg-success-700 text-white",
      error:
        "bg-error hover:bg-error-600 focus:bg-error-600 active:bg-error-700 text-white",
      warning:
        "bg-warning hover:bg-warning-600 focus:bg-warning-600 active:bg-warning-700 text-white",
      default:
        "bg-gray-200 hover:bg-gray-300 focus:bg-gray-300 active:bg-gray-400 text-gray-800"
    },
    outlined: {
      primary:
        "border border-primary text-primary hover:bg-primary-50 focus:bg-primary-50 active:bg-primary-100",
      secondary:
        "border border-secondary text-secondary hover:bg-secondary-50 focus:bg-secondary-50 active:bg-secondary-100",
      success:
        "border border-success text-success hover:bg-success-50 focus:bg-success-50 active:bg-success-100",
      error:
        "border border-error text-error hover:bg-error-50 focus:bg-error-50 active:bg-error-100",
      warning:
        "border border-warning text-warning hover:bg-warning-50 focus:bg-warning-50 active:bg-warning-100",
      default:
        "border border-gray-300 text-gray-700 hover:bg-gray-50 focus:bg-gray-50 active:bg-gray-100"
    },
    rounded: {
      primary:
        "bg-primary hover:bg-primary-600 focus:bg-primary-600 active:bg-primary-700 text-white rounded-full",
      secondary:
        "bg-secondary hover:bg-secondary-600 focus:bg-secondary-600 active:bg-secondary-700 text-white rounded-full",
      success:
        "bg-success hover:bg-success-600 focus:bg-success-600 active:bg-success-700 text-white rounded-full",
      error:
        "bg-error hover:bg-error-600 focus:bg-error-600 active:bg-error-700 text-white rounded-full",
      warning:
        "bg-warning hover:bg-warning-600 focus:bg-warning-600 active:bg-warning-700 text-white rounded-full",
      default:
        "bg-gray-200 hover:bg-gray-300 focus:bg-gray-300 active:bg-gray-400 text-gray-800 rounded-full"
    },
    icon: {
      primary:
        "text-primary hover:bg-primary-50 focus:bg-primary-50 active:bg-primary-100 rounded-full",
      secondary:
        "text-secondary hover:bg-secondary-50 focus:bg-secondary-50 active:bg-secondary-100 rounded-full",
      success:
        "text-success hover:bg-success-50 focus:bg-success-50 active:bg-success-100 rounded-full",
      error:
        "text-error hover:bg-error-50 focus:bg-error-50 active:bg-error-100 rounded-full",
      warning:
        "text-warning hover:bg-warning-50 focus:bg-warning-50 active:bg-warning-100 rounded-full",
      default:
        "text-gray-700 hover:bg-gray-100 focus:bg-gray-100 active:bg-gray-200 rounded-full"
    }
  };

  const colorStyle = colorStyles[variant][colorType];

  const baseStyles = [
    "inline-flex items-center justify-center",
    "font-medium transition-colors duration-200",
    "focus:outline-none focus:ring-2 focus:ring-offset-2",
    "whitespace-nowrap",
    variant !== "rounded" && variant !== "icon" ? "rounded-md" : "",
    `focus:ring-${colorType === "default" ? "gray-500" : colorType}-500`,
    disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
    fullWidth ? "w-full" : ""
  ]
    .filter(Boolean)
    .join(" ");

  const buttonContent = (
    <>
      {variant !== "icon" &&
        ((leftIcon && iconPosition === "left") ||
          (leftIcon && iconPosition === "both")) && (
          <span className="mr-2 flex-shrink-0 text-base">{leftIcon}</span>
        )}

      {variant === "icon" ? (
        <span className="flex-shrink-0 text-base">
          {leftIcon || rightIcon || children}
        </span>
      ) : (
        <span>{children}</span>
      )}

      {variant !== "icon" &&
        ((rightIcon && iconPosition === "right") ||
          (rightIcon && iconPosition === "both")) && (
          <span className="ml-2 flex-shrink-0 text-base">{rightIcon}</span>
        )}
    </>
  );

  const combinedClassName = `${baseStyles} ${buttonSizeStyles} ${colorStyle} ${className}`;

  if (isLinkProps(props) && !disabled) {
    const { href, ...linkRest } = rest as LinkButtonProps;
    return (
      <Link href={href} className={combinedClassName} {...linkRest}>
        {buttonContent}
      </Link>
    );
  }

  return (
    <button
      type="button"
      className={combinedClassName}
      disabled={disabled}
      {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {buttonContent}
    </button>
  );
};

export default Button;
