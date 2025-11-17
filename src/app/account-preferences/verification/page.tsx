import SettingsCard from "@/components/ui/account-preferences/settings-card";

export const metadata = {
  title: "Verification",
  description: "Account verification data"
};

const VerificationPage = () => {
  return (
    <SettingsCard
      title="Verification"
      description="Update and verify your identity documents to keep your account secure."
    >
      Verification Page
    </SettingsCard>
  );
};

export default VerificationPage;
