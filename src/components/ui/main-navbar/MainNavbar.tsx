"use client";

import { useAuthStore } from "@/app/_store/auth-store";
import { axiosInstance } from "@/axios";
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from "@/components/shared/atoms/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/shared/atoms/menu";
import { API_BASE_URL } from "@/config";
import { PAGE_WIDTH_CLASS_NAME } from "@/constants";
import { cn } from "@/utils/tailwind-utils";
import { Bell, ChevronDownIcon } from "lucide-react";
import { League_Spartan } from "next/font/google";
import Link from "next/link";
import React from "react";
import { Button } from "../../shared/atoms/button";
import ThemeToggleButton from "../theme-toggle-button";

const leagueSpartan = League_Spartan({
  weight: ["400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  display: "swap"
});

const MainNavbar: React.FC = () => {
  const { isAuthenticated, user, clearAuth } = useAuthStore();

  const handleLogoutAction = async () => {
    const response = await fetch("/api/auth/logout", {
      method: "POST"
    });
    if (response.ok) {
      clearAuth();
    }
  };

  const handleLoginAction = async () => {
    await axiosInstance(`${API_BASE_URL}/auth/login`);
  };

  return (
    <div className="border-b border-b-borders-1 w-full flex justify-center sticky top-0">
      <div
        className={cn(
          PAGE_WIDTH_CLASS_NAME,
          "h-16 flex items-center justify-between"
        )}
      >
        <div className={cn(leagueSpartan.className, "flex items-center gap-1")}>
          <Link
            href={"/"}
            className="text-4xl font-extrabold text-brand-primary-main select-none"
          >
            tripmate.
          </Link>
        </div>
        <div className="flex items-center gap-4">
          {isAuthenticated && user ? (
            <div className="flex items-center">
              <Button variant="ghost">
                <Bell />
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="flex items-center gap-2 cursor-pointer px-2 py-1 hover:bg-input/50 rounded-md">
                    <Avatar>
                      <AvatarImage
                        src={`https://ui-avatars.com/api/?name=${user.email.substring(0, 2)}`}
                        alt="User profile picture"
                      />
                      <AvatarFallback>
                        {user.email.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <div className="text-sm">{user.email.split("@")[0]}</div>
                      <div className="text-muted-foreground text-xs capitalize">
                        {user.role}
                      </div>
                    </div>
                    <ChevronDownIcon
                      height={18}
                      width={18}
                      className="text-muted-foreground"
                    />
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-50 flex flex-col gap-1"
                  align="start"
                >
                  <DropdownMenuGroup>
                    <DropdownMenuItem>Profile</DropdownMenuItem>
                    <DropdownMenuItem>Account settings</DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem onClick={handleLogoutAction}>
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <Button variant="outline" onClick={handleLoginAction}>
              Login/Signup
            </Button>
          )}
          <ThemeToggleButton />
        </div>
      </div>
    </div>
  );
};

export default MainNavbar;
