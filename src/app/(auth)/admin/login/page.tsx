import Head from "next/head";
import { useActionState } from "react";
import { adminLoginHandler } from "./actions";

export default function AdminLogin() {
  const [state, submitHandler] = useActionState(adminLoginHandler, {
    errors: {}
  });

  return (
    <>
      <Head>
        <title>Admin Login</title>
      </Head>
      <main>
        <form action={submitHandler} className="mt-8 space-y-6">
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
              />
              {state.errors?.email && (
                <p className="my-2 text-sm text-red-600">
                  {state.errors.email}
                </p>
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
              />
              {state.errors?.password && (
                <p className="my-2 text-sm text-red-600">
                  {state.errors.password}
                </p>
              )}
            </div>
          </div>

          {state.errors?.general && (
            <div className="text-red-600 text-sm">{state.errors.general}</div>
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
      </main>
    </>
  );
}
