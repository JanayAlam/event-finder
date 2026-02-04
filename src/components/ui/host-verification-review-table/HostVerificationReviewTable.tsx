"use client";

import { DataTable } from "@/components/shared/organisms/data-table/DataTable";
import Modal from "@/components/shared/organisms/modal";
import PrivateImage from "@/components/shared/organisms/private-image";
import { Button } from "@/components/shared/shadcn-components/button";
import { Label } from "@/components/shared/shadcn-components/label";
import { Paragraph } from "@/components/shared/shadcn-components/typography";
import PromotionRequestRepository from "@/repositories/promotion-request.repository";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { TPendingHostVerificationItem } from "../../../../common/types/host-verification.types";
import { createColumns, TPendingHostRequestTableColumn } from "./columns";

type TViewModal = {
  isOpen: boolean;
  promotionPending: TPendingHostVerificationItem | null;
};

export default function HostVerificationReviewTable() {
  const queryClient = useQueryClient();

  const [viewModal, setViewModal] = useState<TViewModal>({
    isOpen: false,
    promotionPending: null
  });

  const { data, isLoading } = useQuery({
    queryKey: ["pending-host-request-reviews"],
    queryFn: async () =>
      await PromotionRequestRepository.getAllPendingRequests()
  });

  const { mutate: mutateAcceptRequest } = useMutation({
    mutationKey: ["accept-host-request"],
    mutationFn: async (id: string) => {
      await PromotionRequestRepository.acceptRequest(id);
    },
    onMutate: () => {
      return { toastId: toast.loading("Accepting request...") };
    },
    onSuccess: async (_, __, context) => {
      toast.success("Request accepted", { id: context?.toastId });
      await queryClient.invalidateQueries({
        queryKey: ["pending-host-request-reviews"]
      });
      setViewModal({ isOpen: false, promotionPending: null });
    },
    onError: (error: any, __, context) => {
      toast.error(error?.message || "Failed to accept request", {
        id: context?.toastId
      });
    }
  });

  const { mutate: mutateRejectRequest } = useMutation({
    mutationKey: ["reject-host-request"],
    mutationFn: async (id: string) => {
      await PromotionRequestRepository.rejectRequest(id);
    },
    onMutate: () => {
      return { toastId: toast.loading("Rejecting request...") };
    },
    onSuccess: async (_, __, context) => {
      toast.success("Request rejected", { id: context?.toastId });
      await queryClient.invalidateQueries({
        queryKey: ["pending-host-request-reviews"]
      });
      setViewModal({ isOpen: false, promotionPending: null });
    },
    onError: (error: any, __, context) => {
      toast.error(error?.message || "Failed to reject request", {
        id: context?.toastId
      });
    }
  });

  const columns = useMemo(
    () =>
      createColumns({
        onView(promotionPendingId) {
          const promotionPending = data?.find(
            (a) => a._id.toString() === promotionPendingId
          );
          if (promotionPending) {
            setViewModal({
              isOpen: true,
              promotionPending
            });
          }
        },
        onAccept(promotionPendingId) {
          mutateAcceptRequest(promotionPendingId);
        },
        onReject(promotionPendingId) {
          mutateRejectRequest(promotionPendingId);
        }
      }),
    [data, mutateAcceptRequest, mutateRejectRequest]
  );

  const tableData: TPendingHostRequestTableColumn[] = useMemo(
    () =>
      data?.map((item) => ({
        promotionPendingId: item._id.toString(),
        firstName: item.user.profile?.firstName,
        lastName: item.user.profile?.lastName,
        dateOfBirth: item.user.profile.dateOfBirth
          ? dayjs(item.user.profile.dateOfBirth).format("DD/MM/YYYY")
          : "-",
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
        closeHandler={() =>
          setViewModal({ isOpen: false, promotionPending: null })
        }
        footer={
          <div className="flex items-center gap-2 justify-end">
            <Button
              variant="outline"
              className="px-4"
              onClick={() =>
                setViewModal({ isOpen: false, promotionPending: null })
              }
            >
              Close
            </Button>
          </div>
        }
      >
        <div className="flex flex-col gap-6">
          {/* NID Section */}
          {(viewModal.promotionPending?.user.accountVerification
            ?.nidFrontImage ||
            viewModal.promotionPending?.user.accountVerification
              ?.nidBackImage ||
            viewModal.promotionPending?.user.accountVerification
              ?.nidNumber) && (
            <div className="flex flex-col gap-4">
              <div className="flex flex-col md:flex-row gap-4">
                {viewModal.promotionPending?.user.accountVerification
                  ?.nidFrontImage && (
                  <div className="flex flex-col gap-2 w-full md:w-1/2">
                    <Label>NID Front Image</Label>
                    <PrivateImage
                      filePath={
                        viewModal.promotionPending?.user.accountVerification
                          .nidFrontImage
                      }
                      alt="NID front image"
                      width={0}
                      height={100}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                {viewModal.promotionPending?.user.accountVerification
                  ?.nidBackImage && (
                  <div className="flex flex-col gap-2 w-full md:w-1/2">
                    <Label>NID Back Image</Label>
                    <PrivateImage
                      filePath={
                        viewModal.promotionPending?.user.accountVerification
                          .nidBackImage
                      }
                      alt="NID back image"
                      width={0}
                      height={100}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>

              {viewModal.promotionPending?.user.accountVerification
                ?.nidNumber && (
                <div className="flex flex-col gap-2 w-full md:w-1/2">
                  <Label>NID No.</Label>
                  <Paragraph>
                    {
                      viewModal.promotionPending?.user.accountVerification
                        .nidNumber
                    }
                  </Paragraph>
                </div>
              )}
            </div>
          )}

          {/* Passport Section */}
          {(viewModal.promotionPending?.user.accountVerification
            ?.passportImage ||
            viewModal.promotionPending?.user.accountVerification
              ?.passportNumber) && (
            <div className="flex flex-col gap-4">
              {viewModal.promotionPending?.user.accountVerification
                ?.passportImage && (
                <div className="flex flex-col gap-2 w-full md:w-1/2">
                  <Label>Passport Image</Label>
                  <PrivateImage
                    filePath={
                      viewModal.promotionPending?.user.accountVerification
                        .passportImage
                    }
                    alt="Passport image"
                    width={0}
                    height={100}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {viewModal.promotionPending?.user.accountVerification
                ?.passportNumber && (
                <div className="flex flex-col gap-2 w-full md:w-1/2">
                  <Label>Passport No.</Label>
                  <Paragraph>
                    {
                      viewModal.promotionPending?.user.accountVerification
                        .passportNumber
                    }
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
