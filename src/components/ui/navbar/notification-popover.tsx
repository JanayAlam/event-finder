"use client";

import { Badge } from "@/components/shared/shadcn-components/badge";
import { Button } from "@/components/shared/shadcn-components/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/shared/shadcn-components/popover";
import { Skeleton } from "@/components/shared/shadcn-components/skeleton";
import {
  Paragraph,
  TypographyMuted
} from "@/components/shared/shadcn-components/typography";
import { PUBLIC_SERVER_URL } from "@/config";
import { cn } from "@/lib/utils";
import NotificationRepository from "@/repositories/notification.repository";
import { useAuthStore } from "@/stores/auth-store";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient
} from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { Bell, Check } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

export const NotificationPopover = () => {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: ["notifications"],
      queryFn: ({ pageParam = 1 }) =>
        NotificationRepository.getMyNotifications(pageParam),
      getNextPageParam: (lastPage, allPages) => {
        const nextPage = allPages.length + 1;
        return lastPage.notifications.length === 10 ? nextPage : undefined;
      },
      initialPageParam: 1,
      enabled: !!user
    });

  const unreadCount = data?.pages[0]?.unreadCount || 0;

  useEffect(() => {
    if (!user) return;

    const socket = io(PUBLIC_SERVER_URL, { withCredentials: true });

    socket.on("connect", () => {
      socket.emit("join-user", user._id.toString());
    });

    socket.on("new-notification", () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    });

    return () => {
      socket.disconnect();
    };
  }, [user, queryClient]);

  const markAsReadMutation = useMutation({
    mutationFn: (id?: string) => NotificationRepository.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    }
  });

  const notifications = data?.pages.flatMap((page) => page.notifications) || [];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="relative p-2">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px] rounded-full border-2 border-background"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-4 border-b">
          <h4 className="font-semibold text-sm">Notifications</h4>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-auto p-1 text-primary hover:text-primary/80"
              onClick={() => markAsReadMutation.mutate(undefined)}
            >
              <Check className="h-3 w-3 mr-1" />
              Mark all read
            </Button>
          )}
        </div>
        <div className="max-h-[400px] overflow-y-auto">
          {isLoading ? (
            <div className="p-4 space-y-3">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : notifications.length > 0 ? (
            <div className="flex flex-col">
              {notifications.map((notif) => (
                <div
                  key={notif._id.toString()}
                  className={cn(
                    "p-4 border-b last:border-0 hover:bg-secondary/20 transition-colors cursor-pointer relative",
                    !notif.isRead && "bg-primary/5"
                  )}
                  onClick={() => {
                    if (!notif.isRead)
                      markAsReadMutation.mutate(notif._id.toString());
                    if (notif.link) {
                      setOpen(false);
                    }
                  }}
                >
                  {notif.link ? (
                    <Link href={notif.link} className="block">
                      <Paragraph className="text-sm leading-tight mb-1">
                        {notif.message}
                      </Paragraph>
                      <TypographyMuted className="text-[10px]">
                        {formatDistanceToNow(new Date(notif.createdAt), {
                          addSuffix: true
                        })}
                      </TypographyMuted>
                    </Link>
                  ) : (
                    <>
                      <Paragraph className="text-sm leading-tight mb-1">
                        {notif.message}
                      </Paragraph>
                      <TypographyMuted className="text-[10px]">
                        {formatDistanceToNow(new Date(notif.createdAt), {
                          addSuffix: true
                        })}
                      </TypographyMuted>
                    </>
                  )}
                  {!notif.isRead && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-primary" />
                  )}
                </div>
              ))}
              {hasNextPage && (
                <div className="p-2 border-t">
                  <Button
                    variant="ghost"
                    className="w-full text-xs h-8"
                    onClick={() => fetchNextPage()}
                    disabled={isFetchingNextPage}
                  >
                    {isFetchingNextPage ? "Loading..." : "Load more"}
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="p-8 text-center">
              <TypographyMuted>No notifications yet</TypographyMuted>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};
