"use client";

import { logoutApi } from "@/api/auth";
import { useAuthStore } from "@/store/auth-store";
import { handlePrivateApiError } from "@/utils/error-handlers";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { CommonApiError } from "./_types/common/error";

export default function Home() {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);

  const logout = async () => {
    try {
      await logoutApi();
      setUser(null);
      router.push("/admin/login");
    } catch (err) {
      const { data, error } = handlePrivateApiError(err as CommonApiError);
      toast.error(data?.message || error || "Could not logout");
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <Link href="/admin/login">Go to login page</Link>
      <Link href="/outlet-admin">Go to outlet admin page</Link>
      <div>
        <button onClick={logout}>Logout</button>
      </div>
    </div>
  );
}
