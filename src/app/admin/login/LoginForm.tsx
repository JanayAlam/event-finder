"use client";

interface IProps {}

import React, { useActionState } from "react";
import { login } from "./actions";
import SubmitButton from "./SubmitButton";

const LoginForm: React.FC<IProps> = () => {
  const [state, loginAction] = useActionState(login, undefined);

  return (
    <main className="bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Welcome Back</h1>
          <p className="text-gray-500">Sign in to continue </p>
        </div>

        <form action={loginAction} className="space-y-6">
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Email address
            </label>
            <input
              name="email"
              type="email-address"
              autoComplete="email-address"
              placeholder="Type your email address"
              required
              className="px-2 py-3 mt-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm"
            />
            {state?.errors?.email ? (
              <p className="mt-1 w-full text-sm font-small text-red-500">
                {state.errors.email}
              </p>
            ) : null}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm  text-gray-700">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Type your password"
              autoComplete="password"
              required
              className="px-2 py-3 mt-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm"
            />
            {state?.errors?.password ? (
              <p className="mt-1 w-full text-sm text-red-500">
                {state.errors.password}
              </p>
            ) : null}
          </div>

          <SubmitButton />
        </form>
      </div>
    </main>
  );
};

export default LoginForm;
