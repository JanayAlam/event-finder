import TMCard from "@/components/shared/molecules/tm-card";
import { AccountVerificationStatus } from "../../../../../components/ui/account-preferences/account-verification";

export const metadata = {
  title: "Verification",
  description: "Account verification data"
};

const VerificationPage = () => {
  return (
    <TMCard title="Verification">
      <AccountVerificationStatus />
    </TMCard>
  );
};

export default VerificationPage;
