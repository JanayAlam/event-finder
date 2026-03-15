import EFCard from "@/components/shared/molecules/ef-card";
import {
  PersonalInfoForm,
  ProfileImageForm
} from "../../../../../components/ui/account-preferences/personal-info";

export const metadata = {
  title: "Personal Info",
  description: "Manage your account's personal information"
};

const PersonalInfoPage = () => {
  return (
    <div className="flex flex-col gap-4 sm:gap-6">
      <EFCard title="Profile Image">
        <ProfileImageForm />
      </EFCard>
      <EFCard title="Personal Information">
        <PersonalInfoForm />
      </EFCard>
    </div>
  );
};

export default PersonalInfoPage;
