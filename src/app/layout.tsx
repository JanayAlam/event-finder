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
    default: "Event Finder",
    template: "%s | Event Finder"
  },
  description: "Event Finder — Find the best group trips around you"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <NextTopLoader showSpinner={false} color="var(--primary)" />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
