import {
  Alert,
  AlertDescription,
  AlertTitle
} from "@/components/shared/shadcn-components/alert";
import dayjs from "dayjs";
import { Info, Lock, ShieldBan } from "lucide-react";
import { TEventDetailDto } from "../../../../common/types";

export const EventStatusAlert = ({ event }: { event: TEventDetailDto }) => {
  const isPassed = dayjs(event.eventDate).isBefore(dayjs());
  const isBlocked = event.status === "blocked";
  const isClosed = event.status === "closed";

  if (!isPassed && !isBlocked && !isClosed) {
    return null;
  }

  let title = "";
  let description = "";
  let icon = <Info className="size-4" />;
  let variant: "default" | "destructive" = "default";
  let bgClass = "bg-secondary/20";

  if (isBlocked) {
    title = "Event Blocked";
    description =
      "This event has been blocked by an administrator and is no longer available for joining.";
    icon = <ShieldBan className="size-4" />;
    variant = "destructive";
    bgClass = "bg-destructive/10";
  } else if (isClosed) {
    title = "Event Closed";
    description =
      "This event has been closed by the host. You can no longer join this event.";
    icon = <Lock className="size-4" />;
    variant = "default";
    bgClass = "bg-secondary/20";
  } else if (isPassed) {
    title = "Event Passed";
    description =
      "This event has already taken place. You can no longer join this event.";
    icon = <Info className="size-4" />;
    variant = "default";
    bgClass = "bg-secondary/20";
  }

  return (
    <Alert variant={variant} className={`w-full ${bgClass}`}>
      {icon}
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{description}</AlertDescription>
    </Alert>
  );
};
