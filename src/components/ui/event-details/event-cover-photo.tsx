"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from "@/components/shared/shadcn-components/avatar";
import { Button } from "@/components/shared/shadcn-components/button";
import { Spinner } from "@/components/shared/shadcn-components/spinner";
import { getImageUrl } from "@/lib/utils";
import EventRepository from "@/repositories/event.repository";
import { useAuthStore } from "@/stores/auth-store";
import { useMutation } from "@tanstack/react-query";
import { ImageIcon, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useRef, useState } from "react";
import { toast } from "sonner";
import { TEventDetail } from "../../../../server/models/event.model";

interface IEventCoverPhotoProps {
  event: TEventDetail;
}

export const EventCoverPhoto: React.FC<IEventCoverPhotoProps> = ({ event }) => {
  const router = useRouter();

  const { user } = useAuthStore();

  const isHost = event.host._id.toString() === user?._id?.toString();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const { mutateAsync: updateEventAsync, isPending: isUpdating } = useMutation({
    mutationFn: (data: { coverPhoto: string }) =>
      EventRepository.update(event._id.toString(), data),
    onSuccess: () => {
      router.refresh();
    }
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    const uploadPromise = (async () => {
      const { path } = await EventRepository.uploadCoverPhoto(file);
      await updateEventAsync({ coverPhoto: path });
    })();

    toast.promise(uploadPromise, {
      loading: "Updating cover photo...",
      success: "Cover photo updated successfully",
      error: (error: any) =>
        error.response?.data?.message ||
        error.message ||
        "Failed to update cover photo"
    });

    try {
      await uploadPromise;
    } catch {
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemove = () => {
    const removePromise = updateEventAsync({ coverPhoto: "" });

    toast.promise(removePromise, {
      loading: "Removing cover photo...",
      success: "Cover photo removed successfully",
      error: (error: any) =>
        error.response?.data?.message ||
        error.message ||
        "Failed to remove cover photo"
    });
  };

  return (
    <div className="relative group w-full h-50 sm:h-60 lg:h-80 rounded-md sm:rounded-xl overflow-hidden bg-linear-to-r from-violet-600 to-indigo-600">
      {event.coverPhoto && (
        <Avatar className="h-full w-full rounded-none">
          <AvatarImage
            src={getImageUrl(event.coverPhoto)}
            alt={event.title}
            className="object-cover"
          />
          <AvatarFallback className="rounded-none bg-linear-to-r from-violet-600 to-indigo-600" />
        </Avatar>
      )}

      {isHost && (
        <div className="absolute top-4 right-4 hidden group-hover:flex items-center gap-2">
          {event.coverPhoto && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleRemove}
              disabled={isUpdating || isUploading}
              className="group bg-destructive/60! hover:bg-background/80 dark:bg-white! dark:hover:bg-white!"
            >
              {isUpdating && !isUploading ? (
                <Spinner className="size-4" color="text-destructive!" />
              ) : (
                <Trash2 className="size-4 group-hover:text-white! dark:text-destructive! dark:group-hover:text-destructive!" />
              )}
            </Button>
          )}
          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUpdating || isUploading}
            isLoading={isUploading}
            className="bg-primary/60 text-white! hover:bg-primary/60! hover:text-white! dark:bg-white! dark:text-primary! dark:hover:bg-white! dark:hover:text-primary!"
          >
            <ImageIcon className="size-4" />
            Change
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
        </div>
      )}
    </div>
  );
};
