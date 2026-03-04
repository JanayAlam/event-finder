"use client";

import { Skeleton } from "@/components/shared/shadcn-components/skeleton";
import { GrowthChart } from "@/components/ui/admin-dashboard/growth-chart";
import { LeadingHosts } from "@/components/ui/admin-dashboard/leading-hosts";
import { QuickActions } from "@/components/ui/admin-dashboard/quick-actions";
import { StatCard } from "@/components/ui/admin-dashboard/stat-card";
import { TopDestinations } from "@/components/ui/admin-dashboard/top-destinations";
import AdminRepository from "@/repositories/admin.repository";
import { PRIVATE_ADMIN_ONLY_PAGE_ROUTE } from "@/routes";
import { useQuery } from "@tanstack/react-query";
import {
  Calendar,
  ClipboardList,
  MapPin,
  MessageSquare,
  ShieldCheck,
  TrendingUp,
  UserPlus,
  Users
} from "lucide-react";

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
      bgFullOpacity: "bg-blue-500",
      link: PRIVATE_ADMIN_ONLY_PAGE_ROUTE.USER_MANAGEMENT
    },
    {
      title: "New Users",
      value: stats?.newUsersThisMonth || 0,
      description: "Joined this month",
      icon: UserPlus,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      bgFullOpacity: "bg-emerald-500",
      link: PRIVATE_ADMIN_ONLY_PAGE_ROUTE.USER_MANAGEMENT
    },
    {
      title: "Active Hosts",
      value: stats?.totalHosts || 0,
      description: "Verified trip organizers",
      icon: ShieldCheck,
      color: "text-indigo-500",
      bg: "bg-indigo-500/10",
      bgFullOpacity: "bg-indigo-500",
      link: PRIVATE_ADMIN_ONLY_PAGE_ROUTE.USER_MANAGEMENT
    },
    {
      title: "Total Events",
      value: stats?.totalEvents || 0,
      description: "Trips and gatherings",
      icon: Calendar,
      color: "text-orange-500",
      bg: "bg-orange-500/10",
      bgFullOpacity: "bg-orange-500"
    },
    {
      title: "Recent Events",
      value: stats?.eventsThisMonth || 0,
      description: "Scheduled this month",
      icon: TrendingUp,
      color: "text-rose-500",
      bg: "bg-rose-500/10",
      bgFullOpacity: "bg-rose-500"
    },
    {
      title: "Discussions",
      value: stats?.totalDiscussions || 0,
      description: "Community interactions",
      icon: MessageSquare,
      color: "text-sky-500",
      bg: "bg-sky-500/10",
      bgFullOpacity: "bg-sky-500"
    },
    {
      title: "Pending Verifications",
      value: stats?.pendingVerifications || 0,
      description: "Profiles awaiting review",
      icon: ClipboardList,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      bgFullOpacity: "bg-amber-500",
      link: PRIVATE_ADMIN_ONLY_PAGE_ROUTE.APPROVAL_ACCOUNT_VERIFICATION
    },
    {
      title: "Promotion Requests",
      value: stats?.pendingPromotions || 0,
      description: "Host applications",
      icon: MapPin,
      color: "text-fuchsia-500",
      bg: "bg-fuchsia-500/10",
      bgFullOpacity: "bg-fuchsia-500",
      link: PRIVATE_ADMIN_ONLY_PAGE_ROUTE.APPROVAL_HOST_VERIFICATION
    }
  ];

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-10">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-7">
        <GrowthChart growth={stats?.growth} />
        <TopDestinations locations={stats?.popularLocations} />
      </div>

      <div className="grid gap-6 md:grid-cols-7">
        <LeadingHosts hosts={stats?.topHosts} />
        <QuickActions />
      </div>
    </div>
  );
}
