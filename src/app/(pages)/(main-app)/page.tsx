import { AIWorkspaceCard } from "@/components/ui/homepage/ai-workspace";
import CreateEventSection from "@/components/ui/homepage/create-event-section";
import { UpcomingEvents } from "@/components/ui/homepage/upcoming-events";

export default function Home() {
  return (
    <div className="flex flex-col gap-4">
      <AIWorkspaceCard />
      <CreateEventSection />
      <UpcomingEvents />
    </div>
  );
}
