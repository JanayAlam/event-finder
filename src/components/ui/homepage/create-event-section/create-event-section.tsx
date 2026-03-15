"use client";

import image from "@/assets/mountain.png";
import TMCard from "@/components/shared/molecules/tm-card";
import { Button } from "@/components/shared/shadcn-components/button";
import { CardContent } from "@/components/shared/shadcn-components/card";
import {
  H2,
  TypographyMuted
} from "@/components/shared/shadcn-components/typography";
import { PRIVATE_HOST_ONLY_PAGE_ROUTE } from "@/routes";
import { useAuthStore } from "@/stores/auth-store";
import { Plus } from "lucide-react";
import { useRouter } from "nextjs-toploader/app";
import { USER_ROLE } from "../../../../../server/enums";

export default function CreateEventSection() {
  const router = useRouter();

  const { isInitialLoading, user } = useAuthStore();

  const handleCreateEventAction = () => {
    router.push(PRIVATE_HOST_ONLY_PAGE_ROUTE.CREATE_EVENT);
  };

  if (isInitialLoading || user?.role !== USER_ROLE.HOST) {
    return null;
  }

  return (
    <TMCard rootClassName="overflow-hidden rounded-2xl shadow-elevated light:bg-[#EBF0F8]">
      <CardContent className="relative z-10 p-4 sm:p-6">
        <div
          className="pointer-events-none absolute top-15 left-0 h-full w-full opacity-10 bg-no-repeat bg-contain max-md:hidden"
          style={{
            backgroundImage: `url(${image.src})`
          }}
        />
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left flex flex-col gap-2">
            <H2 className="font-display font-extrabold text-primary">
              Start an event
            </H2>
            <TypographyMuted>
              Create an event and invite others to join your adventure
            </TypographyMuted>
          </div>

          <Button
            variant="default"
            size="lg"
            className="w-full md:w-auto h-12 px-10! bg-primary hover:bg-primary/90 dark:text-primary"
            onClick={handleCreateEventAction}
          >
            <Plus className="size-5" />
            Create Event
          </Button>
        </div>
      </CardContent>
    </TMCard>
  );
}
