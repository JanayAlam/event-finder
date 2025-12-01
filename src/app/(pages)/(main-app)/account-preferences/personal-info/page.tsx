import Card from "@/components/shared/molecules/card";
import { PersonalInfoForm } from "../../../../../components/ui/account-preferences/personal-info";

export const metadata = {
  title: "Personal Info",
  description: "Manage your account's personal information"
};

const PersonalInfoPage = () => {
  return (
    <Card
      title="Personal Information"
      description="Manage your personal details and update your TripMate account
          information."
    >
      <PersonalInfoForm />
    </Card>
  );
};

export default PersonalInfoPage;
