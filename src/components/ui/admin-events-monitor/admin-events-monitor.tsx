"use client";

import { EmptyList } from "@/components/shared/molecules/empty";
import { PageLoader } from "@/components/shared/molecules/page-loader";
import { TablePagination } from "@/components/shared/organisms/data-table/table-pagination";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/shared/shadcn-components/accordion";
import { Badge } from "@/components/shared/shadcn-components/badge";
import { Button } from "@/components/shared/shadcn-components/button";
import { Input } from "@/components/shared/shadcn-components/input";
import {
  Table,
  TableBody,
  TableCell,
  TableRow
} from "@/components/shared/shadcn-components/table";
import { Paragraph } from "@/components/shared/shadcn-components/typography";
import AdminRepository from "@/repositories/admin.repository";
import { PUBLIC_DYNAMIC_PAGE_ROUTE } from "@/routes";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import { Search } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { useDebounce } from "use-debounce";
import { EVENT_STATUS, PAYMENT_STATUS } from "../../../../server/enums";

const paymentBadgeVariant = (status: PAYMENT_STATUS) => {
  if (status === PAYMENT_STATUS.SUCCESS) return "success";
  if (status === PAYMENT_STATUS.FAILED) return "destructive";
  if (status === PAYMENT_STATUS.CANCELLED) return "secondary";
  return "outline";
};

const eventBadgeVariant = (status: EVENT_STATUS) => {
  if (status === EVENT_STATUS.BLOCKED) return "destructive";
  if (status === EVENT_STATUS.CLOSED) return "secondary";
  if (status === EVENT_STATUS.FINISHED) return "outline";
  return "success";
};

const getDisplayName = (item: {
  email: string;
  profile?: { firstName: string; lastName: string } | null;
}) => {
  const fullName =
    `${item.profile?.firstName ?? ""} ${item.profile?.lastName ?? ""}`.trim();
  return fullName || item.email;
};

export default function AdminEventsMonitor() {
  const queryClient = useQueryClient();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const [debouncedSearch] = useDebounce(search, 500);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-events", debouncedSearch, page],
    queryFn: () =>
      AdminRepository.getEvents({
        page,
        limit: 10,
        search: debouncedSearch || undefined
      })
  });

  const { mutate: blockEvent } = useMutation({
    mutationFn: (eventId: string) => AdminRepository.blockEvent(eventId),
    onMutate: () => ({ toastId: toast.loading("Blocking event...") }),
    onSuccess: (_, __, context) => {
      toast.success("Event blocked", { id: context?.toastId });
      queryClient.invalidateQueries({ queryKey: ["admin-events"] });
    },
    onError: (error: any, __, context) => {
      toast.error(error?.message || "Failed to block event", {
        id: context?.toastId
      });
    }
  });

  const events = useMemo(() => data?.events ?? [], [data]);
  const totalPages = Math.max(1, Math.ceil((data?.total ?? 0) / 10));

  return (
    <div className="flex flex-col gap-4">
      <div className="relative w-full max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          placeholder="Search by title, place, host, email..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="pl-9 h-11"
        />
      </div>

      {isLoading ? (
        <PageLoader />
      ) : !events.length ? (
        <EmptyList message="No events found" />
      ) : (
        <Accordion type="multiple" className="w-full border rounded-md px-4">
          {events.map((event) => {
            const profileId = event.host?.profile?._id?.toString();
            const eventId = event._id.toString();

            return (
              <AccordionItem value={eventId} key={eventId} className="py-1">
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex w-full items-center justify-between gap-3 pr-3">
                    <div className="text-left">
                      <Paragraph className="font-semibold text-primary">
                        {event.title}
                      </Paragraph>
                      <Paragraph className="text-xs text-muted-foreground">
                        {event.placeName} •{" "}
                        {dayjs(event.createdAt).format("MMM D, YYYY")}
                      </Paragraph>
                    </div>
                    <Badge
                      variant={eventBadgeVariant(event.status)}
                      className="capitalize"
                    >
                      {event.status}
                    </Badge>
                  </div>
                </AccordionTrigger>

                <AccordionContent className="flex flex-col gap-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                    <Paragraph>Title: {event.title}</Paragraph>
                    <Paragraph>Place: {event.placeName}</Paragraph>
                    <Paragraph>
                      Host:{" "}
                      {profileId ? (
                        <Link
                          href={PUBLIC_DYNAMIC_PAGE_ROUTE.PROFILE(profileId)}
                          className="hover:underline"
                        >
                          {event.host
                            ? getDisplayName(event.host)
                            : "Unknown host"}
                        </Link>
                      ) : (
                        event.host?.email || "Unknown host"
                      )}
                    </Paragraph>
                    <Paragraph>Members joined: {event.memberCount}</Paragraph>
                    <Paragraph>
                      Total collection: BDT {event.totalCollection}
                    </Paragraph>
                    <Paragraph>Event fee: BDT {event.entryFee}</Paragraph>
                  </div>

                  <div className="rounded-md border">
                    <Table>
                      <TableBody>
                        {event.payments.length ? (
                          event.payments.map((payment) => (
                            <TableRow key={payment._id.toString()}>
                              <TableCell>
                                <div className="flex flex-col">
                                  <span className="font-medium">
                                    {getDisplayName(payment.user)}
                                  </span>
                                  <span className="text-xs text-muted-foreground">
                                    {payment.user.email}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell className="font-mono text-xs">
                                {payment.tranId}
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant={paymentBadgeVariant(payment.status)}
                                  className="capitalize"
                                >
                                  {payment.status}
                                </Badge>
                              </TableCell>
                              <TableCell>BDT {payment.amount}</TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell
                              colSpan={4}
                              className="text-muted-foreground"
                            >
                              <EmptyList message="No members found" />
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="destructive"
                      disabled={event.status === EVENT_STATUS.BLOCKED}
                      onClick={() => blockEvent(eventId)}
                    >
                      Block event
                    </Button>
                    <Link
                      href={PUBLIC_DYNAMIC_PAGE_ROUTE.EVENT_DETAILS(eventId)}
                    >
                      <Button variant="outline">View details</Button>
                    </Link>
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      )}

      <TablePagination
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        isLoading={isLoading}
      />
    </div>
  );
}
