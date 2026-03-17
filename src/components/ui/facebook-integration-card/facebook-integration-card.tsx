"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { toast } from "sonner";

import Modal from "@/components/shared/organisms/modal";
import { Badge } from "@/components/shared/shadcn-components/badge";
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
  H4,
  Paragraph,
  TypographyMuted
} from "@/components/shared/shadcn-components/typography";
import FacebookRepository from "@/repositories/facebook.repository";
import { Facebook, Link2, Settings2, Unlink } from "lucide-react";

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
      <div className="flex items-center justify-center p-12 w-full">
        <Spinner className="size-8" />
      </div>
    );
  }

  if (!facebookToken) {
    return (
      <div className="flex flex-col items-center justify-center py-10 px-4 w-full bg-muted/5 gap-4">
        <div className="relative mb-6">
          <div className="absolute -inset-1 bg-linear-to-r from-blue-600 to-cyan-500 rounded-full blur opacity-25" />
          <div className="relative bg-background rounded-full p-5 border border-blue-100 dark:border-blue-900">
            <Facebook className="size-12 text-[#1877F2]" />
          </div>
        </div>

        <div className="max-w-sm flex flex-col text-center mb-8 items-center gap-4">
          <Badge variant="secondary" className="mx-auto mb-2 font-semibold">
            Status: Disconnected
          </Badge>
          <Paragraph className="text-lg font-semibold">
            Connect Facebook Account
          </Paragraph>
          <TypographyMuted>
            Allow Event Finder to automatically post your travel events to your
            Facebook Page feed.
          </TypographyMuted>
        </div>

        <Button
          onClick={() => handleConnect()}
          size="lg"
          isLoading={isConnecting}
          className="gap-2"
        >
          {!isConnecting ? <Link2 className="size-5" /> : null}
          Link Account
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-4 py-2">
      {/* Account Info Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-6 rounded-xl border bg-muted/30">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
            <Facebook className="size-8 text-[#1877F2]" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg text-foreground">
                Facebook Integrated
              </span>
              <Badge
                variant="default"
                className="bg-success text-white border-transparent"
              >
                Active
              </Badge>
            </div>
            <TypographyMuted className="text-sm">
              Successfully linked to your Facebook account
            </TypographyMuted>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          className="h-10 text-destructive border-destructive/20 hover:bg-destructive/5 hover:text-destructive gap-2 px-6"
          onClick={() => setIsDisconnectModalOpen(true)}
        >
          <Unlink className="size-4" />
          Disconnect
        </Button>
      </div>

      {/* Page Configuration */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <Settings2 className="size-5" />
            <H4>Active facebook page</H4>
          </div>

          <TypographyMuted className="text-sm italic">
            Tip: Event Finder will only post to the facebook page you select
            below.
          </TypographyMuted>
        </div>

        <div className="flex flex-col md:flex-row items-end gap-6">
          <div className="w-full md:w-2/3 lg:w-1/2 flex flex-col gap-2">
            <Label className="text-sm font-semibold opacity-80">
              Target page
            </Label>
            <Select
              value={activePageId}
              onValueChange={setSelectedPageId}
              disabled={isPagesLoading || pages.length === 0}
            >
              <SelectTrigger className="w-full h-9 bg-background border-muted-foreground/20">
                <SelectValue
                  placeholder={
                    isPagesLoading ? "Fetching pages..." : "Choose a Page"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {pages.length > 0 ? (
                  pages.map((page) => (
                    <SelectItem key={page.id} value={page.id}>
                      {page.name}
                    </SelectItem>
                  ))
                ) : (
                  <div className="p-4 text-center text-sm text-muted-foreground">
                    No pages found
                  </div>
                )}
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={() => handleSavePage(activePageId)}
            disabled={
              isSavingPage ||
              !activePageId ||
              activePageId === facebookToken.pageId
            }
            isLoading={isSavingPage}
            className="shadow-sm px-6 bg-success hover:bg-success/90 dark:text-white"
          >
            Save
          </Button>
        </div>
      </div>

      {/* Disconnect Confirmation Modal */}
      <Modal
        isOpen={isDisconnectModalOpen}
        closeHandler={() => setIsDisconnectModalOpen(false)}
        title="Unlink Facebook Account"
        footer={
          <div className="flex justify-end gap-3 p-2">
            <Button
              variant="ghost"
              onClick={() => setIsDisconnectModalOpen(false)}
              disabled={isDisconnecting}
            >
              Keep connected
            </Button>
            <Button
              variant="destructive"
              onClick={() => handleDisconnect()}
              isLoading={isDisconnecting}
              className="px-6"
            >
              Disconnect
            </Button>
          </div>
        }
      >
        <div className="py-2">
          <Paragraph className="text-muted-foreground leading-relaxed">
            Are you sure you want to disconnect your Facebook account? This will
            completely disable automatic event posting and remove all stored
            page tokens.
          </Paragraph>
        </div>
      </Modal>
    </div>
  );
};

export default FacebookIntegrationCard;
