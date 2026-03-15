"use client";

import image from "@/assets/mountain.png";
import EFCard from "@/components/shared/molecules/ef-card";
import { Button } from "@/components/shared/shadcn-components/button";
import { CardContent } from "@/components/shared/shadcn-components/card";
import {
  H2,
  TypographyMuted
} from "@/components/shared/shadcn-components/typography";
import { PRIVATE_HOST_ONLY_PAGE_ROUTE } from "@/routes";
import { useAuthStore } from "@/stores/auth-store";
import { CalendarPlus, Sparkles } from "lucide-react";
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
    <EFCard rootClassName="overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-br from-background via-background/95 to-primary/6 shadow-elevated">
      <CardContent className="relative z-10 p-0!">
        <div
          className="pointer-events-none absolute top-15 left-0 h-full w-full opacity-10 bg-no-repeat bg-contain max-md:hidden"
          style={{
            backgroundImage: `url(${image.src})`
          }}
        />
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-3 text-center lg:text-left">
            <div>
              <div className="mx-auto lg:mx-0 inline-flex items-center gap-2 rounded-full border border-border/50 bg-background/70 px-3 py-1 text-xs font-medium text-foreground/80">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                Host tools
              </div>
            </div>
            <H2 className="font-display text-2xl font-extrabold text-foreground">
              Create an event people remember
            </H2>
            <TypographyMuted className="max-w-xl">
              Publish your event, manage RSVPs, and share a beautiful detail
              page in minutes.
            </TypographyMuted>
          </div>

          <div className="flex w-full flex-col items-center gap-3 sm:flex-row sm:justify-center lg:w-auto lg:justify-end">
            <div className="hidden sm:flex items-center gap-3 rounded-full border border-border/40 bg-background/70 px-4 py-2 text-sm text-foreground/70">
              <CalendarPlus className="h-4 w-4 text-primary" />
              <span>Setup in minutes</span>
            </div>
            <Button
              variant="default"
              size="lg"
              className="w-full sm:w-auto h-12 px-8 rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={handleCreateEventAction}
            >
              <CalendarPlus className="size-5" />
              Create Event
            </Button>
          </div>
        </div>
      </CardContent>
    </EFCard>
  );
}
