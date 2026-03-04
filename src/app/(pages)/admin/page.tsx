"use client";

import { Button } from "@/components/shared/shadcn-components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/shared/shadcn-components/card";
import { Skeleton } from "@/components/shared/shadcn-components/skeleton";
import AdminRepository from "@/repositories/admin.repository";
import { PRIVATE_ADMIN_ONLY_PAGE_ROUTE } from "@/routes";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  Calendar,
  ClipboardList,
  MapPin,
  MessageSquare,
  ShieldCheck,
  TrendingUp,
  UserPlus,
  Users
} from "lucide-react";
import Link from "next/link";

export default function AdminDashboardPage() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["admin-statistics"],
    queryFn: () => AdminRepository.getStatistics()
  });

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <div>
          <Skeleton className="h-10 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Users",
      value: stats?.totalUsers || 0,
      description: "Total registered members",
      icon: Users,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      link: PRIVATE_ADMIN_ONLY_PAGE_ROUTE.USER_MANAGEMENT
    },
    {
      title: "New Users",
      value: stats?.newUsersThisMonth || 0,
      description: "Joined this month",
      icon: UserPlus,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      link: PRIVATE_ADMIN_ONLY_PAGE_ROUTE.USER_MANAGEMENT
    },
    {
      title: "Active Hosts",
      value: stats?.totalHosts || 0,
      description: "Verified trip organizers",
      icon: ShieldCheck,
      color: "text-indigo-500",
      bg: "bg-indigo-500/10",
      link: PRIVATE_ADMIN_ONLY_PAGE_ROUTE.USER_MANAGEMENT // Could be filtered
    },
    {
      title: "Total Events",
      value: stats?.totalEvents || 0,
      description: "Trips and gatherings",
      icon: Calendar,
      color: "text-orange-500",
      bg: "bg-orange-500/10"
    },
    {
      title: "Recent Events",
      value: stats?.eventsThisMonth || 0,
      description: "Scheduled this month",
      icon: TrendingUp,
      color: "text-rose-500",
      bg: "bg-rose-500/10"
    },
    {
      title: "Discussions",
      value: stats?.totalDiscussions || 0,
      description: "Community interactions",
      icon: MessageSquare,
      color: "text-sky-500",
      bg: "bg-sky-500/10"
    },
    {
      title: "Pending Verifications",
      value: stats?.pendingVerifications || 0,
      description: "IDs awaiting review",
      icon: ClipboardList,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      link: PRIVATE_ADMIN_ONLY_PAGE_ROUTE.APPROVAL_ACCOUNT_VERIFICATION
    },
    {
      title: "Promotion Requests",
      value: stats?.pendingPromotions || 0,
      description: "Host applications",
      icon: MapPin,
      color: "text-fuchsia-500",
      bg: "bg-fuchsia-500/10",
      link: PRIVATE_ADMIN_ONLY_PAGE_ROUTE.APPROVAL_HOST_VERIFICATION
    }
  ];

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-10">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, index) => (
          <Card
            key={index}
            className="group relative overflow-hidden border-none shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-card/40 backdrop-blur-md border border-white/10"
          >
            <div
              className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full blur-2xl opacity-20 transition-opacity group-hover:opacity-40 ${stat.bg.replace("/10", "")}`}
            />

            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 relative z-10">
              <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground sm:max-w-[130px]">
                {stat.title}
              </CardTitle>
              <div
                className={`p-3 rounded-xl shadow-inner transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 ${stat.bg}`}
              >
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </CardHeader>

            <CardContent className="relative z-10 flex flex-col gap-2">
              <div className="text-3xl font-bold tracking-tight">
                {stat.value}
              </div>
              <p className="text-xs text-muted-foreground mt-2 font-medium">
                {stat.description}
              </p>

              {stat.link && (
                <Link
                  href={stat.link}
                  className="mt-4 flex items-center text-xs font-bold text-primary opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-[-10px] group-hover:translate-x-0"
                >
                  View Details <ArrowRight className="ml-1 h-3 w-3" />
                </Link>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-7">
        <Card className="md:col-span-4 border-none shadow-lg bg-card/40 backdrop-blur-md">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Platform Growth</CardTitle>
            <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-primary" />
                Users
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-orange-500" />
                Events
              </div>
            </div>
          </CardHeader>
          <CardContent className="h-[300px] flex flex-col justify-end gap-2 border-t border-border/50 pt-8 mt-2">
            <div className="flex items-end justify-between h-full px-4 gap-4">
              {stats?.growth.users.map((item, i) => {
                const userMax = Math.max(
                  ...stats.growth.users.map((u) => u.count),
                  1
                );
                const eventMax = Math.max(
                  ...stats.growth.events.map((e) => e.count),
                  1
                );
                const max = Math.max(userMax, eventMax);

                const userHeight = (item.count / max) * 100;
                const eventCount =
                  stats.growth.events.find(
                    (e) =>
                      e._id.month === item._id.month &&
                      e._id.year === item._id.year
                  )?.count || 0;
                const eventHeight = (eventCount / max) * 100;

                const monthName = new Date(
                  2000,
                  item._id.month - 1
                ).toLocaleString("default", { month: "short" });

                return (
                  <div
                    key={i}
                    className="flex-1 flex flex-col items-center gap-3 group"
                  >
                    <div className="w-full flex items-end justify-center gap-1 h-full">
                      <div
                        className="w-1/3 bg-primary/40 hover:bg-primary transition-all duration-500 rounded-t-sm relative group/bar"
                        style={{ height: `${Math.max(userHeight, 2)}%` }}
                      >
                        <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground px-2 py-1 rounded text-[10px] font-bold opacity-0 group-hover/bar:opacity-100 transition-opacity shadow-xl border border-border z-20 whitespace-nowrap">
                          {item.count} Users
                        </div>
                      </div>
                      <div
                        className="w-1/3 bg-orange-500/40 hover:bg-orange-500 transition-all duration-500 rounded-t-sm relative group/bar"
                        style={{ height: `${Math.max(eventHeight, 2)}%` }}
                      >
                        <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground px-2 py-1 rounded text-[10px] font-bold opacity-0 group-hover/bar:opacity-100 transition-opacity shadow-xl border border-border z-20 whitespace-nowrap">
                          {eventCount} Events
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">
                      {monthName}
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-3 border-none shadow-lg bg-card/40 backdrop-blur-md">
          <CardHeader>
            <CardTitle>Top Destinations</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {stats?.popularLocations.length ? (
              stats.popularLocations.map((loc, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-500 font-bold text-xs ring-1 ring-orange-500/20 transition-transform duration-300">
                      {i + 1}
                    </div>
                    <span className="text-sm font-medium">{loc._id}</span>
                  </div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground bg-muted/50 px-2.5 py-1 rounded-md border border-border/50">
                    {loc.count} Events
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10 text-muted-foreground text-sm">
                No destination data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-7">
        <Card className="md:col-span-3 border-none shadow-lg bg-card/40 backdrop-blur-md">
          <CardHeader>
            <CardTitle>Leading Hosts</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {stats?.topHosts.length ? (
              stats.topHosts.map((host, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500 font-bold text-xs ring-1 ring-blue-500/20">
                      {i + 1}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium truncate max-w-[150px]">
                        {host.email.split("@")[0]}
                      </span>
                      <span className="text-[10px] text-muted-foreground truncate max-w-[150px]">
                        {host.email}
                      </span>
                    </div>
                  </div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-primary bg-primary/10 px-2.5 py-1 rounded-md border border-primary/20">
                    {host.eventCount} Organized
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10 text-muted-foreground text-sm">
                No host data available
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="md:col-span-4 border-none shadow-lg bg-card/40 backdrop-blur-md">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button
              asChild
              variant="outline"
              className="justify-start h-14 hover:bg-primary/5 border-primary/20 group"
            >
              <Link
                href={PRIVATE_ADMIN_ONLY_PAGE_ROUTE.APPROVAL_HOST_VERIFICATION}
              >
                <ShieldCheck className="mr-3 h-5 w-5 text-indigo-500 group-hover:scale-110 transition-transform" />
                <div className="flex flex-col items-start">
                  <span className="text-sm">Host Applications</span>
                  <span className="text-[10px] text-muted-foreground">
                    Review pending requests
                  </span>
                </div>
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="justify-start h-14 hover:bg-primary/5 border-primary/20 group"
            >
              <Link
                href={
                  PRIVATE_ADMIN_ONLY_PAGE_ROUTE.APPROVAL_ACCOUNT_VERIFICATION
                }
              >
                <ClipboardList className="mr-3 h-5 w-5 text-amber-500 group-hover:scale-110 transition-transform" />
                <div className="flex flex-col items-start">
                  <span className="text-sm">Identity Verification</span>
                  <span className="text-[10px] text-muted-foreground">
                    Verify user accounts
                  </span>
                </div>
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="justify-start h-14 hover:bg-primary/5 border-primary/20 group"
            >
              <Link href={PRIVATE_ADMIN_ONLY_PAGE_ROUTE.USER_MANAGEMENT}>
                <Users className="mr-3 h-5 w-5 text-blue-500 group-hover:scale-110 transition-transform" />
                <div className="flex flex-col items-start">
                  <span className="text-sm">User Management</span>
                  <span className="text-[10px] text-muted-foreground">
                    Manage all members
                  </span>
                </div>
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="justify-start h-14 hover:bg-primary/5 border-primary/20 group"
            >
              <Link href={PRIVATE_ADMIN_ONLY_PAGE_ROUTE.FACEBOOK_INTEGRATION}>
                <MapPin className="mr-3 h-5 w-5 text-emerald-500 group-hover:scale-110 transition-transform" />
                <div className="flex flex-col items-start">
                  <span className="text-sm">Social Integration</span>
                  <span className="text-[10px] text-muted-foreground">
                    Facebook & API settings
                  </span>
                </div>
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
