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

  return (
    <div
      className={cn(PAGE_WIDTH_CLASS_NAME, "py-6 flex flex-col gap-4 sm:gap-6")}
    >
      <ProfileHeader profile={profile} stats={dummyStats} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
        <div className="lg:col-span-4">
          <ProfileAside profileId={id} bio={profile?.bio} />
        </div>
        <div className="lg:col-span-8">
          <ProfileSection />
        </div>
      </div>
    </div>
  );
}
