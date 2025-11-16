"use client";

import { useAuthStore } from "@/app/_store/auth-store";
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
import AuthRepository from "@/repositories/auth.repository";
import { cn } from "@/utils/tailwind-utils";
import { Bell, ChevronDownIcon } from "lucide-react";
import { League_Spartan } from "next/font/google";
import Link from "next/link";
import React, { useMemo } from "react";
import toast from "react-hot-toast";
import { Button } from "../../shared/atoms/button";
import ThemeToggleButton from "../theme-toggle-button";

const leagueSpartan = League_Spartan({
  weight: ["400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  display: "swap"
});

const MainNavbar: React.FC = () => {
  const { isLoggedIn, user, clearAuth } = useAuthStore();

  const handleLogoutAction = async () => {
    const { data } = await AuthRepository.logout();
    clearAuth();
    toast.success(data.message);
  };

  const handleLoginAction = () => {
    window.location.href = `${API_BASE_URL}/auth/login`;
  };

  const userNameInitials = useMemo(() => {
    if (!user) return "";
    const { firstName, lastName } = user.profile;
    return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
  }, [user]);

  const userFullName = useMemo(() => {
    if (!user) return "";
    const { firstName, lastName } = user.profile;
    return `${firstName} ${lastName}`;
  }, [user]);

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
            <span className="xs:hidden">tr.</span>
            <span className="hidden xs:block">tripmate.</span>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          {isLoggedIn && user ? (
            <div className="flex items-center">
              <Button variant="ghost">
                <Bell />
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="flex items-center gap-2 cursor-pointer px-2 py-1 hover:bg-input/50 rounded-md">
                    <Avatar>
                      <AvatarImage
                        src={`https://ui-avatars.com/api/?name=${userNameInitials}`}
                        alt="User profile picture"
                      />
                      <AvatarFallback>{userNameInitials}</AvatarFallback>
                    </Avatar>
                    <div className="hidden sm:flex flex-col">
                      <div className="text-sm">{userFullName}</div>
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
