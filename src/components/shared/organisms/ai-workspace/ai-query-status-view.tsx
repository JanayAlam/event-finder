import { AlertCircle, Info } from "lucide-react";
import { PageLoader } from "../../molecules/page-loader";
import { Empty, EmptyContent, EmptyMedia } from "../../shadcn-components/empty";
import { Paragraph } from "../../shadcn-components/typography";

interface IAIQueryStatusViewProps {
  isLoading: boolean;
  message?: string;
  error?: string;
}

export const AIQueryStatusView: React.FC<IAIQueryStatusViewProps> = ({
  isLoading,
  message,
  error
}) => {
  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <PageLoader />
      </div>
    );
  }

  if (error) {
    return (
      <Empty className="gap-2 py-8">
        <EmptyMedia variant="icon">
          <AlertCircle className="size-5 text-destructive" />
        </EmptyMedia>
        <EmptyContent>
          <Paragraph className="text-destructive font-medium">
            {error}
          </Paragraph>
        </EmptyContent>
      </Empty>
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
