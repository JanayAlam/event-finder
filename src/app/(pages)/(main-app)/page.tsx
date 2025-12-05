import CreateEventSection from "@/components/ui/homepage/create-event-section";
import AISearchSection from "@/components/ui/homepage/create-event-section/ai-search-section";

export default function Home() {
  return (
    <div className="flex flex-col gap-4">
      <CreateEventSection />
      <AISearchSection />
    </div>
  );
}
