"use client";

import {
  BadgeAlert,
  BadgeCheck,
  BadgeInfo,
  BadgeX,
  Loader
} from "lucide-react";
import { Toaster as Sonner, type ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      className="toaster group"
      position={props.position ?? "bottom-center"}
      icons={{
        success: <BadgeCheck className="size-5 text-success" />,
        info: <BadgeInfo className="size-5 text-info" />,
        warning: <BadgeAlert className="size-5 text-warning" />,
        error: <BadgeX className="size-5 text-destructive" />,
        loading: <Loader className="size-5 animate-spin text-primary" />
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)"
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
