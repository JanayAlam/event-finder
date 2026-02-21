import { TEventDetail } from "../../../../server/models/event.model";

interface EventMembersProps {
  event: TEventDetail;
}

export const EventMembers = ({ event }: EventMembersProps) => {
  return (
    <div className="py-4">
      <h2 className="text-xl font-semibold mb-2">
        Members ({event.members.length})
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
        {event.members.map((member: any, index: number) => (
          <div
            key={index}
            className="flex items-center gap-3 p-3 border rounded-lg"
          >
            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center font-bold">
              {member.name?.[0] || member.email?.[0] || "U"}
            </div>
            <div>
              <p className="font-medium text-sm">
                {member.name || "Anonymous"}
              </p>
              <p className="text-xs text-muted-foreground">
                {member.role || "Member"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
