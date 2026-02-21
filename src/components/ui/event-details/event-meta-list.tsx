import { EventMetaItem } from "@/components/shared/molecules/event-meta-item";
import dayjs from "dayjs";
import { Banknote, CalendarDays, Clock, MapPin, Users } from "lucide-react";
import { TEventDetail } from "../../../../server/models/event.model";

interface EventMetaListProps {
  event: TEventDetail;
}

export const EventMetaList = ({ event }: EventMetaListProps) => {
  const metaItems = [
    { icon: MapPin, text: event.placeName },
    {
      icon: CalendarDays,
      text: dayjs(event.eventDate).format("DD MMM, YYYY")
    },
    {
      icon: Clock,
      text: `${event.dayCount} Days, ${event.nightCount} Nights`
    },
    {
      icon: Users,
      text: `${event.members.length} / ${event.memberCapacity || "∞"} Members`
    },
    {
      icon: Banknote,
      text: event.entryFee > 0 ? `${event.entryFee} BDT` : "Free"
    }
  ];

  return (
    <div className="flex flex-wrap gap-y-3 gap-x-6 items-center">
      {metaItems.map((item, index) => (
        <EventMetaItem key={index} icon={item.icon} text={item.text} />
      ))}
    </div>
  );
};
