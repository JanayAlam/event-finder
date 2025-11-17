import { Button } from "@/components/shared/shadcn-components/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle
} from "@/components/shared/shadcn-components/empty";
import { H1 } from "@/components/shared/shadcn-components/typography";
import { PUBLIC_PAGE_ROUTE } from "@/routes";
import Link from "next/link";
import React from "react";

const NotFoundPage: React.FC = () => {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyTitle>
          <H1>404 - Not Found</H1>
        </EmptyTitle>
        <EmptyDescription>
          The page you&apos;re looking for doesn&apos;t exist.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Link href={PUBLIC_PAGE_ROUTE.HOME}>
          <Button>Go to homepage</Button>
        </Link>
      </EmptyContent>
    </Empty>
  );
};

export default NotFoundPage;
