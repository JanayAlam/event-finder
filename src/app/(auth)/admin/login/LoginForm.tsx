import { axiosInstance } from "@/axios";
import { AxiosError } from "axios";
import React, { useState } from "react";
import { z } from "zod";

const LoginSchema = z.object({
  email: z.string().email({ message: "Invalid email format" }).trim(),
  password: z
    .string()
    .trim()
    .min(6, "Password must be at least 6 characters long")
});

const LoginForm = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<{ [key: string]: string[] }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = LoginSchema.safeParse(formData);

    if (!result.success) {
      setErrors(result.error.flatten().fieldErrors);
      return;
    }

    try {
      await axiosInstance.post("/admins/login", result.data);
      window.location.href = "/";
    } catch (err) {
      if (err instanceof AxiosError) {
        if (err.response?.status === 400) {
          setErrors(err.response?.data);
        } else {
          setErrors({ general: [err.message] });
        }
      } else {
        setErrors({ general: [(err as Error).message] });
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm -space-y-px">
            <div className="mb-5 text-center">
              <legend className="text-3xl font-bold">Admin Login</legend>
            </div>
            <div>
              <label htmlFor="email" className="sr-only">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && (
                <p className="my-2 text-sm text-red-600">{errors.email}</p>
              )}
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
              {errors.password && (
                <p className="my-2 text-sm text-red-600">{errors.password}</p>
              )}
            </div>
          </div>

          {errors.general && (
            <div className="text-red-600 text-sm">
              {errors.general.join(", ")}
            </div>
          )}

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
