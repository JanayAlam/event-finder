import { PageLoader } from "@/components/shared/molecules/page-loader";
import { Suspense } from "react";
import { AIContent } from "./ai-content";

export default function AISearchPage() {
  return (
    <Suspense fallback={<PageLoader />}>
      <AIContent />
    </Suspense>
  );
}
