"use client";

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
  EmptyDescription
} from "@/components/shared/shadcn-components/empty";
import { Separator } from "@/components/shared/shadcn-components/separator";
import {
  H4,
  Paragraph,
  TypographyMuted
} from "@/components/shared/shadcn-components/typography";
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
    <div className="space-y-6">
      {/* Bio Section */}
      {bio && (
        <>
          <div>
            <H4 className="mb-2">Bio</H4>
            <TypographyMuted>{bio}</TypographyMuted>
          </div>
          <Separator />
        </>
      )}

      {/* Reviews Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
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

        {reviews.length === 0 ? (
          <Empty>
            <EmptyDescription>No reviews yet</EmptyDescription>
          </Empty>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <TypographyMuted className="font-semibold">
                    {review.author}
                  </TypographyMuted>
                  <TypographyMuted className="text-xs">
                    {new Date(review.date).toLocaleDateString()}
                  </TypographyMuted>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-yellow-500">★</span>
                  <TypographyMuted>{review.rating}/5</TypographyMuted>
                </div>
                <TypographyMuted>{review.comment}</TypographyMuted>
                <Separator />
              </div>
            ))}
          </div>
        )}
      </div>

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
