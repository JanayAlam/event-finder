"use client";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/shared/shadcn-components/tabs";
import { useAuthStore } from "@/stores/auth-store";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";
import { useEffect } from "react";
import { TEventDetail } from "../../../../server/models/event.model";
import { TUserWithProfile } from "../../../../server/models/user.model";
import { EventAbout } from "./event-about";
import { EventDiscussion } from "./event-discussion";
import { EventMembers } from "./event-members";

const tabTriggerClasses =
  "rounded-none shadow-none! border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent shadow-none px-0 py-2 transition-none";

const tabContentClasses = "focus-visible:ring-0 py-4";

interface EventDetailsTabsProps {
  event: TEventDetail;
}

export const EventDetailsTabs = ({ event }: EventDetailsTabsProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { user, isLoggedIn, isInitialLoading } = useAuthStore();
  const activeTab = searchParams.get("tab") || "about";

  useEffect(() => {
    if (!isInitialLoading && activeTab === "discussion" && !isLoggedIn) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("tab", "about");
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    }
  }, [activeTab, isLoggedIn, isInitialLoading, pathname, router, searchParams]);

  const handleTabChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", value);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const isJoined =
    event.members.some(
      (m: TUserWithProfile) => m._id.toString() === user?._id.toString()
    ) || event.host._id.toString() === user?._id.toString();

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
      <TabsList className="w-full justify-start border-b rounded-none bg-transparent h-auto p-0 gap-6">
        <TabsTrigger value="about" className={tabTriggerClasses}>
          About
        </TabsTrigger>
        {isLoggedIn && isJoined && (
          <TabsTrigger value="discussion" className={tabTriggerClasses}>
            Discussions
          </TabsTrigger>
        )}
        <TabsTrigger value="members" className={tabTriggerClasses}>
          Members
        </TabsTrigger>
      </TabsList>
      <TabsContent value="about" className={tabContentClasses}>
        <EventAbout event={event} />
      </TabsContent>
      {isLoggedIn && isJoined && (
        <TabsContent value="discussion" className={tabContentClasses}>
          <EventDiscussion event={event} />
        </TabsContent>
      )}
      <TabsContent value="members" className={tabContentClasses}>
        <EventMembers event={event} />
      </TabsContent>
    </Tabs>
  );
};
