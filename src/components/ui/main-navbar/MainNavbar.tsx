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
import { PRIVATE_PAGE_ROUTE } from "@/routes";
import { cn } from "@/utils/tailwind-utils";
import { Bell, ChevronDownIcon } from "lucide-react";
import { League_Spartan } from "next/font/google";
import Link from "next/link";
import React from "react";
import toast from "react-hot-toast";
import { Button } from "../../shared/atoms/button";
import ThemeToggleButton from "../theme-toggle-button";
import SearchButton from "./SearchButton";

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

  return (
    <div
      className={cn(
        "sticky top-0",
        "w-full flex justify-center",
        "border-b border-b-borders-1"
      )}
    >
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
            <span className="sm:hidden">tr.</span>
            <span className="hidden sm:block">tripmate.</span>
          </Link>
        </div>

        {isLoggedIn && user ? (
          <div className="flex items-center gap-2">
            <SearchButton />
            <Button variant="ghost">
              <Bell />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex items-center gap-2 cursor-pointer px-2 py-1 hover:bg-input/50 rounded-md">
                  <Avatar>
                    <AvatarImage
                      src={`https://ui-avatars.com/api/?name=${user.email.substring(0, 2).toUpperCase()}`}
                      alt="User profile picture"
                    />
                    <AvatarFallback>
                      {user.email.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
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
                  <Link href={PRIVATE_PAGE_ROUTE.SETTINGS_PERSONAL_INFO}>
                    <DropdownMenuItem>Account preferences</DropdownMenuItem>
                  </Link>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={handleLogoutAction}>
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <ThemeToggleButton />
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <SearchButton />
            <Button variant="outline" onClick={handleLoginAction}>
              Login/Signup
            </Button>
            <ThemeToggleButton />
          </div>
        )}
      </div>
    </div>
  );
};

export default MainNavbar;
