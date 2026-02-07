import { ProfileHeader } from "@/components/ui/profile-page";

export default async function ProfilePage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div>
      <ProfileHeader />
    </div>
  );
}
