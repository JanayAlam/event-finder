import axios, { AxiosError } from "axios";
import React, { useState } from "react";
import { z } from "zod";

const LoginSchema = z.object({
  email: z.string().email({ message: "Invalid email format" }).trim(),
  password: z
    .string()
    .trim()
    .min(6, "Password must be at least 6 characters long")
});

const LoginForm: React.FC = () => {
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
      const res = await axios.post(
        "http://localhost:5000/api/v1/admins/login",
        result.data,
        {
          withCredentials: true
        }
      );
      // Redirect or handle successful login
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
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
        {errors.email && <div>{errors.email.join(", ")}</div>}
      </div>
      <div>
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
        />
        {errors.password && <div>{errors.password.join(", ")}</div>}
      </div>
      {errors.general && <div>{errors.general.join(", ")}</div>}
      <button type="submit">Login</button>
    </form>
  );
};

export default LoginForm;
