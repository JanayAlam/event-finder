import "./reset.css";

import "./globals.css";

import { Inter } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import { Providers } from "./providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter"
});

export const metadata = {
  title: {
    default: "EventFinder",
    template: "%s | EventFinder"
  },
  description: "EventFinder — Find the best group trips around you"
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
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
