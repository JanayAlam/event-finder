import { Spinner } from "../../shadcn-components/spinner";

export const PageLoader = () => {
  return (
    <div className="flex items-center justify-center py-10">
      <Spinner className="size-10" />
    </div>
  );
};
