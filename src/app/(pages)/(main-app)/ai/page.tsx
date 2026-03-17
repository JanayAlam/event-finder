import { Metadata } from "next";
import { AIContent } from "./ai-content";

export const metadata: Metadata = {
  title: "AI Workspace"
};

export default function AISearchPage() {
  return <AIContent />;
}
