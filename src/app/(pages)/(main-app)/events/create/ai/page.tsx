import { Metadata } from "next";
import { CreateEventMultiStageForm } from "./create-event-multi-stage-form";

export const metadata: Metadata = {
  title: "Create event with ai"
};

export default function CreateEventWithAiPage() {
  return <CreateEventMultiStageForm />;
}
