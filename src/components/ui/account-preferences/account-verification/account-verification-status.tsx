"use client";

import Card from "@/components/shared/molecules/card";
import { Spinner } from "@/components/shared/shadcn-components/spinner";
import { Paragraph } from "@/components/shared/shadcn-components/typography";
import DeclinedVerificationCard from "@/components/ui/account-preferences/account-verification/declined-verification-card";
import PendingVerificationCard from "@/components/ui/account-preferences/account-verification/pending-verification-card";
import VerifiedCard from "@/components/ui/account-preferences/account-verification/verified-card";
import AccountVerificationRepository from "@/repositories/account-verification.repository";
import { cn } from "@/utils/tailwind-utils";
import { useQuery } from "@tanstack/react-query";
import { BadgeInfo } from "lucide-react";
import React from "react";
import { VERIFICATION_STATUS } from "../../../../../common/types";
import AccountVerificationForm from "./account-verification-form";

const AccountVerificationStatus: React.FC = () => {
  const { data: accountVerificationStatus, isLoading } = useQuery({
    queryKey: ["account-verification-status"],
    queryFn: () => AccountVerificationRepository.status(),
    retry: false
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center my-8!">
        <Spinner className="size-10" />
      </div>
    );
  }

  if (accountVerificationStatus?.status === VERIFICATION_STATUS.PENDING) {
    return <PendingVerificationCard />;
  }

  if (accountVerificationStatus?.status === VERIFICATION_STATUS.DECLINED) {
    return <DeclinedVerificationCard />;
  }

  if (accountVerificationStatus?.status === VERIFICATION_STATUS.VERIFIED) {
    return <VerifiedCard />;
  }

  return (
    <div className="flex flex-col gap-4">
      <Card
        rootClassName={cn(
          "border border-info",
          "bg-info-foreground",
          "dark:bg-info-light-foreground",
          "sm:px-4 sm:py-4"
        )}
      >
        <div className="grid grid-cols-[auto_1fr] items-center gap-4">
          <BadgeInfo className="text-info size-6 sm:size-7" />
          <Paragraph className="text-info">
            You can verify your account by providing your NID, your passport, or
            both
          </Paragraph>
        </div>
      </Card>

      <AccountVerificationForm />
    </div>
  );
};

export default AccountVerificationStatus;
