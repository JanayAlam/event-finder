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
    <html lang="en">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  if (theme === 'dark' || theme === 'light') {
                    document.documentElement.classList.toggle('dark', theme === 'dark');
                  } else {
                    var systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                    document.documentElement.classList.toggle('dark', systemTheme === 'dark');
                  }
                } catch (e) {}
              })();
            `
          }}
        />
      </head>
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
