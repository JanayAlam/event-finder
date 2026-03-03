"use client";

import { Button } from "@/components/shared/shadcn-components/button";
import { PRIVATE_HOST_ONLY_PAGE_ROUTE } from "@/routes";
import { WandSparkles } from "lucide-react";
import { useRouter } from "nextjs-toploader/app";

export const CreateWithAIButton = () => {
  const router = useRouter();

  const onClick = () => {
    router.push(PRIVATE_HOST_ONLY_PAGE_ROUTE.CREATE_EVENT_WITH_AI);
  };

  return (
    <Button className="magic-glow rounded-md!" onClick={onClick}>
      <WandSparkles className="text-white" />
      <span className="text-white">Create with AI</span>
    </Button>
  );
};
