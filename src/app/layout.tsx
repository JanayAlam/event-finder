import "./reset.css";

import "./globals.css";

import Navbar from "@/components/ui/navbar";
import { PAGE_WIDTH_CLASS_NAME } from "@/constants";
import { cn } from "@/utils/tailwind-utils";
import { Inter } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import { Providers } from "./providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter"
});

export const metadata = {
  title: {
    default: "TripMate",
    template: "%s | TripMate"
  },
  description: "TripMate — Find the best group trips around you"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <NextTopLoader showSpinner={false} color="#ff751f" />
        <Providers>
          <Navbar />
          <div className="w-full flex justify-center py-4">
            <div className={cn(PAGE_WIDTH_CLASS_NAME)}>{children}</div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
