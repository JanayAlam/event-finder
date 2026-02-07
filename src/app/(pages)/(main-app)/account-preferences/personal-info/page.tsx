import TMCard from "@/components/shared/molecules/tm-card";
import { PersonalInfoForm } from "../../../../../components/ui/account-preferences/personal-info";

export const metadata = {
  title: "Personal Info",
  description: "Manage your account's personal information"
};

const PersonalInfoPage = () => {
  return (
    <TMCard title="Personal Information">
      <PersonalInfoForm />
    </TMCard>
  );
};

export default PersonalInfoPage;
