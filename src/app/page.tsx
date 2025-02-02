"use client";

import { logoutApi } from "@/api/auth";
import { handlePrivateApiError } from "@/utils/error-handlers";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { CommonApiError } from "./_types/common/error";

export default function Home() {
  const router = useRouter();

  const logout = async () => {
    try {
      await logoutApi();
      router.push("/admin/login");
    } catch (err) {
      const { data, error } = handlePrivateApiError(err as CommonApiError);
      toast.error(data?.message || error || "Could not logout");
    }
  };

  return (
    <main>
      <Link href="/admin/login">Go to login page</Link>
      <button onClick={logout}>Logout</button>
      <p>Hello World</p>
    </main>
  );
}
