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
import {
  Paragraph,
  TypographyMuted
} from "@/components/shared/shadcn-components/typography";
import { getImageUrl } from "@/lib/utils";
import AuthRepository from "@/repositories/auth.repository";
import UserRepository from "@/repositories/user.repository";
import {
  PRIVATE_PAGE_ROUTE,
  PUBLIC_DYNAMIC_PAGE_ROUTE,
  PUBLIC_PAGE_ROUTE
} from "@/routes";
import { useAuthStore } from "@/stores/auth-store";
import { useQuery } from "@tanstack/react-query";
import { ChevronDownIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "nextjs-toploader/app";
import React from "react";
import { toast } from "sonner";

const UserDropdown: React.FC = () => {
  const router = useRouter();

  const { user, clearAuth } = useAuthStore();

  const { data: profile, isLoading } = useQuery({
    queryKey: ["self-profile", user?._id],
    queryFn: () => UserRepository.getUserProfile(user!._id.toString()),
    enabled: !!user?._id
  });

  const handleLogoutAction = async () => {
    const toastId = toast.loading("Logging out...");
    try {
      const data = await AuthRepository.logout();
      clearAuth();
      toast.success(data.message, { id: toastId });
      router.push(PUBLIC_PAGE_ROUTE.HOME);
    } catch (error: any) {
      toast.error(error?.message || "Logout failed", { id: toastId });
    }
  };

  const fullName = (
    (profile?.firstName || "") +
    " " +
    (profile?.lastName || "")
  ).trim();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex items-center justify-between gap-1 cursor-pointer px-2 py-1.5 hover:bg-input/50 rounded-md">
          <div className="flex gap-2 items-center">
            <Avatar className="h-8 w-8">
              {profile?.profileImage ? (
                <AvatarImage
                  src={getImageUrl(profile.profileImage, {
                    name: fullName
                  })}
                  alt="User profile picture"
                />
              ) : null}
              <AvatarFallback className="text-sm">
                <Skeleton className="h-8 w-8" />
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 flex flex-col gap-0">
              {isLoading ? (
                <Skeleton className="h-4 w-24" />
              ) : (
                <Paragraph>{fullName}</Paragraph>
              )}
            </div>
          </div>
          <ChevronDownIcon
            height={18}
            width={18}
            className="text-muted-foreground"
          />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-50 flex flex-col gap-1" align="start">
        <DropdownMenuGroup>
          {user && profile ? (
            <Link
              href={PUBLIC_DYNAMIC_PAGE_ROUTE.PROFILE(profile._id.toString())}
            >
              <DropdownMenuItem className="flex flex-col justify-start items-start gap-0">
                View Profile
                <TypographyMuted className="text-xs line-clamp-1">
                  {user.email}
                </TypographyMuted>
              </DropdownMenuItem>
            </Link>
          ) : null}
          <Link href={PUBLIC_PAGE_ROUTE.HOME}>
            <DropdownMenuItem>Home</DropdownMenuItem>
          </Link>
          <Link href={PRIVATE_PAGE_ROUTE.SETTINGS_PERSONAL_INFO}>
            <DropdownMenuItem>Account Preferences</DropdownMenuItem>
          </Link>
          <Link href={PRIVATE_PAGE_ROUTE.PAYMENTS}>
            <DropdownMenuItem>Payments</DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={handleLogoutAction}>
            Logout
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserDropdown;
