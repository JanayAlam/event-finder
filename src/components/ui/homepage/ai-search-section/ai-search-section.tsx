"use client";

import EFCard from "@/components/shared/molecules/ef-card";
import { Button } from "@/components/shared/shadcn-components/button";
import { Textarea } from "@/components/shared/shadcn-components/textarea";
import {
  H2,
  TypographyMuted
} from "@/components/shared/shadcn-components/typography";
import { PUBLIC_PAGE_ROUTE } from "@/routes";
import {
  MapPin,
  Mountain,
  Send,
  Sparkles,
  TreePine,
  Waves
} from "lucide-react";
import { useRouter } from "nextjs-toploader/app";
import { useState } from "react";
import { toast } from "sonner";

const suggestedPrompts = [
  { icon: Mountain, text: "Mountain hiking adventure" },
  { icon: Waves, text: "Beach getaway with friends" },
  { icon: TreePine, text: "Peaceful nature retreat" },
  { icon: MapPin, text: "City exploration weekend" }
];

export default function AISearchSection() {
  const router = useRouter();

  const [prompt, setPrompt] = useState("");

  const handleSearch = (p?: string) => {
    const finalPrompt = p || prompt;

    if (!finalPrompt.trim()) {
      toast.info("Please enter a prompt");
      return;
    }

    router.push(
      `${PUBLIC_PAGE_ROUTE.AI}?prompt=${encodeURIComponent(finalPrompt)}`
    );
  };

  return (
    <EFCard rootClassName="bg-primary/3 rounded-xl border-0">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-md gradient-warm flex items-center justify-center shadow-soft ">
            <Sparkles className="size-8 text-primary" />
          </div>
          <div>
            <H2 className="text-xl md:text-2xl font-semibold text-foreground">
              AI Event Finder
            </H2>
            <TypographyMuted>
              Describe your dream trip and we&apos;ll find matching events
            </TypographyMuted>
          </div>
        </div>

        {/* Prompt Input */}
        <div className="relative mb-6">
          <Textarea
            placeholder="e.g., I want a weekend hiking trip in the mountains with a group of 5-10 people, moderate difficulty..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="min-h-[120px] resize-none bg-background border-border/50 rounded-xl p-4 pr-14 font-body text-foreground placeholder:text-muted-foreground/60 focus:ring-2 focus:ring-primary/20! focus:border-primary! transition-all"
          />
          <Button
            size="icon"
            onClick={() => handleSearch()}
            className="absolute bottom-4 right-4 h-10 w-10 rounded-lg bg-primary hover:bg-primary/90 dark:text-primary"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>

        {/* Suggested Prompts */}
        <div className="flex flex-col gap-3">
          <TypographyMuted className="text-sm">
            Try these suggestions:
          </TypographyMuted>
          <div className="flex flex-wrap gap-2">
            {suggestedPrompts.map((suggestion, index) => (
              <Button
                key={index}
                onClick={() => handleSearch(suggestion.text)}
                className="group-hover inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/15! text-primary! hover:text-primary-foreground! font-body text-sm transition-all duration-300 scale-98 hover:scale-100"
              >
                <suggestion.icon className="h-4 w-4 hover:text-primary" />
                {suggestion.text}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </EFCard>
  );
}
