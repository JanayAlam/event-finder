"use client";

import { EmptyList } from "@/components/shared/molecules/empty";
import { SliderField, TextareaField } from "@/components/shared/molecules/form";
import TMCard from "@/components/shared/molecules/tm-card";
import Modal from "@/components/shared/organisms/modal";
import { Button } from "@/components/shared/shadcn-components/button";
import { Separator } from "@/components/shared/shadcn-components/separator";
import {
  H4,
  Paragraph,
  TypographyMuted
} from "@/components/shared/shadcn-components/typography";
import ProfileReviewRepository from "@/repositories/profile-review.repository";
import { useAuthStore } from "@/stores/auth-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { Star } from "lucide-react";
import { useRouter } from "nextjs-toploader/app";
import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  ProfileReviewSchema,
  TProfileReviewRequest
} from "../../../../common/validation-schemas";
import { TProfileReview } from "../../../../server/models/profile-review.model";

interface ProfileAsideProps {
  profileId: string;
  bio?: string;
}

export const ProfileAside: React.FC<ProfileAsideProps> = ({
  profileId,
  bio
}) => {
  const router = useRouter();

  const { user, isLoggedIn } = useAuthStore();

  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [reviews, setReviews] = useState<TProfileReview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isOwnProfile = user?.profile?._id.toString() === profileId;

  const { control, handleSubmit, reset } = useForm<TProfileReviewRequest>({
    resolver: zodResolver(ProfileReviewSchema),
    defaultValues: {
      profile: profileId,
      rating: 5,
      message: ""
    }
  });

  const fetchReviews = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await ProfileReviewRepository.getReviewsOfProfile(profileId);
      setReviews(data);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to fetch reviews");
    } finally {
      setIsLoading(false);
    }
  }, [profileId]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const onSubmit = async (data: TProfileReviewRequest) => {
    try {
      setIsSubmitting(true);
      await ProfileReviewRepository.createReview(data);
      toast.success("Review submitted successfully");
      setIsReviewDialogOpen(false);
      reset();
      fetchReviews();
      router.refresh();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to submit review");
    } finally {
      setIsSubmitting(false);
    }
  };

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
          {isLoggedIn && !isOwnProfile && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsReviewDialogOpen(true)}
            >
              Write Review
            </Button>
          )}
        </div>

        {isLoading ? (
          <div className="flex flex-col gap-4 animate-pulse">
            {[1, 2].map((i) => (
              <div key={i} className="h-20 bg-muted rounded-md" />
            ))}
          </div>
        ) : !reviews.length ? (
          <EmptyList message="No reviews yet" />
        ) : (
          <div className="flex flex-col gap-4">
            {reviews.map((review, idx) => (
              <div key={review._id.toString()} className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <TypographyMuted>{review.rating}/5</TypographyMuted>
                    <Star className="size-4 fill-yellow-500 text-yellow-500" />
                  </div>
                  <TypographyMuted className="text-xs">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </TypographyMuted>
                </div>

                <div>
                  <Paragraph className="font-semibold text-sm">
                    {review.reviewerName}
                  </Paragraph>
                  <TypographyMuted className="text-sm">
                    {review.message}
                  </TypographyMuted>
                </div>
                {idx < reviews.length - 1 && <Separator className="my-2!" />}
              </div>
            ))}
          </div>
        )}
      </TMCard>

      {/* Review Dialog */}

      <Modal
        isOpen={isReviewDialogOpen}
        closeHandler={() => setIsReviewDialogOpen(false)}
        title="Write a Review"
        showFooter={false}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <SliderField
            control={control}
            name="rating"
            label="Rating"
            isRequired
            min={1}
            max={5}
            step={1}
          />

          <TextareaField
            control={control}
            name="message"
            label="Message"
            placeholder="Write your review here..."
            isRequired
            rows={4}
          />

          <div className="flex justify-end gap-2 border-t pt-4 mt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsReviewDialogOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              isLoading={isSubmitting}
            >
              Submit Review
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
