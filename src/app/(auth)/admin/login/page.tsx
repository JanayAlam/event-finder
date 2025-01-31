"use client";

import Head from "next/head";
import LoginForm from "./LoginForm";

const page = () => {
  return (
    <>
      <Head>
        <title>Admin Login</title>
      </Head>
      <main>
        <LoginForm />
      </main>
    </>
  );
};

export default page;
