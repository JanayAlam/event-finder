"use client";

import EFCard from "@/components/shared/molecules/ef-card";
import Modal from "@/components/shared/organisms/modal/Modal";
import { Button } from "@/components/shared/shadcn-components/button";
import {
  H2,
  TypographyMuted
} from "@/components/shared/shadcn-components/typography";
import { API_BASE_URL } from "@/config";
import { PRIVATE_PAGE_ROUTE } from "@/routes";
import { useAuthStore } from "@/stores/auth-store";
import { CalendarCheck, Compass, Sparkles } from "lucide-react";
import { useRouter } from "nextjs-toploader/app";
import { useState } from "react";
import { AIFeatureCard } from "./ai-feature-card";

export function AIWorkspaceCard() {
  const router = useRouter();

  const { isLoggedIn } = useAuthStore();

  const [showLoginDialog, setShowLoginDialog] = useState(false);

  const handleLaunch = () => {
    if (!isLoggedIn) {
      setShowLoginDialog(true);
      return;
    }

    router.push(PRIVATE_PAGE_ROUTE.AI);
  };

  const handleLoginAction = () => {
    window.location.href = `${API_BASE_URL}/auth/login`;
  };

  return (
    <EFCard rootClassName="bg-primary/3 rounded-xl border-0">
      <div className="flex flex-col gap-6">
        <H2 className="text-xl md:text-2xl font-semibold text-foreground">
          AI Experience Hub
        </H2>

        <div className="grid gap-4 md:grid-cols-3">
          <AIFeatureCard
            icon={Compass}
            title="Discover"
            description="Find experiences that match your mood, timing, and budget."
          />
          <AIFeatureCard
            icon={CalendarCheck}
            title="Plan"
            description="Build a day-by-day plan with recommendations you can act on."
          />
          <AIFeatureCard
            icon={Sparkles}
            title="Personalize"
            description="Tailor results for groups, interests, and special occasions."
          />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <TypographyMuted className="text-sm">
            Launch the AI workspace to get started.
          </TypographyMuted>
          <Button
            onClick={handleLaunch}
            className="h-11 px-6 rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
          >
            AI Workspace
          </Button>
        </div>
      </div>
      <Modal
        isOpen={showLoginDialog}
        closeHandler={() => setShowLoginDialog(false)}
        okHandler={() => {
          setShowLoginDialog(false);
          handleLoginAction();
        }}
        title="Login required"
        okText="Go to login"
      >
        <TypographyMuted className="text-sm">
          Please log in to use the AI Workspace and get personalized trip
          suggestions.
        </TypographyMuted>
      </Modal>
    </EFCard>
  );
}
