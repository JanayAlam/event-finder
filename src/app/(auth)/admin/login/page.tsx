import AdminLoginForm from "@/components/ui/forms/admin-login-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin login | Bhalo Thaki",
  description: "Super and outlet admin login page"
};

export default function AdminLogin() {
  return (
    <div>
      <div className="min-h-screen flex justify-center items-center">
        <AdminLoginForm />
      </div>
    </div>
  );
}
