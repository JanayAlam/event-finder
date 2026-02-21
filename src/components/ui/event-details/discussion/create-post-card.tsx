"use client";

import ImageInput from "@/components/shared/atoms/inputs/image-input";
import Modal from "@/components/shared/organisms/modal/Modal";
import { Button } from "@/components/shared/shadcn-components/button";
import { Textarea } from "@/components/shared/shadcn-components/textarea";
import { Paragraph } from "@/components/shared/shadcn-components/typography";
import { useAuthStore } from "@/stores/auth-store";
import { Image as ImageIcon, Plus } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

export const CreatePostCard: React.FC = () => {
  const { user } = useAuthStore();

  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState("");
  const [attachedImages, setAttachedImages] = useState<string[]>([]);

  const handleImageChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      const newImages = [...attachedImages];
      newImages[index] = url;

      // If we filled the last box and have room, add a new empty one
      if (index === attachedImages.length - 1 && attachedImages.length < 4) {
        newImages.push("");
      }

      setAttachedImages(newImages);
    }
  };

  const handleRemoveImage = (index: number) => {
    const newImages = attachedImages.filter((_, i) => i !== index);
    setAttachedImages(newImages);
  };

  const handlePost = () => {
    if (!content.trim()) return;
    toast.success("Post created successfully!");
    setContent("");
    setAttachedImages([]);
    setIsOpen(false);
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
        closeHandler={() => setIsOpen(false)}
        title="Create Post"
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
                onClick={() => setIsOpen(false)}
                variant="outline"
                className="hover:bg-secondary/80 bg-secondary/50"
              >
                Cancel
              </Button>
              <Button
                onClick={handlePost}
                className="hover:bg-secondary/80 bg-secondary/50"
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
                  onChange={(e) => handleImageChange(idx, e)}
                  onRemove={() => handleRemoveImage(idx)}
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
