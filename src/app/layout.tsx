import "./reset.css";

import "./globals.css";

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
