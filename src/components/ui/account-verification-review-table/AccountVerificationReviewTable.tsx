"use client";

import { DataTable } from "@/components/shared/organisms/data-table/DataTable";
import Modal from "@/components/shared/organisms/modal";
import PrivateImage from "@/components/shared/organisms/private-image";
import { Button } from "@/components/shared/shadcn-components/button";
import { Label } from "@/components/shared/shadcn-components/label";
import { Paragraph } from "@/components/shared/shadcn-components/typography";
import AccountVerificationRepository from "@/repositories/account-verification.repository";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { TPendingAccountVerificationItem } from "../../../../common/types";
import { createColumns, TPendingReviewTableColumn } from "./columns";

type TViewModal = {
  isOpen: boolean;
  verification: TPendingAccountVerificationItem | null;
};

export default function AccountVerificationReviewTable() {
  const queryClient = useQueryClient();

  const [viewModal, setViewModal] = useState<TViewModal>({
    isOpen: false,
    verification: null
  });

  const { data, isLoading } = useQuery({
    queryKey: ["pending-account-verification-reviews"],
    queryFn: async () => await AccountVerificationRepository.pendingReviews()
  });

  const { mutate: mutateAcceptVerification } = useMutation({
    mutationKey: ["accept-account-verification"],
    mutationFn: async (id: string) => {
      await AccountVerificationRepository.acceptRequest(id);
    },
    onMutate: () => {
      return { toastId: toast.loading("Accepting verification...") };
    },
    onSuccess: async (_, __, context) => {
      toast.success("Verification accepted", { id: context?.toastId });
      await queryClient.invalidateQueries({
        queryKey: ["pending-account-verification-reviews"]
      });
      setViewModal({ isOpen: false, verification: null });
    },
    onError: (error: any, __, context) => {
      toast.error(error?.message || "Failed to accept verification", {
        id: context?.toastId
      });
    }
  });

  const { mutate: mutateDeclineVerification } = useMutation({
    mutationKey: ["decline-account-verification"],
    mutationFn: async (id: string) => {
      await AccountVerificationRepository.declineRequest(id);
    },
    onMutate: () => {
      return { toastId: toast.loading("Declining verification...") };
    },
    onSuccess: async (_, __, context) => {
      toast.success("Verification declined", { id: context?.toastId });
      await queryClient.invalidateQueries({
        queryKey: ["pending-account-verification-reviews"]
      });
      setViewModal({ isOpen: false, verification: null });
    },
    onError: (error: any, __, context) => {
      toast.error(error?.message || "Failed to decline verification", {
        id: context?.toastId
      });
    }
  });

  const columns = useMemo(
    () =>
      createColumns({
        onView(accountVerificationId) {
          const verification = data?.find(
            (a) => a._id.toString() === accountVerificationId
          );
          if (verification) {
            setViewModal({
              isOpen: true,
              verification
            });
          }
        },
        onAccept(accountVerificationId) {
          mutateAcceptVerification(accountVerificationId);
        },
        onDecline(accountVerificationId) {
          mutateDeclineVerification(accountVerificationId);
        }
      }),
    [data, mutateAcceptVerification, mutateDeclineVerification]
  );

  const tableData: TPendingReviewTableColumn[] = useMemo(
    () =>
      data?.map((item: any) => ({
        accountVerificationId: item._id.toString(),
        name: `${item.user.profile?.firstName} ${item.user.profile?.lastName}`,
        email: item.user.email,
        requestedAt: dayjs(item.updatedAt).format("DD/MM/YYYY")
      })) ?? [],
    [data]
  );

  return (
    <>
      <DataTable
        isLoading={isLoading}
        data={tableData}
        columns={columns}
        className="w-full"
      />

      <Modal
        title="Verification details"
        isOpen={viewModal.isOpen}
        closeHandler={() => setViewModal({ isOpen: false, verification: null })}
        footer={
          <div className="flex items-center gap-2 justify-end">
            <Button
              variant="outline"
              className="px-4"
              onClick={() =>
                setViewModal({ isOpen: false, verification: null })
              }
            >
              Close
            </Button>
            <Button
              variant="destructive"
              className="px-4"
              onClick={() => {
                if (viewModal.verification) {
                  mutateDeclineVerification(
                    viewModal.verification._id.toString()
                  );
                }
              }}
            >
              Decline
            </Button>
            <Button
              className="px-4"
              onClick={() => {
                if (viewModal.verification) {
                  mutateAcceptVerification(
                    viewModal.verification._id.toString()
                  );
                }
              }}
            >
              Accept
            </Button>
          </div>
        }
      >
        <div className="flex flex-col gap-6">
          {/* NID Section */}
          {(viewModal.verification?.nidFrontImage ||
            viewModal.verification?.nidBackImage ||
            viewModal.verification?.nidNumber) && (
            <div className="flex flex-col gap-4">
              <div className="flex flex-col md:flex-row gap-4">
                {viewModal.verification?.nidFrontImage && (
                  <div className="flex flex-col gap-2 w-full md:w-1/2">
                    <Label>NID Front Image</Label>
                    <PrivateImage
                      filePath={viewModal.verification?.nidFrontImage}
                      alt="NID front image"
                      width={0}
                      height={100}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                {viewModal.verification?.nidBackImage && (
                  <div className="flex flex-col gap-2 w-full md:w-1/2">
                    <Label>NID Back Image</Label>
                    <PrivateImage
                      filePath={viewModal.verification?.nidBackImage}
                      alt="NID back image"
                      width={0}
                      height={100}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>

              {viewModal.verification?.nidNumber && (
                <div className="flex flex-col gap-2 w-full md:w-1/2">
                  <Label>NID No.</Label>
                  <Paragraph>{viewModal.verification?.nidNumber}</Paragraph>
                </div>
              )}
            </div>
          )}

          {/* Passport Section */}
          {(viewModal.verification?.passportImage ||
            viewModal.verification?.passportNumber) && (
            <div className="flex flex-col gap-4">
              {viewModal.verification?.passportImage && (
                <div className="flex flex-col gap-2 w-full md:w-1/2">
                  <Label>Passport Image</Label>
                  <PrivateImage
                    filePath={viewModal.verification?.passportImage}
                    alt="Passport image"
                    width={0}
                    height={100}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {viewModal.verification?.passportNumber && (
                <div className="flex flex-col gap-2 w-full md:w-1/2">
                  <Label>Passport No.</Label>
                  <Paragraph>
                    {viewModal.verification?.passportNumber}
                  </Paragraph>
                </div>
              )}
            </div>
          )}
        </div>
      </Modal>
    </>
  );
}
