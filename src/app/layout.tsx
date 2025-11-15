import "./reset.css";

import "./globals.css";

import MainNavbar from "@/components/ui/main-navbar";
import SecondaryNavbar from "@/components/ui/secondary-navbar";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { Providers } from "./providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter"
});

export const metadata: Metadata = {
  title: "Trip Mate",
  description: "Trip Mate platform"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <Toaster reverseOrder={false} />
          <MainNavbar />
          <SecondaryNavbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
