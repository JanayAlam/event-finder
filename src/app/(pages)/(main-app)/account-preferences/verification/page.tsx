import EFCard from "@/components/shared/molecules/ef-card";
import { AccountVerificationStatus } from "../../../../../components/ui/account-preferences/account-verification";

export const metadata = {
  title: "Verification",
  description: "Account verification data"
};

const VerificationPage = () => {
  return (
    <EFCard title="Verification">
      <AccountVerificationStatus />
    </EFCard>
  );
};

export default VerificationPage;
