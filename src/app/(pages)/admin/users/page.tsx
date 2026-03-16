import AdminSectionCardLayout from "@/components/shared/layouts/admin-section-card-layout";
import { UserManagementTable } from "@/components/ui/user-management-table";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "User Management",
  description: "Manage all users, their roles, and block/unblock accounts."
};

export default function UserManagementPage() {
  return (
    <AdminSectionCardLayout
      title="User management"
      description="View and manage all registered users, their verification status and account access."
    >
      <UserManagementTable />
    </AdminSectionCardLayout>
  );
}
