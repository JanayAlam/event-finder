import {
  ProfileAside,
  ProfileHeader,
  ProfileSection
} from "@/components/ui/profile-page";
import { PAGE_WIDTH_CLASS_NAME } from "@/constants";
import { cn } from "@/lib/utils";
import ProfileRepository from "@/repositories/profile.repository";

export default async function ProfilePage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const profile = await ProfileRepository.getProfileWithUser(id);

  // Dummy stats
  const dummyStats = {
    tripsJoined: 24,
    eventsHosted: 12,
    rating: 4.8,
    memberSinceYears: 5
  };

  // Dummy reviews
  const dummyReviews = [
    {
      id: "1",
      author: "Sarah Johnson",
      rating: 5,
      comment:
        "Amazing host! Very organized and friendly. The trip was well-planned and exceeded expectations.",
      date: new Date("2026-01-20")
    },
    {
      id: "2",
      author: "Mike Chen",
      rating: 4.5,
      comment:
        "Great experience overall. Janay was very responsive and helpful throughout the trip.",
      date: new Date("2025-12-10")
    },
    {
      id: "3",
      author: "Emma Wilson",
      rating: 5,
      comment:
        "One of the best trips I've been on! Highly recommend joining any event hosted by Janay.",
      date: new Date("2025-11-05")
    }
  ];

  return (
    <div
      className={cn(PAGE_WIDTH_CLASS_NAME, "py-6 flex flex-col gap-4 sm:gap-6")}
    >
      <ProfileHeader profile={profile} stats={dummyStats} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
        <div className="lg:col-span-4">
          <ProfileAside
            bio={profile?.bio}
            reviews={dummyReviews}
            isOwnProfile={false}
            isAuthenticated={true}
          />
        </div>
        <div className="lg:col-span-8">
          <ProfileSection />
        </div>
      </div>
    </div>
  );
}
