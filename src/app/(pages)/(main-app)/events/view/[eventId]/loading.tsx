import { Spinner } from "@/components/shared/shadcn-components/spinner";

export default function EventDetailsLoading() {
  return (
    <div className="py-10 flex items-center justify-center">
      <Spinner className="size-10" />
    </div>
  );
}
