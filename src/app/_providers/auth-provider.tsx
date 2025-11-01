"use client";

import { useInitAuth } from "@/hooks/auth";
import React, { PropsWithChildren } from "react";

export const AuthProvider: React.FC<PropsWithChildren> = ({ children }) => {
  useInitAuth();
  return children;
};
