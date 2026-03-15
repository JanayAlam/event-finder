"use client";

import LogoDark from "@/assets/logos/event-finder-full-dark.png";
import LogoLight from "@/assets/logos/event-finder-full-light.png";
import LogoShort from "@/assets/logos/event-finder-short.png";
import Modal from "@/components/shared/organisms/modal";
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
import { API_BASE_URL } from "@/config";
import { PAGE_WIDTH_CLASS_NAME } from "@/constants";
import { cn, getImageUrl } from "@/lib/utils";
import AccountVerificationRepository from "@/repositories/account-verification.repository";
import AuthRepository from "@/repositories/auth.repository";
import PromotionRequestRepository from "@/repositories/promotion-request.repository";
import {
  PRIVATE_ADMIN_ONLY_PAGE_ROUTE,
  PRIVATE_PAGE_ROUTE,
  PRIVATE_TRAVELER_ONLY_PAGE_ROUTE,
  PUBLIC_DYNAMIC_PAGE_ROUTE
} from "@/routes";
import { useAuthStore } from "@/stores/auth-store";
import { useMutation, useQuery } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { ChevronDownIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { League_Spartan } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "nextjs-toploader/app";
import React, { useState } from "react";
import { toast } from "sonner";
import { VERIFICATION_STATUS } from "../../../../common/types";
import { USER_ROLE } from "../../../../server/enums";
import { Button } from "../../shared/shadcn-components/button";
import ThemeToggleButton from "../theme-toggle-button";
import { NotificationPopover } from "./notification-popover";
import SearchButton from "./search-button";

const leagueSpartan = League_Spartan({
  weight: ["400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  display: "swap"
});

const Navbar: React.FC = () => {
  const router = useRouter();

  const { theme } = useTheme();
  const { isLoggedIn, user, clearAuth } = useAuthStore();

  const [becomeHostModalOpen, setBecomeHostModalOpen] = useState(false);

  const { data: accountVerificationStatus, isLoading } = useQuery({
    queryKey: ["account-verification-status"],
    queryFn: () => AccountVerificationRepository.status(),
    retry: false,
    enabled: isLoggedIn
  });

  const handleLogoutAction = async () => {
    const toastId = toast.loading("Logging out...");
    try {
      const data = await AuthRepository.logout();
      clearAuth();
      toast.success(data.message, { id: toastId });
    } catch (error: any) {
      toast.error(error?.message || "Logout failed", { id: toastId });
    }
  };

  const handleLoginAction = () => {
    window.location.href = `${API_BASE_URL}/auth/login`;
  };

  const handleBecomeHostAction = () => {
    setBecomeHostModalOpen(true);
  };

  const { mutate, isPending } = useMutation({
    mutationKey: ["host-request"],
    mutationFn: async () => {
      if (!user?._id) {
        return;
      }
      await PromotionRequestRepository.create(user._id.toString());
    },
    onSuccess: async () => {
      toast.success("Request submitted");
      setBecomeHostModalOpen(false);
    },
    onError: (err) => {
      if (isAxiosError(err)) {
        toast.error(err.response?.data.message);
        return;
      }
      toast.error(err.message);
    }
  });

  const handleBecomeHostSubmitAction = async () => {
    if (accountVerificationStatus?.status !== VERIFICATION_STATUS.VERIFIED) {
      router.push(PRIVATE_TRAVELER_ONLY_PAGE_ROUTE.SETTINGS_VERIFICATION);
      setBecomeHostModalOpen(false);
    } else {
      await mutate();
    }
  };

  return (
    <>
      <div
        className={cn(
          "sticky top-0 z-50!",
          "w-full flex justify-center",
          "border-b border-b-borders-1",
          "bg-background",
          "z-10"
        )}
      >
        <div
          className={cn(
            PAGE_WIDTH_CLASS_NAME,
            "h-16 flex items-center justify-between"
          )}
        >
          <div
            className={cn(leagueSpartan.className, "flex items-center gap-1")}
          >
            <Link
              href={"/"}
              className="text-4xl font-extrabold text-primary select-none"
            >
              <div className="sm:hidden">
                <Image
                  src={LogoShort.src}
                  alt="Logo"
                  width={40}
                  height={40}
                  className="sm:hidden"
                />
              </div>
              <div className="hidden sm:block">
                <Image
                  src={theme === "light" ? LogoLight.src : LogoDark.src}
                  alt="Logo"
                  width={120}
                  height={60}
                />
              </div>
            </Link>
          </div>

          {isLoggedIn && user ? (
            <div className="flex items-center gap-2">
              <SearchButton />
              <NotificationPopover />
              <ThemeToggleButton />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="flex items-center gap-2 cursor-pointer px-2 py-1 hover:bg-input/50 rounded-md">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={getImageUrl(user.profile?.profileImage, {
                          name: user.email
                        })}
                        alt="User profile picture"
                      />
                      <AvatarFallback className="text-sm">
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
                    {user.profile ? (
                      <Link
                        href={PUBLIC_DYNAMIC_PAGE_ROUTE.PROFILE(
                          user.profile._id.toString()
                        )}
                      >
                        <DropdownMenuItem className="flex flex-col justify-start items-start gap-0">
                          View Profile
                          <TypographyMuted className="text-xs line-clamp-1">
                            {user.email}
                          </TypographyMuted>
                        </DropdownMenuItem>
                      </Link>
                    ) : null}

                    <Link href={PRIVATE_PAGE_ROUTE.SETTINGS_PERSONAL_INFO}>
                      <DropdownMenuItem>Account Preferences</DropdownMenuItem>
                    </Link>
                    {user.role === USER_ROLE.TRAVELER ? (
                      <DropdownMenuItem onClick={handleBecomeHostAction}>
                        Become Host
                      </DropdownMenuItem>
                    ) : null}
                    {user.role === USER_ROLE.ADMIN ? (
                      <Link
                        href={PRIVATE_ADMIN_ONLY_PAGE_ROUTE.ADMIN_DASHBOARD}
                      >
                        <DropdownMenuItem>Admin Portal</DropdownMenuItem>
                      </Link>
                    ) : null}
                    <Link
                      href={PUBLIC_DYNAMIC_PAGE_ROUTE.EXPLORE_JOINED_EVENTS(
                        user._id.toString()
                      )}
                    >
                      <DropdownMenuItem>Joined Events</DropdownMenuItem>
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

      <Modal
        title="Host request"
        buttonDisabled={isLoading}
        isOpen={becomeHostModalOpen}
        closeHandler={() => setBecomeHostModalOpen(false)}
        okText={
          accountVerificationStatus?.status !== VERIFICATION_STATUS.VERIFIED
            ? "Verify"
            : "Submit"
        }
        okHandler={handleBecomeHostSubmitAction}
        loading={isPending}
      >
        {isLoading ? (
          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-50" />
          </div>
        ) : accountVerificationStatus?.status !==
          VERIFICATION_STATUS.VERIFIED ? (
          <Paragraph>
            Your account is not yet verified. Please verify your account first.
          </Paragraph>
        ) : (
          <Paragraph>
            Are you sure you want to submit a request to become host?
          </Paragraph>
        )}
      </Modal>
    </>
  );
};

export default Navbar;
