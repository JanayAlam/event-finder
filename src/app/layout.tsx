import "./reset.css";

import "./globals.css";

import MainNavbar from "@/components/ui/main-navbar";
import { PAGE_WIDTH_CLASS_NAME } from "@/constants";
import { cn } from "@/utils/tailwind-utils";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
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
        <Providers>
          <Toaster reverseOrder={false} />
          <MainNavbar />
          <div className="w-full flex justify-center py-4">
            <div className={cn(PAGE_WIDTH_CLASS_NAME)}>{children}</div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
