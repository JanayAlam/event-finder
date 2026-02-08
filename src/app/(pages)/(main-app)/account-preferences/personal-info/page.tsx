import TMCard from "@/components/shared/molecules/tm-card";
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
      <TMCard title="Profile Image">
        <ProfileImageForm />
      </TMCard>
      <TMCard title="Personal Information">
        <PersonalInfoForm />
      </TMCard>
    </div>
  );
};

export default PersonalInfoPage;
