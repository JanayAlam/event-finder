"use client";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/shared/shadcn-components/tabs";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";
import { TEventDetail } from "../../../../server/models/event.model";
import { EventAbout } from "./event-about";
import { EventDiscussion } from "./event-discussion";
import { EventMembers } from "./event-members";

interface EventDetailsTabsProps {
  event: TEventDetail;
}

export const EventDetailsTabs = ({ event }: EventDetailsTabsProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const activeTab = searchParams.get("tab") || "about";

  const handleTabChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", value);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
      <TabsList className="w-full justify-start border-b rounded-none bg-transparent h-auto p-0 gap-6">
        <TabsTrigger
          value="about"
          className="rounded-none shadow-none! border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent shadow-none px-0 py-2 transition-none"
        >
          About
        </TabsTrigger>
        <TabsTrigger
          value="discussion"
          className="rounded-none shadow-none! border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent shadow-none px-0 py-2 transition-none"
        >
          Discussion
        </TabsTrigger>
        <TabsTrigger
          value="members"
          className="rounded-none shadow-none! border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent shadow-none px-0 py-2 transition-none"
        >
          Members
        </TabsTrigger>
      </TabsList>
      <TabsContent value="about" className="focus-visible:ring-0 py-4">
        <EventAbout event={event} />
      </TabsContent>
      <TabsContent value="discussion" className="focus-visible:ring-0 py-4">
        <EventDiscussion />
      </TabsContent>
      <TabsContent value="members" className="focus-visible:ring-0 py-4">
        <EventMembers event={event} />
      </TabsContent>
    </Tabs>
  );
};
