import { PageLoader } from "@/components/shared/molecules/page-loader";
import { Suspense } from "react";
import { AISearchResultContent } from "./ai-search-content";

export default function AISearchPage() {
  return (
    <Suspense fallback={<PageLoader />}>
      <AISearchResultContent />
    </Suspense>
  );
}
