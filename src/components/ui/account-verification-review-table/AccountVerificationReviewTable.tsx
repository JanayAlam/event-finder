"use client";

import { DataTable } from "@/components/shared/organisms/data-table";
import Modal from "@/components/shared/organisms/modal";
import PrivateImage from "@/components/shared/organisms/private-image";
import { Button } from "@/components/shared/shadcn-components/button";
import { Label } from "@/components/shared/shadcn-components/label";
import { Paragraph } from "@/components/shared/shadcn-components/typography";
import AccountVerificationRepository from "@/repositories/account-verification.repository";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import dayjs from "dayjs";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { TPendingAccountVerificationItem } from "../../../../common/types";
import { createColumns } from "./columns";

type TViewModal = {
  isOpen: boolean;
  accountVerification: TPendingAccountVerificationItem | null;
};

export default function AccountVerificationReviewTable() {
  const queryClient = useQueryClient();

  const [viewModal, setViewModal] = useState<TViewModal>({
    isOpen: false,
    accountVerification: null
  });

  const [rowSelection, setRowSelection] = useState({});

  const { data, isLoading } = useQuery({
    queryKey: ["account-verification-pending-reviews"],
    queryFn: async () => await AccountVerificationRepository.pendingReviews()
  });

  const { mutate: mutateAcceptRequest, isPending: isAcceptingRequest } =
    useMutation({
      mutationKey: ["accept-account-verification-request"],
      mutationFn: async (id: string) => {
        await AccountVerificationRepository.acceptRequest(id);
      },
      onSuccess: async () => {
        toast.success("Request accepted");
        await queryClient.invalidateQueries({
          queryKey: ["account-verification-pending-reviews"]
        });
        setViewModal({ isOpen: false, accountVerification: null });
      }
    });

  const { mutate: mutateDeclineRequest, isPending: isDecliningRequest } =
    useMutation({
      mutationKey: ["decline-account-verification-request"],
      mutationFn: async (id: string) => {
        await AccountVerificationRepository.declineRequest(id);
      },
      onSuccess: async () => {
        toast.success("Request declined");
        await queryClient.invalidateQueries({
          queryKey: ["account-verification-pending-reviews"]
        });
        setViewModal({ isOpen: false, accountVerification: null });
      }
    });

  const columns = createColumns({
    onView(accountVerificationId) {
      const accountVerification = data?.find(
        (a) => a._id.toString() === accountVerificationId
      );
      if (accountVerification) {
        setViewModal({
          isOpen: true,
          accountVerification
        });
      }
    },
    onAccept(accountVerificationId: string) {
      mutateAcceptRequest(accountVerificationId);
    },
    onDecline(accountVerificationId: string) {
      mutateDeclineRequest(accountVerificationId);
    }
  });

  const tableData = useMemo(
    () =>
      data?.map((item) => ({
        accountVerificationId: item._id.toString(),
        name: `${item.user.profile?.firstName ?? ""} ${item.user.profile?.lastName ?? ""}`,
        email: item.user.email,
        requestedAt: dayjs(item.updatedAt).format("DD/MM/YYYY")
      })) ?? [],
    [data]
  );

  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      rowSelection
    }
  });

  return (
    <>
      <DataTable
        key={data?.length ?? 0}
        isLoading={isLoading}
        containerClassName="w-full"
        table={table}
      />

      <Modal
        title="Account verification"
        isOpen={viewModal.isOpen}
        closeHandler={() =>
          setViewModal({ isOpen: false, accountVerification: null })
        }
        footer={
          <div className="flex items-center gap-2 justify-end">
            <Button
              variant="outline"
              className="px-4"
              onClick={() =>
                setViewModal({ isOpen: false, accountVerification: null })
              }
            >
              Close
            </Button>
            <Button
              className="px-4 bg-destructive hover:bg-destructive/80 text-white"
              isLoading={isDecliningRequest}
              onClick={() =>
                viewModal.accountVerification &&
                mutateDeclineRequest(
                  viewModal.accountVerification._id.toString()
                )
              }
            >
              Decline
            </Button>
            <Button
              className="px-4 bg-success hover:bg-success/80 text-white"
              isLoading={isAcceptingRequest}
              onClick={() =>
                viewModal.accountVerification &&
                mutateAcceptRequest(
                  viewModal.accountVerification._id.toString()
                )
              }
            >
              Accept
            </Button>
          </div>
        }
      >
        <div className="flex flex-col gap-6">
          {/* NID Section */}
          {(viewModal.accountVerification?.nidFrontImage ||
            viewModal.accountVerification?.nidBackImage ||
            viewModal.accountVerification?.nidNumber) && (
            <div className="flex flex-col gap-4">
              <div className="flex flex-col md:flex-row gap-4">
                {viewModal.accountVerification?.nidFrontImage && (
                  <div className="flex flex-col gap-2 w-full md:w-1/2">
                    <Label>NID Front Image</Label>
                    <PrivateImage
                      filePath={viewModal.accountVerification.nidFrontImage}
                      alt="NID front image"
                      width={0}
                      height={100}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                {viewModal.accountVerification?.nidBackImage && (
                  <div className="flex flex-col gap-2 w-full md:w-1/2">
                    <Label>NID Back Image</Label>
                    <PrivateImage
                      filePath={viewModal.accountVerification.nidBackImage}
                      alt="NID back image"
                      width={0}
                      height={100}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>

              {viewModal.accountVerification?.nidNumber && (
                <div className="flex flex-col gap-2 w-full md:w-1/2">
                  <Label>NID No.</Label>
                  <Paragraph>
                    {viewModal.accountVerification.nidNumber}
                  </Paragraph>
                </div>
              )}
            </div>
          )}

          {/* Passport Section */}
          {(viewModal.accountVerification?.passportImage ||
            viewModal.accountVerification?.passportNumber) && (
            <div className="flex flex-col gap-4">
              {viewModal.accountVerification?.passportImage && (
                <div className="flex flex-col gap-2 w-full md:w-1/2">
                  <Label>Passport Image</Label>
                  <PrivateImage
                    filePath={viewModal.accountVerification.passportImage}
                    alt="Passport image"
                    width={0}
                    height={100}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {viewModal.accountVerification?.passportNumber && (
                <div className="flex flex-col gap-2 w-full md:w-1/2">
                  <Label>Passport No.</Label>
                  <Paragraph>
                    {viewModal.accountVerification.passportNumber}
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
