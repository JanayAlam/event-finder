import {
  H1,
  Paragraph,
  TypographyMuted
} from "@/components/shared/shadcn-components/typography";
import { PUBLIC_PAGE_ROUTE } from "@/routes";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import CreateEventForm from "./CreateEventForm";

export default function CreateEventPage() {
  return (
    <div className="flex flex-col gap-6">
      <Link href={PUBLIC_PAGE_ROUTE.HOME}>
        <Paragraph className="text-sm flex gap-2 items-center">
          <ArrowLeft className="size-4" />
          Back to home
        </Paragraph>
      </Link>

      <div className="flex flex-col gap-1">
        <H1 className="text-2xl">Create new event</H1>
        <TypographyMuted>
          Fill in the details to start your adventure
        </TypographyMuted>
      </div>
      <CreateEventForm />
    </div>
  );
}
