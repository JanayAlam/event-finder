import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Super Admin Dashboard",
  description: "Dashboard for the super admin user"
};

export default function Page() {
  return (
    <main>
      <p>Super admin dashboard</p>
    </main>
  );
}
