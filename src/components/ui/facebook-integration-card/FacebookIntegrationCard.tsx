"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { toast } from "sonner";

import Card from "@/components/shared/molecules/card";
import Modal from "@/components/shared/organisms/modal";
import { Button } from "@/components/shared/shadcn-components/button";
import { Label } from "@/components/shared/shadcn-components/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/shared/shadcn-components/select";
import { Spinner } from "@/components/shared/shadcn-components/spinner";
import {
  H3,
  Paragraph,
  TypographyMuted
} from "@/components/shared/shadcn-components/typography";
import FacebookRepository from "@/repositories/facebook.repository";

const FacebookIntegrationCard: React.FC = () => {
  const queryClient = useQueryClient();

  const [selectedPageId, setSelectedPageId] = useState<string>("");
  const [isDisconnectModalOpen, setIsDisconnectModalOpen] = useState(false);

  const { data: facebookToken, isLoading: isTokenLoading } = useQuery({
    queryKey: ["facebook-token"],
    queryFn: async () => await FacebookRepository.getToken(),
    retry: false
  });

  const { data: pages = [], isLoading: isPagesLoading } = useQuery({
    queryKey: ["facebook-managed-pages"],
    queryFn: async () => await FacebookRepository.getManagedPages(),
    enabled: !!facebookToken?.userAccessToken,
    retry: false
  });

  const activePageId = selectedPageId || facebookToken?.pageId || "";

  const { mutate: handleConnect, isPending: isConnecting } = useMutation({
    mutationFn: async () => await FacebookRepository.getAuthUrl(),
    onSuccess: (data) => {
      window.location.href = data.url;
    },
    onError: () => {
      toast.error("Failed to initiate Facebook connection");
    }
  });

  const { mutate: handleDisconnect, isPending: isDisconnecting } = useMutation({
    mutationFn: async () => await FacebookRepository.disconnect(),
    onSuccess: () => {
      toast.success("Facebook account disconnected");
      queryClient.setQueryData(["facebook-token"], null);
      queryClient.setQueryData(["facebook-managed-pages"], []);
      setSelectedPageId("");
      setIsDisconnectModalOpen(false);
    },
    onError: () => {
      toast.error("Failed to disconnect");
    }
  });

  const { mutate: handleSavePage, isPending: isSavingPage } = useMutation({
    mutationFn: async (pageId: string) => {
      const page = pages.find((p) => p.id === pageId);
      if (!page) throw new Error("Page not found");
      return await FacebookRepository.updateToken({
        accessToken: page.access_token,
        pageId: page.id
      });
    },
    onSuccess: (data) => {
      toast.success("Active page updated");
      queryClient.setQueryData(["facebook-token"], data.token);
    },
    onError: () => {
      toast.error("Failed to update active page");
    }
  });

  if (isTokenLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Spinner className="size-10" />
      </div>
    );
  }

  if (!facebookToken) {
    return (
      <Card rootClassName="w-full max-w-4xl py-6">
        <div className="flex flex-col items-center justify-center py-4 gap-4">
          <div className="bg-muted rounded-full p-6">
            <svg
              role="img"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              className="w-16 h-16 fill-muted-foreground/40"
            >
              <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z" />
            </svg>
          </div>
          <div className="max-w-md flex flex-col gap-4 text-center">
            <H3 className="font-bold">Not Connected</H3>
            <TypographyMuted>
              Connecting your Facebook account allows TripMate to post your
              event details directly to your Page&apos;s feed.
            </TypographyMuted>
          </div>
          <Button
            onClick={() => handleConnect()}
            size="lg"
            isLoading={isConnecting}
            className="bg-[#1877F2] hover:bg-[#166fe5] text-white gap-2 px-8 h-12 shadow-lg shadow-blue-500/20"
          >
            Link Facebook Account
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="grid gap-6">
      <Card
        title={
          <div className="flex max-sm:flex-col sm:items-center justify-between gap-4 w-full">
            <div className="flex items-center gap-2 text-lg font-bold">
              <svg
                role="img"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                className="w-7 h-7 fill-blue-600"
              >
                <title>Facebook</title>
                <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z" />
              </svg>
              <span>Facebook Account</span>
            </div>
            <div className="max-sm:w-full flex justify-end">
              <Button
                className="bg-destructive dark:bg-destructive/80 hover:bg-destructive/90 dark:hover:bg-destructive text-white h-9"
                onClick={() => setIsDisconnectModalOpen(true)}
              >
                Disconnect
              </Button>
            </div>
          </div>
        }
        rootClassName="w-full max-w-2xl"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
          <div className="flex flex-col gap-2">
            <Label>Facebook Page</Label>
            <Select
              value={activePageId}
              onValueChange={setSelectedPageId}
              disabled={isPagesLoading || pages.length === 0}
            >
              <SelectTrigger className="w-full h-10">
                <SelectValue
                  placeholder={
                    isPagesLoading ? "Loading pages..." : "Select a Page"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {pages.map((page) => (
                  <SelectItem key={page.id} value={page.id}>
                    {page.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="w-full sm:max-w-lg">
            <Button
              onClick={() => handleSavePage(activePageId)}
              disabled={
                isSavingPage ||
                !activePageId ||
                activePageId === facebookToken.pageId
              }
              isLoading={isSavingPage}
              className="w-full sm:w-auto h-10"
            >
              Set as Active Page
            </Button>
          </div>
        </div>
      </Card>

      <Modal
        isOpen={isDisconnectModalOpen}
        closeHandler={() => setIsDisconnectModalOpen(false)}
        title="Disconnect Facebook"
        footer={
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setIsDisconnectModalOpen(false)}
              disabled={isDisconnecting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => handleDisconnect()}
              isLoading={isDisconnecting}
            >
              Disconnect
            </Button>
          </div>
        }
      >
        <Paragraph>
          Are you sure you want to disconnect your Facebook account? This will
          stop automatic event posting.
        </Paragraph>
      </Modal>
    </div>
  );
};

export default FacebookIntegrationCard;
