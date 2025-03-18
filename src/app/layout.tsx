// import "./reset.css";

import "@ant-design/v5-patch-for-react-19";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({
  subsets: ["latin"]
});

export const metadata: Metadata = {
  title: "Bhalo Thaki",
  description: "Bhalo Thaki e-commerce platform"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="light">
      <body className={inter.className}>
        <Providers>
          <Toaster reverseOrder={false} />
          {children}
        </Providers>
      </body>
    </html>
  );
}
