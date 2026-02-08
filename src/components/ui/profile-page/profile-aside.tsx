"use client";

import TMCard from "@/components/shared/molecules/tm-card";
import { Button } from "@/components/shared/shadcn-components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/shared/shadcn-components/dialog";
import {
  Empty,
  EmptyDescription,
  EmptyMedia
} from "@/components/shared/shadcn-components/empty";
import { Separator } from "@/components/shared/shadcn-components/separator";
import {
  H4,
  Paragraph,
  TypographyMuted
} from "@/components/shared/shadcn-components/typography";
import { ListX, Star } from "lucide-react";
import React, { useState } from "react";

interface Review {
  id: string;
  author: string;
  rating: number;
  comment: string;
  date: Date;
}

interface ProfileAsideProps {
  bio?: string;
  reviews: Review[];
  isOwnProfile: boolean;
  isAuthenticated: boolean;
}

export const ProfileAside: React.FC<ProfileAsideProps> = ({
  bio,
  reviews,
  isOwnProfile,
  isAuthenticated
}) => {
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      {/* Bio Section */}
      {bio && (
        <TMCard bodyClassName="flex flex-col gap-3">
          <H4>Bio</H4>
          <TypographyMuted className="text-sm">{bio}</TypographyMuted>
        </TMCard>
      )}

      {/* Reviews Section */}
      <TMCard bodyClassName="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <H4>Reviews</H4>
          {isAuthenticated && !isOwnProfile && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsReviewDialogOpen(true)}
            >
              Write Review
            </Button>
          )}
        </div>

        {!reviews.length ? (
          <Empty className="flex flex-col gap-2">
            <EmptyMedia>
              <ListX className="size-5 text-muted-foreground" />
            </EmptyMedia>
            <EmptyDescription>No reviews yet</EmptyDescription>
          </Empty>
        ) : (
          <div className="flex flex-col gap-4">
            {reviews.map((review, idx) => (
              <div key={review.id} className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <TypographyMuted>{review.rating}/5</TypographyMuted>
                    <Star className="size-4 fill-yellow-500 text-yellow-500" />
                  </div>
                  <TypographyMuted className="text-xs">
                    {new Date(review.date).toLocaleDateString()}
                  </TypographyMuted>
                </div>

                <div>
                  <Paragraph className="font-semibold">
                    {review.author}
                  </Paragraph>
                  <TypographyMuted>{review.comment}</TypographyMuted>
                </div>
                {idx < reviews.length - 1 && <Separator className="my-2!" />}
              </div>
            ))}
          </div>
        )}
      </TMCard>

      {/* Review Dialog */}
      <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Write a Review</DialogTitle>
            <DialogDescription>
              Share your experience with this user
            </DialogDescription>
          </DialogHeader>
          <Paragraph>Review form will be implemented here.</Paragraph>
        </DialogContent>
      </Dialog>
    </div>
  );
};
