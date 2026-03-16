import { Info } from "lucide-react";
import { PageLoader } from "../../molecules/page-loader";
import { Empty, EmptyContent, EmptyMedia } from "../../shadcn-components/empty";

interface IAIQueryStatusViewProps {
  isLoading: boolean;
  message?: string;
}

export const AIQueryStatusView: React.FC<IAIQueryStatusViewProps> = ({
  isLoading,
  message
}) => {
  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <PageLoader />
      </div>
    );
  }

  if (!message) {
    return null;
  }

  return (
    <Empty className="gap-2 py-8">
      <EmptyMedia variant="icon">
        <Info className="size-5" />
      </EmptyMedia>
      <EmptyContent>{message}</EmptyContent>
    </Empty>
  );
};
