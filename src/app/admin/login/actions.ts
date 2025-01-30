"use server";

import axios, { AxiosError } from "axios";
import { redirect } from "next/navigation";
import { z } from "zod";

const LoginSchema = z.object({
  email: z.string().email({ message: "Invalid email format" }).trim(),
  password: z
    .string()
    .trim()
    .min(6, "Password must be at least 6 characters long")
});

export const login = async (prevState: any, formData: FormData) => {
  const result = LoginSchema.safeParse(Object.fromEntries(formData));

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors
    };
  }

  try {
    const res = await axios.post(
      "http://localhost:5000/api/v1/admins/login",
      result.data
    );
  } catch (err) {
    if (err instanceof AxiosError) {
      if (err.response?.status === 400) {
        console.log(err.response?.data);

        return {
          errors: err.response?.data
        };
      }
      return {
        errors: {
          email: err.message,
          password: err.message
        }
      };
    }
  }

  redirect("/");
};
