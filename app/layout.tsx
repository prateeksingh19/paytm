import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { AppbarClient } from "../components/AppbarClient";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Wallet",
  description: "Simple wallet app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Providers>
        <AppbarClient />


        
        <body>{children}</body>
      </Providers>
    </html>
  );
}
