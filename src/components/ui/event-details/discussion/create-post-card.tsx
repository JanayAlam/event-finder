"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from "@/components/shared/shadcn-components/avatar";
import { Button } from "@/components/shared/shadcn-components/button";
import { Card, CardContent } from "@/components/shared/shadcn-components/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/shared/shadcn-components/dialog";
import { Textarea } from "@/components/shared/shadcn-components/textarea";
import { Image as ImageIcon, X } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

export const CreatePostCard: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState("");
  const [attachedImages, setAttachedImages] = useState<string[]>([]);

  const handlePost = () => {
    if (!content.trim()) return;
    toast.success("Post created successfully!");
    setContent("");
    setAttachedImages([]);
    setIsOpen(false);
  };

  return (
    <Card className="border-none shadow-sm mb-6">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src="https://i.pravatar.cc/150?u=me" alt="Me" />
            <AvatarFallback>ME</AvatarFallback>
          </Avatar>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button
                variant="secondary"
                className="flex-1 justify-start h-10 rounded-full text-muted-foreground font-normal hover:bg-secondary/80 bg-secondary/50"
              >
                What&apos;s on your mind?
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden">
              <DialogHeader className="p-4 border-b">
                <DialogTitle className="text-center font-bold">
                  Create Post
                </DialogTitle>
              </DialogHeader>
              <div className="p-4 flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <Avatar className="w-10 h-10">
                    <AvatarImage
                      src="https://i.pravatar.cc/150?u=me"
                      alt="Me"
                    />
                    <AvatarFallback>ME</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="font-semibold text-sm">
                      John Traveller
                    </span>
                    <span className="text-xs bg-secondary px-2 py-0.5 rounded-md w-fit">
                      Public
                    </span>
                  </div>
                </div>

                <Textarea
                  placeholder="What's on your mind?"
                  className="min-h-[120px] resize-none border-none focus-visible:ring-0 text-lg p-0"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />

                {attachedImages.length > 0 && (
                  <div className="grid grid-cols-2 gap-2 relative">
                    {attachedImages.map((img, idx) => (
                      <div
                        key={idx}
                        className="relative aspect-video rounded-lg overflow-hidden border"
                      >
                        <Avatar className="w-full h-full rounded-none">
                          <AvatarImage
                            src={img}
                            alt="Attached"
                            className="object-cover aspect-video"
                          />
                        </Avatar>
                        <Button
                          size="icon"
                          variant="destructive"
                          className="absolute top-1 right-1 h-6 w-6 rounded-full"
                          onClick={() =>
                            setAttachedImages((prev) =>
                              prev.filter((_, i) => i !== idx)
                            )
                          }
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between border rounded-lg p-3">
                  <span className="text-sm font-medium">Add to your post</span>
                  <div className="flex items-center gap-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-green-500 hover:text-green-600 hover:bg-green-50"
                      onClick={() =>
                        setAttachedImages([
                          "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b"
                        ])
                      }
                    >
                      <ImageIcon className="w-5 h-5" />
                    </Button>
                  </div>
                </div>

                <Button
                  className="w-full font-bold"
                  disabled={!content.trim()}
                  onClick={handlePost}
                >
                  Post
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
};
