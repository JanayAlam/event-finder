"use client";

import { Button } from "@/components/shared/shadcn-components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/shared/shadcn-components/dialog";
import {
  H4,
  TypographyMuted
} from "@/components/shared/shadcn-components/typography";
import { cn, getImageUrl } from "@/lib/utils";
import AuthRepository from "@/repositories/auth.repository";
import ProfileRepository from "@/repositories/profile.repository";
import { useAuthStore } from "@/stores/auth-store";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import { Calendar, ImagePlus, User } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { TProfile } from "../../../../../server/models/profile.model";

type ProfileImageFormData = {
  profileImage: FileList | null;
};

const ProfileImageForm: React.FC = () => {
  const queryClient = useQueryClient();

  const { user, updateProfileImage } = useAuthStore();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [showRemoveDialog, setShowRemoveDialog] = useState(false);

  const { data: profile, isLoading } = useQuery({
    queryKey: ["my-profile"],
    queryFn: () => AuthRepository.getMyProfile(),
    retry: false
  });

  const { watch, setValue, reset } = useForm<ProfileImageFormData>({
    defaultValues: {
      profileImage: null
    }
  });

  // eslint-disable-next-line react-hooks/incompatible-library
  const profileImageFile = watch("profileImage");

  // Handle file selection
  useEffect(() => {
    if (profileImageFile && profileImageFile.length > 0) {
      const file = profileImageFile[0];
      setSelectedImage(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setSelectedImage(null);
      if (!profile?.profileImage) {
        setPreviewUrl(null);
      }
    }
  }, [profileImageFile, profile?.profileImage]);

  // Cleanup preview URL
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      if (!profile?._id) {
        throw new Error("Profile not found");
      }
      return await ProfileRepository.uploadProfileImage(
        profile._id.toString(),
        file
      );
    },
    onSuccess: (data) => {
      toast.success("Profile image uploaded successfully");
      queryClient.setQueryData(["my-profile"], (old: TProfile) => ({
        ...old,
        ...data
      }));
      updateProfileImage(data.profileImage ?? null);
      setSelectedImage(null);
      setPreviewUrl(null);
      reset({ profileImage: null });
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to upload profile image");
    }
  });

  const removeMutation = useMutation({
    mutationFn: async () => {
      if (!profile?._id) {
        throw new Error("Profile not found");
      }
      return await ProfileRepository.removeProfileImage(profile._id.toString());
    },
    onSuccess: (data) => {
      toast.success("Profile image removed successfully");
      queryClient.setQueryData(["my-profile"], (old: TProfile) => ({
        ...old,
        ...data,
        profileImage: null
      }));
      updateProfileImage(null);
      setSelectedImage(null);
      setPreviewUrl(null);
      reset({ profileImage: null });
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setShowRemoveDialog(false);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to remove profile image");
    }
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setValue("profileImage", files);
    }
  };

  const handleUpload = () => {
    if (selectedImage) {
      uploadMutation.mutate(selectedImage);
    }
  };

  const handleRemove = () => {
    if (selectedImage) {
      setSelectedImage(null);
      setPreviewUrl(null);
      setValue("profileImage", null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
        setSelectedImage(null);
      }
      return;
    }

    if (profile?.profileImage) {
      setShowRemoveDialog(true);
    }
  };

  const handleConfirmRemove = () => {
    removeMutation.mutate();
  };

  const handleImageClick = () => {
    if (!isLoading && !uploadMutation.isPending) {
      fileInputRef.current?.click();
    }
  };

  const fullName = profile
    ? `${profile.firstName} ${profile.lastName}`.trim()
    : "";

  const displayImageUrl = selectedImage
    ? previewUrl
    : getImageUrl(profile?.profileImage, {
        name: fullName || user?.email
      });

  const hasExistingImage = !!profile?.profileImage;
  const hasSelectedImage = !!selectedImage;
  const canRemove = hasSelectedImage || hasExistingImage;

  const formattedDateOfBirth = profile?.dateOfBirth
    ? dayjs(profile.dateOfBirth).format("MMM DD, YYYY")
    : null;
  const genderLabel =
    profile?.gender === "male"
      ? "Male"
      : profile?.gender === "female"
        ? "Female"
        : profile?.gender === "other"
          ? "Other"
          : null;

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-6 gap-6 items-center">
        <div className="md:col-span-3 flex flex-col items-center sm:items-start gap-4">
          <div className="flex items-center gap-6">
            <div className="relative">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                disabled={isLoading || uploadMutation.isPending}
              />
              <div
                role="button"
                onClick={handleImageClick}
                className={cn(
                  "relative w-32 h-32 rounded-full overflow-hidden border-2 border-dashed border-input dark:bg-input/25 cursor-pointer transition-all group",
                  (isLoading || uploadMutation.isPending) &&
                    "opacity-60 cursor-not-allowed"
                )}
              >
                {displayImageUrl ? (
                  <>
                    <Image
                      src={displayImageUrl}
                      alt="Profile"
                      fill
                      className="object-cover"
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                      <ImagePlus className="size-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      <ImagePlus className="size-5" />
                      <span className="text-xs text-center px-2">
                        Click to select
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              onClick={handleUpload}
              disabled={
                !selectedImage ||
                isLoading ||
                uploadMutation.isPending ||
                removeMutation.isPending
              }
              isLoading={uploadMutation.isPending}
              size="default"
            >
              Upload
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleRemove}
              disabled={
                !canRemove ||
                isLoading ||
                uploadMutation.isPending ||
                removeMutation.isPending
              }
              size="default"
            >
              Remove
            </Button>
          </div>
        </div>

        <div className="hidden md:flex md:col-span-3 flex-col gap-3 p-4 rounded-lg border border-input bg-card/50 dark:bg-card/30">
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12 rounded-full overflow-hidden border border-input shrink-0">
              {displayImageUrl ? (
                <Image
                  src={displayImageUrl}
                  alt="Profile preview"
                  fill
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-muted">
                  <User className="size-5 text-muted-foreground" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <H4 className="text-sm font-semibold truncate">
                {fullName || "Your Name"}
              </H4>
              <TypographyMuted className="text-xs truncate">
                {user?.email}
              </TypographyMuted>
            </div>
          </div>
          <div className="flex flex-col gap-1.5 pt-2 border-t border-input">
            {formattedDateOfBirth && (
              <div className="flex items-center gap-2 text-xs">
                <Calendar className="size-3.5 text-muted-foreground shrink-0" />
                <span className="text-muted-foreground">
                  {formattedDateOfBirth}
                </span>
              </div>
            )}
            {genderLabel && (
              <div className="flex items-center gap-2 text-xs">
                <User className="size-3.5 text-muted-foreground shrink-0" />
                <span className="text-muted-foreground">{genderLabel}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <Dialog open={showRemoveDialog} onOpenChange={setShowRemoveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove Profile Image</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove your profile image? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowRemoveDialog(false)}
              disabled={removeMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmRemove}
              isLoading={removeMutation.isPending}
              disabled={removeMutation.isPending}
            >
              Remove
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProfileImageForm;
