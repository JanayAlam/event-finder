import { EmptyData } from "@/components/shared/molecules/empty";
import {
  ProfileAside,
  ProfileHeader,
  ProfileSection
} from "@/components/ui/profile-page";
import { PAGE_WIDTH_CLASS_NAME } from "@/constants";
import { cn } from "@/lib/utils";
import EventRepository from "@/repositories/event.repository";
import ProfileRepository from "@/repositories/profile.repository";

export default async function ProfilePage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [profile, stats] = await Promise.all([
    ProfileRepository.getProfileWithUser(id),
    ProfileRepository.getTripStatus(id)
  ]);

  if (!profile || !stats) {
    return <EmptyData message="Profile not found" />;
  }

  const userId = profile.user._id.toString();
  const recentHostedEvents =
    stats.eventsHosted !== null
      ? await EventRepository.getRecentHosted(userId)
      : [];
  const recentJoinedEvents = await EventRepository.getRecentJoined(userId);

  return (
    <div
      className={cn(PAGE_WIDTH_CLASS_NAME, "py-6 flex flex-col gap-4 sm:gap-6")}
    >
      <ProfileHeader profile={profile} stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
        <div className="lg:col-span-4">
          <ProfileAside profileId={id} bio={profile?.bio} />
        </div>
        <div className="lg:col-span-8">
          <ProfileSection
            showHosted={stats.eventsHosted !== null}
            recentHostedEvents={recentHostedEvents}
            recentJoinedEvents={recentJoinedEvents}
          />
        </div>
      </div>
    </div>
  );
}
