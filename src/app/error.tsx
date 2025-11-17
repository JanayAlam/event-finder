"use client";

import { Button } from "@/components/shared/shadcn-components/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle
} from "@/components/shared/shadcn-components/empty";
import { H1 } from "@/components/shared/shadcn-components/typography";
import { NODE_ENV } from "@/config";
import { AxiosError } from "axios";

interface IProps {
  error: Error;
  reset: () => void;
}

function getErrorStatus(error: Error): string | number | null {
  if ("statusCode" in error && typeof error.statusCode === "number") {
    return error.statusCode;
  }

  if ("status" in error && typeof error.status === "number") {
    return error.status;
  }

  if (error instanceof AxiosError && error.response?.status) {
    return error.response.status;
  }

  return null;
}

export default function ErrorBoundary({ error, reset }: IProps) {
  const isProductionBuild = NODE_ENV === "production";

  const statusCode = getErrorStatus(error);

  const displayText = !isProductionBuild
    ? statusCode
      ? `Error ${statusCode}`
      : error.name
    : "Error occured";

  return (
    <main>
      <Empty className="flex flex-col gap-10">
        <EmptyHeader>
          <EmptyTitle>
            <H1 className="text-destructive">{displayText}</H1>
          </EmptyTitle>
          <EmptyDescription>{error.message}</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <div className="flex flex-col gap-4">
            {!isProductionBuild ? (
              <EmptyDescription>{error.stack}</EmptyDescription>
            ) : null}
            <div>
              <Button onClick={reset} className="px-8" size="lg">
                Reset
              </Button>
            </div>
          </div>
        </EmptyContent>
      </Empty>
    </main>
  );
}
