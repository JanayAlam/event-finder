"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from "@/components/shared/shadcn-components/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/shared/shadcn-components/menu";
import { Skeleton } from "@/components/shared/shadcn-components/skeleton";
import { Paragraph } from "@/components/shared/shadcn-components/typography";
import AuthRepository from "@/repositories/auth.repository";
import UserRepository from "@/repositories/user.repository";
import { PRIVATE_PAGE_ROUTE } from "@/routes";
import { useAuthStore } from "@/stores/auth-store";
import { useQuery } from "@tanstack/react-query";
import { ChevronDownIcon } from "lucide-react";
import Link from "next/link";
import React from "react";
import { toast } from "sonner";

const SidebarFooterDropdown: React.FC = () => {
  const { isLoggedIn, user, clearAuth } = useAuthStore();

  const { data: profile, isLoading } = useQuery({
    queryKey: ["self-profile"],
    queryFn: () => UserRepository.getUserProfile(user?._id.toString() ?? "")
  });

  const handleLogoutAction = async () => {
    const data = await AuthRepository.logout();
    clearAuth();
    toast.success(data.message);
  };

  if (!isLoggedIn || !user) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex items-center justify-between gap-1 cursor-pointer px-2 py-1 hover:bg-input/50 rounded-md">
          <div className="flex gap-2 items-center py-2">
            <Avatar>
              <AvatarImage
                src={`https://ui-avatars.com/api/?name=${user.email.substring(0, 2).toUpperCase()}`}
                alt="User profile picture"
              />
              <AvatarFallback>
                {user.email.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 flex flex-col gap-0">
              {isLoading ? (
                <Skeleton className="h-4 w-24" />
              ) : (
                <Paragraph>
                  {profile?.firstName + " " + profile?.lastName}
                </Paragraph>
              )}
            </div>
          </div>
          <ChevronDownIcon
            height={18}
            width={18}
            className="text-muted-foreground rotate-180"
          />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-50 flex flex-col gap-1" align="start">
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
  );
};

export default SidebarFooterDropdown;
