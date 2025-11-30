import Card from "@/components/shared/molecules/card";
import AccountVerificationStatus from "./account-verification-status";

export const metadata = {
  title: "Verification",
  description: "Account verification data"
};

const VerificationPage = () => {
  return (
    <Card
      title="Verification"
      description="Update and verify your identity documents to keep your account secure."
    >
      <AccountVerificationStatus />
    </Card>
  );
};

export default VerificationPage;
