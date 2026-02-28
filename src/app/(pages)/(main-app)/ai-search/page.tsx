import { Spinner } from "@/components/shared/shadcn-components/spinner";
import { Suspense } from "react";
import { AISearchResultContent } from "./ai-search-content";

export default function AISearchPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-10">
          <Spinner className="size-10" />
        </div>
      }
    >
      <AISearchResultContent />
    </Suspense>
  );
}
