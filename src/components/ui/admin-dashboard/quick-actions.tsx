"use client";

import { Button } from "@/components/shared/shadcn-components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/shared/shadcn-components/card";
import { PRIVATE_ADMIN_ONLY_PAGE_ROUTE } from "@/routes";
import { ClipboardList, Facebook, ShieldCheck, Users } from "lucide-react";
import Link from "next/link";

export function QuickActions() {
  return (
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
          <Link href={PRIVATE_ADMIN_ONLY_PAGE_ROUTE.APPROVAL_HOST_VERIFICATION}>
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
            href={PRIVATE_ADMIN_ONLY_PAGE_ROUTE.APPROVAL_ACCOUNT_VERIFICATION}
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
            <Facebook className="mr-3 h-5 w-5 text-sky-500 group-hover:scale-110 transition-transform" />
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
  );
}
