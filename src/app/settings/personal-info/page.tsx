import SettingsCard from "@/components/ui/settings/settings-card";

export const metadata = {
  title: "Personal Info",
  description: "Manage your account's personal information"
};

const PersonalInfoPage = () => {
  return (
    <SettingsCard
      title="Personal Information"
      description="Manage your personal details and update your TripMate account
          information."
    >
      Personal Information
    </SettingsCard>
  );
};

export default PersonalInfoPage;
