"use client";

import { adminLoginFormSubmitAction } from "@/app/(auth)/admin/login/actions";
import { useAuthStore } from "@/store/auth-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { USER_ROLE } from "@prisma/client";
import { useRouter } from "next/navigation";
import React, { useCallback } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { TAdminLoginRequest } from "../../../../../server/types/admin";
import { AdminLoginDTOSchema } from "../../../../../server/validationSchemas/admin";

const AdminLoginForm: React.FC = () => {
  const router = useRouter();

  const setUser = useAuthStore((state) => state.setUser);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<TAdminLoginRequest>({
    resolver: zodResolver(AdminLoginDTOSchema),
    defaultValues: {},
    mode: "onBlur"
  });

  const formSubmitHandler = useCallback(
    async (loginFormData: TAdminLoginRequest) => {
      const { user, error } = await adminLoginFormSubmitAction(loginFormData);
      if (error) {
        toast.error(error.message);
        return;
      }

      if (user) {
        toast.success("Login successful");
        localStorage.setItem("user", JSON.stringify(user));
        setUser(user);

        if (user.role === USER_ROLE.SUPER_ADMIN) {
          router.push("/super-admin");
          return;
        }

        if (user.role === USER_ROLE.OUTLET_ADMIN) {
          router.push("/outlet-admin");
          return;
        }

        router.push("/");
      }
    },
    []
  );

  return (
    <form
      onSubmit={handleSubmit(formSubmitHandler)}
      className="w-[450px] p-10 rounded-md border border-gray-700 flex flex-col gap-2"
    >
      <div className="flex flex-col gap-1">
        <label className="w-full font-semibold" htmlFor="email-field">
          Email address
        </label>
        <div>
          <input
            className="w-full p-2 border border-gray-400 rounded-md text-gray-950"
            id="email-field"
            type="email"
            {...register("email")}
          />
          <div className="min-h-6">
            {errors?.email ? (
              <small className="text-red-700 font-bold">
                {errors.email.message}
              </small>
            ) : null}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label className="w-full font-semibold" htmlFor="password-field">
          Password
        </label>
        <div>
          <input
            area-required="true"
            id="password-field"
            type="password"
            className="w-full p-2 border border-gray-400 rounded-md text-gray-950"
            {...register("password")}
          />
          <div className="min-h-6">
            {errors?.password ? (
              <small className="text-red-700 font-bold">
                {errors.password.message}
              </small>
            ) : null}
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full border border-gray-950 bg-gray-900  disabled:bg-gray-500 text-gray-50 py-2 px-5 rounded-md"
      >
        {isSubmitting ? "Login..." : "Submit"}
      </button>

      {/* <div className="flex justify-center items-center">
        <button
          type="button"
          className="py-1 px-2 text-gray-700 hover:text-gray-950"
          onClick={() => setIsPhoneNumberLogin((prev) => !prev)}
        >
          Login with {isPhoneNumberLogin ? "email" : "phone"} instead
        </button>
      </div> */}
    </form>
  );
};

export default AdminLoginForm;
