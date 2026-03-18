"use client";

import ImageInput from "@/components/shared/atoms/inputs/image-input";
import Modal from "@/components/shared/organisms/modal/Modal";
import { Button } from "@/components/shared/shadcn-components/button";
import { Textarea } from "@/components/shared/shadcn-components/textarea";
import { Paragraph } from "@/components/shared/shadcn-components/typography";
import DiscussionRepository from "@/repositories/discussion.repository";
import { useAuthStore } from "@/stores/auth-store";
import { Image as ImageIcon, Plus } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

interface ICreatePostCardProps {
  eventId: string;
}

export const CreatePostCard: React.FC<ICreatePostCardProps> = ({ eventId }) => {
  const { user } = useAuthStore();

  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState("");
  const [attachedImages, setAttachedImages] = useState<string[]>([]);
  const [isPosting, setIsPosting] = useState(false);
  const [uploadingIndexes, setUploadingIndexes] = useState<number[]>([]);

  const handleImageChange = async (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setUploadingIndexes((prev) => [...prev, index]);
        const { path } = await DiscussionRepository.uploadPhoto(eventId, file);

        const newImages = [...attachedImages];
        newImages[index] = path;

        // If we filled the last box and have room, add a new empty one
        if (index === attachedImages.length - 1 && attachedImages.length < 4) {
          newImages.push("");
        }

        setAttachedImages(newImages);
      } catch (error: any) {
        toast.error(error.response?.data?.message || "Failed to upload image");
      } finally {
        setUploadingIndexes((prev) => prev.filter((i) => i !== index));
      }
    }
  };

  const handleRemoveImage = async (index: number) => {
    const pathToRemove = attachedImages[index];
    const newImages = attachedImages.filter((_, i) => i !== index);

    if (
      newImages.length > 0 &&
      !newImages.includes("") &&
      newImages.length < 4
    ) {
      newImages.push("");
    }

    setAttachedImages(newImages);

    if (pathToRemove && !pathToRemove.startsWith("blob:")) {
      try {
        await DiscussionRepository.removePhoto(eventId, pathToRemove);
      } catch {}
    }
  };

  const handleCloseModal = () => {
    setIsOpen(false);
    setContent("");
    setAttachedImages([]);
    setUploadingIndexes([]);
  };

  const handlePost = async () => {
    const images = attachedImages.filter((img) => img !== "");

    if (!content.trim() && !images.length) return;

    try {
      setIsPosting(true);

      await DiscussionRepository.create(eventId, {
        content: content.trim(),
        images: images.length > 0 ? images : undefined
      });

      toast.success("Post created successfully");
      handleCloseModal();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create post");
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="hover:bg-secondary/80 bg-secondary/50"
      >
        <Plus />
        Add Post
      </Button>

      <Modal
        isOpen={isOpen}
        closeHandler={handleCloseModal}
        title="Create post"
        footer={
          <div className="flex items-center justify-between w-full">
            <div>
              {attachedImages.length === 0 && (
                <Button
                  variant="outline"
                  onClick={() => setAttachedImages([""])}
                >
                  <ImageIcon className="size-4" />
                  Attach Images
                </Button>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={handleCloseModal}
                variant="outline"
                className="hover:bg-secondary/80 bg-secondary/50"
              >
                Cancel
              </Button>
              <Button
                onClick={handlePost}
                isLoading={isPosting}
                className="hover:bg-secondary/80 bg-secondary/50 min-w-20"
              >
                Post
              </Button>
            </div>
          </div>
        }
      >
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-1">
            <Paragraph className="text-sm">Create post as</Paragraph>
            <Paragraph className="font-semibold text-sm">
              {`${user?.profile?.firstName} ${user?.profile?.lastName}`}
            </Paragraph>
          </div>

          <Textarea
            placeholder="What do you want to share?"
            className="min-h-[120px]"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />

          {attachedImages.length ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {attachedImages.map((img, idx) => (
                <ImageInput
                  key={idx}
                  value={img}
                  isLoading={uploadingIndexes.includes(idx)}
                  onChange={(e) => handleImageChange(idx, e)}
                  onRemove={
                    img !== "" ||
                    attachedImages.filter((image) => image === "").length > 1
                      ? () => handleRemoveImage(idx)
                      : undefined
                  }
                  ratio={1}
                  className="aspect-square"
                />
              ))}
            </div>
          ) : null}
        </div>
      </Modal>
    </>
  );
};
